const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoiceController');

// GET /api/invoices - Get all invoices
router.get('/', invoiceController.getAllInvoices);

// GET /api/invoices/stats - Get invoice statistics
router.get('/stats', invoiceController.getInvoiceStats);

// GET /api/invoices/filter - Get invoices with filters
router.get('/filter', invoiceController.getInvoicesWithFilters);

// GET /api/invoices/overdue - Get overdue invoices
router.get('/overdue', invoiceController.getOverdueInvoices);

// POST /api/invoices/generate-recurring - Generate recurring invoices
router.post('/generate-recurring', invoiceController.generateRecurringInvoices);

// GET /api/invoices/status/:status - Get invoices by status
router.get('/status/:status', invoiceController.getInvoicesByStatus);

// GET /api/invoices/customer/:email - Get invoices by customer
router.get('/customer/:email', invoiceController.getInvoicesByCustomer);

// GET /api/invoices/number/:invoiceNumber - Get invoice by number
router.get('/number/:invoiceNumber', invoiceController.getInvoiceByNumber);

// GET /api/invoices/:id - Get single invoice
router.get('/:id', invoiceController.getInvoiceById);

// POST /api/invoices - Create new invoice
router.post('/', invoiceController.createInvoice);

// PUT /api/invoices/:id - Update invoice
router.put('/:id', invoiceController.updateInvoice);

// DELETE /api/invoices/:id - Delete invoice
router.delete('/:id', invoiceController.deleteInvoice);

// POST /api/invoices/:id/send - Mark invoice as sent
router.post('/:id/send', invoiceController.markAsSent);

// POST /api/invoices/:id/payment - Record payment
router.post('/:id/payment', invoiceController.markAsPaid);

// POST /api/invoices/:id/duplicate - Duplicate invoice
router.post('/:id/duplicate', invoiceController.duplicateInvoice);

module.exports = router;