const db = require('../db');

const getAllInvoices = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, status } = req.query;
    const offset = (page - 1) * limit;

    let query = db('invoices')
      .select('invoices.*', 'cases.title as case_title', 'users.name as client_name')
      .leftJoin('cases', 'invoices.case_id', 'cases.id')
      .leftJoin('users', 'invoices.client_id', 'users.id')
      .where('invoices.lawyer_id', lawyerId);

    if (status) query = query.where('invoices.status', status);

    const invoices = await query.orderBy('invoices.created_at', 'desc').limit(limit).offset(offset);
    const total = await db('invoices').where({ lawyer_id: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: invoices,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createInvoice = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { client_id, case_id, amount, tax, items, notes, due_date } = req.body;

    // Validate client_id exists if provided
    if (client_id) {
      const clientExists = await db('users').where({ id: client_id }).first();
      if (!clientExists) {
        return res.status(400).json({ success: false, error: 'Selected client not found' });
      }
    }

    // Validate case_id exists if provided
    if (case_id) {
      const caseExists = await db('cases').where({ id: case_id, lawyer_id: lawyerId }).first();
      if (!caseExists) {
        return res.status(400).json({ success: false, error: 'Selected case not found or access denied' });
      }
    }

    // Generate unique invoice number
    const invoiceNumber = 'INV-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    const totalAmount = parseFloat(amount) + parseFloat(tax || 0);

    const [invoiceId] = await db('invoices').insert({
      invoice_number: invoiceNumber,
      client_id,
      case_id,
      lawyer_id: lawyerId,
      amount,
      tax: tax || 0,
      total_amount: totalAmount,
      issue_date: new Date(),
      due_date,
      items: JSON.stringify(items || []),
      notes
    });

    const newInvoice = await db('invoices').where({ id: invoiceId }).first();
    res.status(201).json({ success: true, data: newInvoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    if (updateData.items) {
      updateData.items = JSON.stringify(updateData.items);
    }

    if (updateData.amount || updateData.tax) {
      const invoice = await db('invoices').where({ id, lawyer_id: lawyerId }).first();
      if (!invoice) {
        return res.status(404).json({ success: false, error: 'Invoice not found' });
      }
      
      const amount = updateData.amount || invoice.amount;
      const tax = updateData.tax || invoice.tax;
      updateData.total_amount = parseFloat(amount) + parseFloat(tax);
    }

    const updated = await db('invoices')
      .where({ id, lawyer_id: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    const updatedInvoice = await db('invoices').where({ id }).first();
    res.json({ success: true, data: updatedInvoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('invoices').where({ id, lawyer_id: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    res.json({ success: true, data: { message: 'Invoice deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const sendInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const updated = await db('invoices')
      .where({ id, lawyer_id: lawyerId })
      .update({ status: 'sent', updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    const invoice = await db('invoices').where({ id }).first();
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const markPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const updated = await db('invoices')
      .where({ id, lawyer_id: lawyerId })
      .update({ status: 'paid', paid_date: new Date(), updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    const invoice = await db('invoices').where({ id }).first();
    res.json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const generatePDF = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const invoice = await db('invoices')
      .select('invoices.*', 'cases.title as case_title', 'users.name as client_name', 'users.email as client_email')
      .leftJoin('cases', 'invoices.case_id', 'cases.id')
      .leftJoin('users', 'invoices.client_id', 'users.id')
      .where({ 'invoices.id': id, 'invoices.lawyer_id': lawyerId })
      .first();

    if (!invoice) {
      return res.status(404).json({ success: false, error: 'Invoice not found' });
    }

    // For now, return invoice data (PDF generation would require additional libraries)
    res.json({ success: true, data: invoice, message: 'PDF generation not implemented yet' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getInvoiceStats = async (req, res) => {
  try {
    const lawyerId = req.user.id;

    const stats = await db('invoices')
      .select('status')
      .count('id as count')
      .sum('total_amount as total')
      .where({ lawyer_id: lawyerId })
      .groupBy('status');

    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllInvoices, createInvoice, updateInvoice, deleteInvoice, sendInvoice, markPaid, generatePDF, getInvoiceStats };