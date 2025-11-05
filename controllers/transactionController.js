const { validationResult } = require('express-validator');
const pool = require('../config/db'); 
const userModel = require('../models/User');
const transactionModel = require('../models/Transaction');
const serviceModel = require('../models/Service');

exports.topUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 102, message: errors.array()[0].msg, data: null });
  }

  const client = await pool.connect();

  try {
    const { top_up_amount } = req.body;
    const amount = parseInt(top_up_amount, 10);
    const userId = req.user.id;

    await client.query('BEGIN');

    const user = await userModel.findByIdForUpdate(client, userId);

    const newBalance = user.balance + amount;
    await userModel.updateBalance(client, userId, newBalance);

    const invoice = `TOPUP-${Date.now()}-${userId}`;
    await transactionModel.create(client, userId, invoice, 'TOPUP', 'Top Up balance', amount);

    await client.query('COMMIT');

    return res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: newBalance
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error di topUp:', error);
    return res.status(500).json({ status: 500, message: '...', data: null });
  } finally {
    client.release();
  }
};

exports.createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 102, message: errors.array()[0].msg, data: null });
  }

  const client = await pool.connect();

  try {
    const { service_code } = req.body;
    const userId = req.user.id;

    const service = await serviceModel.findByCode(service_code);
    if (!service) {
      client.release();
      return res.status(400).json({ status: 102, message: 'Service ataus Layanan tidak ditemukan', data: null });
    }

    await client.query('BEGIN');

    const user = await userModel.findByIdForUpdate(client, userId);
    const cost = service.service_tariff;
    if (user.balance < cost) {
      await client.query('ROLLBACK');
      return res.status(400).json({ status: 102, message: 'Saldo tidak mencukupi', data: null });
    }

    const newBalance = user.balance - cost;
    await userModel.updateBalance(client, userId, newBalance);

    const invoice = `INV-${Date.now()}-${userId}`;
    const newTransaction = await transactionModel.create(client, userId, invoice, 'PAYMENT', service.service_name, cost);

    await client.query('COMMIT');

    return res.status(200).json({
      status: 0,
      message: 'Transaksi berhasil',
      data: {
        invoice_number: newTransaction.invoice_number,
        service_code: service.service_code,
        service_name: service.service_name,
        transaction_type: newTransaction.transaction_type,
        total_amount: newTransaction.total_amount,
        created_on: newTransaction.created_at
      }
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error di createTransaction:', error);
    return res.status(500).json({ status: 500, message: '...', data: null });
  } finally {
    client.release();
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || null; 

    const transactions = await transactionModel.getHistory(userId, limit, offset);
    
    const responseLimit = limit ? limit : transactions.length;

    return res.status(200).json({
      status: 0,
      message: 'Get History Berhasil',
      data: {
        offset: offset,
        limit: responseLimit,
        records: transactions
      }
    });

  } catch (error) {
    console.error('Error di getTransactionHistory:', error);
    return res.status(500).json({ status: 500, message: '...', data: null });
  }
};