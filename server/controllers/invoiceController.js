const BaseController = require('./BaseController');
const InvoiceService = require('../services/InvoiceService');

const invoiceService = new InvoiceService();
const baseController = new BaseController(invoiceService);

// Get all invoices with filtering, searching, sorting, and pagination
exports.getAllInvoices = baseController.getAll.bind(baseController);

// Get single invoice by ID
exports.getInvoiceById = baseController.getById.bind(baseController);

// Create new invoice
exports.createInvoice = baseController.create.bind(baseController);

// Update invoice
exports.updateInvoice = baseController.update.bind(baseController);

// Delete invoice
exports.deleteInvoice = baseController.delete.bind(baseController);

// Get invoice statistics
exports.getInvoiceStats = baseController.getStats.bind(baseController);

// Custom invoice-specific endpoints
exports.getInvoiceByNumber = async (req, res) => {
  try {
    const invoice = await invoiceService.getByInvoiceNumber(req.params.invoiceNumber);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: 'Invoice not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Invoice retrieved successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error getting invoice by number:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving invoice',
      error: error.message
    });
  }
};

exports.markAsSent = async (req, res) => {
  try {
    const invoice = await invoiceService.markAsSent(req.params.id, req.user?.id);

    res.status(200).json({
      success: true,
      message: 'Invoice marked as sent successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error marking invoice as sent:', error);
    res.status(500).json({
      success: false,
      message: 'Error marking invoice as sent',
      error: error.message
    });
  }
};

exports.markAsPaid = async (req, res) => {
  try {
    const invoice = await invoiceService.markAsPaid(req.params.id, req.body, req.user?.id);

    res.status(200).json({
      success: true,
      message: 'Payment recorded successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording payment',
      error: error.message
    });
  }
};

exports.getInvoicesByStatus = async (req, res) => {
  try {
    const result = await invoiceService.getByStatus(req.params.status, req.query);

    res.status(200).json({
      success: true,
      message: `Invoices with status '${req.params.status}' retrieved successfully`,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting invoices by status:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving invoices by status',
      error: error.message
    });
  }
};

exports.getOverdueInvoices = async (req, res) => {
  try {
    const result = await invoiceService.getOverdueInvoices(req.query);

    res.status(200).json({
      success: true,
      message: 'Overdue invoices retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting overdue invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving overdue invoices',
      error: error.message
    });
  }
};

exports.getInvoicesByCustomer = async (req, res) => {
  try {
    const result = await invoiceService.getByCustomer(req.params.email, req.query);

    res.status(200).json({
      success: true,
      message: 'Customer invoices retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting customer invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving customer invoices',
      error: error.message
    });
  }
};

exports.getInvoicesWithFilters = async (req, res) => {
  try {
    const result = await invoiceService.getWithFilters(req.query);

    res.status(200).json({
      success: true,
      message: 'Filtered invoices retrieved successfully',
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error('Error getting filtered invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving filtered invoices',
      error: error.message
    });
  }
};

exports.duplicateInvoice = async (req, res) => {
  try {
    const invoice = await invoiceService.duplicateInvoice(req.params.id);

    res.status(201).json({
      success: true,
      message: 'Invoice duplicated successfully',
      data: invoice
    });
  } catch (error) {
    console.error('Error duplicating invoice:', error);
    res.status(500).json({
      success: false,
      message: 'Error duplicating invoice',
      error: error.message
    });
  }
};

exports.generateRecurringInvoices = async (req, res) => {
  try {
    const invoices = await invoiceService.generateRecurringInvoices();

    res.status(200).json({
      success: true,
      message: `${invoices.length} recurring invoices generated successfully`,
      data: invoices
    });
  } catch (error) {
    console.error('Error generating recurring invoices:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating recurring invoices',
      error: error.message
    });
  }
};