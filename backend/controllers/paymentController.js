const db = require('../db');

const getAllPayments = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { page = 1, limit = 10, payment_method, client_id } = req.query;
    const offset = (page - 1) * limit;

    let query = db('payments')
      .select('payments.*', 'invoices.invoice_number', 'users.name as client_name')
      .leftJoin('invoices', 'payments.invoice_id', 'invoices.id')
      .leftJoin('users', 'payments.client_id', 'users.id')
      .where('payments.recorded_by', lawyerId);

    if (payment_method) query = query.where('payments.payment_method', payment_method);
    if (client_id) query = query.where('payments.client_id', client_id);

    const payments = await query.orderBy('payments.payment_date', 'desc').limit(limit).offset(offset);
    const total = await db('payments').where({ recorded_by: lawyerId }).count('id as count').first();

    res.json({
      success: true,
      data: payments,
      pagination: { page: parseInt(page), limit: parseInt(limit), total: total.count }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const createPayment = async (req, res) => {
  try {
    const lawyerId = req.user.id;
    const { invoice_id, client_id, amount, payment_method, payment_date, reference_number, notes } = req.body;

    // Validate invoice_id exists if provided
    if (invoice_id) {
      const invoiceExists = await db('invoices').where({ id: invoice_id, lawyer_id: lawyerId }).first();
      if (!invoiceExists) {
        return res.status(400).json({ success: false, error: 'Selected invoice not found or access denied' });
      }
    }

    // Validate client_id exists if provided
    if (client_id) {
      const clientExists = await db('users').where({ id: client_id }).first();
      if (!clientExists) {
        return res.status(400).json({ success: false, error: 'Selected client not found' });
      }
    }

    // Generate unique payment number
    const paymentNumber = 'PAY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();

    const [paymentId] = await db('payments').insert({
      payment_number: paymentNumber,
      invoice_id,
      client_id,
      amount,
      payment_method,
      payment_date,
      reference_number,
      notes,
      recorded_by: lawyerId
    });

    const newPayment = await db('payments').where({ id: paymentId }).first();
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;
    const updateData = req.body;

    const updated = await db('payments')
      .where({ id, recorded_by: lawyerId })
      .update({ ...updateData, updated_at: new Date() });

    if (!updated) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    const updatedPayment = await db('payments').where({ id }).first();
    res.json({ success: true, data: updatedPayment });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const deletePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const lawyerId = req.user.id;

    const deleted = await db('payments').where({ id, recorded_by: lawyerId }).del();

    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Payment not found' });
    }

    res.json({ success: true, data: { message: 'Payment deleted successfully' } });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = { getAllPayments, createPayment, updatePayment, deletePayment };