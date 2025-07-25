const BaseService = require('./BaseService');
const Invoice = require('../models/Invoice');

class InvoiceService extends BaseService {
  constructor() {
    const populateOptions = [
      { path: 'customer', select: 'name email phone address' },
      { path: 'items.product', select: 'name sku price' }
    ];
    
    super(Invoice, 'Invoice', populateOptions);
  }

  // Custom search with invoice-specific fields
  async searchInvoices(queryString) {
    const searchableFields = [
      'invoiceNumber',
      'customer.name',
      'customer.email',
      'status',
      'description'
    ];
    
    return await this.search(queryString, searchableFields);
  }

  // Get invoice by invoice number
  async getByInvoiceNumber(invoiceNumber) {
    try {
      return await this.getByField('invoiceNumber', invoiceNumber);
    } catch (error) {
      throw error;
    }
  }

  // Get invoices by status
  async getByStatus(status, queryString = {}) {
    try {
      const modifiedQuery = { ...queryString, status };
      return await this.getAll(modifiedQuery);
    } catch (error) {
      throw error;
    }
  }

  // Get invoices by customer
  async getByCustomer(customerEmail, queryString = {}) {
    try {
      const invoices = await this.model.find({ 'customer.email': customerEmail })
        .populate(this.populateOptions)
        .sort('-createdAt');

      return {
        data: invoices,
        pagination: {
          page: 1,
          limit: invoices.length,
          total: invoices.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Get overdue invoices
  async getOverdueInvoices(queryString = {}) {
    try {
      const overdueFilter = {
        status: { $nin: ['paid', 'cancelled'] },
        dueDate: { $lt: new Date() }
      };

      const invoices = await this.model.find(overdueFilter)
        .populate(this.populateOptions)
        .sort('-dueDate');

      return {
        data: invoices,
        pagination: {
          page: 1,
          limit: invoices.length,
          total: invoices.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Mark invoice as sent
  async markAsSent(invoiceId, userId = null) {
    try {
      const invoice = await this.getById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.status !== 'draft') {
        throw new Error('Only draft invoices can be marked as sent');
      }

      const updatedInvoice = await this.update(invoiceId, {
        status: 'sent',
        sentDate: new Date(),
        sentBy: userId
      });

      return updatedInvoice;
    } catch (error) {
      throw error;
    }
  }

  // Mark invoice as paid
  async markAsPaid(invoiceId, paymentData, userId = null) {
    try {
      const invoice = await this.getById(invoiceId);
      if (!invoice) {
        throw new Error('Invoice not found');
      }

      if (invoice.status === 'paid') {
        throw new Error('Invoice is already paid');
      }

      const payment = {
        amount: paymentData.amount || invoice.total,
        method: paymentData.method || 'cash',
        reference: paymentData.reference,
        date: paymentData.date || new Date(),
        recordedBy: userId
      };

      const updatedInvoice = await this.update(invoiceId, {
        status: 'paid',
        paidDate: payment.date,
        payment
      });

      return updatedInvoice;
    } catch (error) {
      throw error;
    }
  }

  // Get invoices with custom filters
  async getWithFilters(filters) {
    try {
      const query = {};

      // Apply filters
      if (filters.status) query.status = filters.status;
      if (filters.customerEmail) query['customer.email'] = filters.customerEmail;
      if (filters.customerName) query['customer.name'] = new RegExp(filters.customerName, 'i');
      
      // Amount range
      if (filters.minAmount || filters.maxAmount) {
        query.total = {};
        if (filters.minAmount) query.total.$gte = parseFloat(filters.minAmount);
        if (filters.maxAmount) query.total.$lte = parseFloat(filters.maxAmount);
      }

      // Date filters
      if (filters.dateFrom) query.issueDate = { $gte: new Date(filters.dateFrom) };
      if (filters.dateTo) query.issueDate = { ...query.issueDate, $lte: new Date(filters.dateTo) };
      
      if (filters.dueDateFrom) query.dueDate = { $gte: new Date(filters.dueDateFrom) };
      if (filters.dueDateTo) query.dueDate = { ...query.dueDate, $lte: new Date(filters.dueDateTo) };

      const invoices = await this.model.find(query)
        .populate(this.populateOptions)
        .sort('-createdAt');

      return {
        data: invoices,
        pagination: {
          page: 1,
          limit: invoices.length,
          total: invoices.length,
          totalPages: 1,
          hasNextPage: false,
          hasPrevPage: false
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Duplicate invoice
  async duplicateInvoice(invoiceId) {
    try {
      const originalInvoice = await this.getById(invoiceId);
      if (!originalInvoice) {
        throw new Error('Invoice not found');
      }

      // Generate new invoice number
      const newInvoiceNumber = await this.generateInvoiceNumber();

      // Create duplicate with new data
      const duplicateData = {
        invoiceNumber: newInvoiceNumber,
        customer: originalInvoice.customer,
        items: originalInvoice.items,
        subtotal: originalInvoice.subtotal,
        tax: originalInvoice.tax,
        total: originalInvoice.total,
        notes: originalInvoice.notes,
        terms: originalInvoice.terms,
        status: 'draft',
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
      };

      const duplicateInvoice = await this.create(duplicateData);
      return duplicateInvoice;
    } catch (error) {
      throw error;
    }
  }

  // Generate recurring invoices
  async generateRecurringInvoices() {
    try {
      // This would typically check for recurring invoice templates
      // For now, we'll return an empty array
      const recurringInvoices = [];

      // Logic to find and generate recurring invoices would go here
      // Example: Find templates with recurring settings and create new invoices

      return recurringInvoices;
    } catch (error) {
      throw error;
    }
  }

  // Generate unique invoice number
  async generateInvoiceNumber() {
    try {
      let invoiceNumber;
      let exists = true;

      while (exists) {
        const year = new Date().getFullYear();
        const month = String(new Date().getMonth() + 1).padStart(2, '0');
        const random = Math.random().toString(36).substr(2, 6).toUpperCase();
        invoiceNumber = `INV-${year}${month}-${random}`;
        
        exists = await this.exists({ invoiceNumber });
      }

      return invoiceNumber;
    } catch (error) {
      throw error;
    }
  }

  // Get invoice statistics
  async getInvoiceStats() {
    try {
      const total = await this.count();
      
      const statusStats = await this.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Revenue statistics
      const revenueStats = await this.aggregate([
        {
          $match: { status: 'paid' }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$total' },
            avgInvoiceValue: { $avg: '$total' },
            paidInvoices: { $sum: 1 }
          }
        }
      ]);

      // Outstanding amount
      const outstandingStats = await this.aggregate([
        {
          $match: { status: { $in: ['sent', 'overdue'] } }
        },
        {
          $group: {
            _id: null,
            outstandingAmount: { $sum: '$total' },
            outstandingCount: { $sum: 1 }
          }
        }
      ]);

      // Monthly revenue trends
      const monthlyTrends = await this.aggregate([
        {
          $match: {
            status: 'paid',
            paidDate: {
              $gte: new Date(new Date().getFullYear(), new Date().getMonth() - 11, 1)
            }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$paidDate' },
              month: { $month: '$paidDate' }
            },
            revenue: { $sum: '$total' },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } }
      ]);

      // Top customers by revenue
      const topCustomers = await this.aggregate([
        {
          $match: { status: 'paid' }
        },
        {
          $group: {
            _id: '$customer.email',
            customerName: { $first: '$customer.name' },
            totalRevenue: { $sum: '$total' },
            invoiceCount: { $sum: 1 }
          }
        },
        { $sort: { totalRevenue: -1 } },
        { $limit: 10 }
      ]);

      return {
        totalInvoices: total,
        statusStats,
        revenue: revenueStats[0] || { totalRevenue: 0, avgInvoiceValue: 0, paidInvoices: 0 },
        outstanding: outstandingStats[0] || { outstandingAmount: 0, outstandingCount: 0 },
        monthlyTrends,
        topCustomers
      };
    } catch (error) {
      throw error;
    }
  }

  // Validate invoice data
  async validateInvoiceData(data, isUpdate = false, invoiceId = null) {
    try {
      const errors = [];

      // Required fields for creation
      if (!isUpdate) {
        if (!data.customer) errors.push('Customer information is required');
        if (!data.items || data.items.length === 0) errors.push('Invoice items are required');
      }

      // Check for duplicate invoice number
      if (data.invoiceNumber) {
        const numberFilter = { invoiceNumber: data.invoiceNumber };
        if (isUpdate && invoiceId) {
          numberFilter._id = { $ne: invoiceId };
        }
        const numberExists = await this.exists(numberFilter);
        if (numberExists) {
          errors.push('Invoice number already exists');
        }
      }

      // Validate customer data
      if (data.customer) {
        if (!data.customer.name) errors.push('Customer name is required');
        if (!data.customer.email) errors.push('Customer email is required');
      }

      // Validate items
      if (data.items && data.items.length > 0) {
        data.items.forEach((item, index) => {
          if (!item.description) errors.push(`Item ${index + 1}: Description is required`);
          if (!item.quantity || item.quantity <= 0) errors.push(`Item ${index + 1}: Valid quantity is required`);
          if (!item.price || item.price < 0) errors.push(`Item ${index + 1}: Valid price is required`);
        });
      }

      // Validate dates
      if (data.dueDate && data.issueDate && new Date(data.dueDate) < new Date(data.issueDate)) {
        errors.push('Due date cannot be before issue date');
      }

      return {
        isValid: errors.length === 0,
        errors
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = InvoiceService;