const { validationResult } = require('express-validator');
const sequelize = require('../config/db');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Service = require('../models/Service');


exports.topUp = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 102,
      message: errors.array()[0].msg,
      data: null
    });
  }

  const t = await sequelize.transaction();

  try {
    const { top_up_amount } = req.body;
    const amount = parseInt(top_up_amount, 10);
    const userId = req.user.id; 
    const user = await User.findByPk(userId, { 
      transaction: t, 
      lock: true 
    });

    const newBalance = user.balance + amount;
    await user.update({ balance: newBalance }, { transaction: t });

    await Transaction.create({
      user_id: userId,
      invoice_number: `TOPUP-${Date.now()}-${userId}`, 
      transaction_type: 'TOPUP', 
      description: 'Top Up balance',
      total_amount: amount,
    }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      status: 0,
      message: 'Top Up Balance berhasil',
      data: {
        balance: newBalance
      }
    });

  } catch (error) {
    await t.rollback();
    
    console.error('Error di topUp:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};

exports.createTransaction = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 102,
      message: errors.array()[0].msg,
      data: null
    });
  }

  const t = await sequelize.transaction();

  try {
    const { service_code } = req.body;
    const userId = req.user.id;

    const service = await Service.findOne({
      where: { service_code: service_code }
    });

    if (!service) {
      await t.rollback();
      return res.status(400).json({
        status: 102,
        message: 'Service ataus Layanan tidak ditemukan',
        data: null
      });
    }

    const user = await User.findByPk(userId, {
      transaction: t,
      lock: true 
    });

    const cost = service.service_tariff;
    if (user.balance < cost) {
      await t.rollback();
      return res.status(400).json({
        status: 102, 
        message: 'Saldo tidak mencukupi',
        data: null
      });
    }

    const newBalance = user.balance - cost;
    await user.update({ balance: newBalance }, { transaction: t });

    const newTransaction = await Transaction.create({
      user_id: userId,
      invoice_number: `INV-${Date.now()}-${userId}`, 
      transaction_type: 'PAYMENT', 
      description: service.service_name,
      total_amount: cost,
    }, { transaction: t });

    await t.commit();

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
    await t.rollback();
    
    console.error('Error di createTransaction:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};

exports.getTransactionHistory = async (req, res) => {
  try {
    const userId = req.user.id;

    const offset = parseInt(req.query.offset, 10) || 0;
    
    const limit = parseInt(req.query.limit, 10); 


    const findOptions = {
      where: { user_id: userId },
      order: [['created_at', 'DESC']], 
      attributes: [
        'invoice_number',
        'transaction_type',
        'description',
        'total_amount',
        ['created_at', 'created_on'] 
      ],
      offset: offset
    };

    if (!isNaN(limit) && limit > 0) {
      findOptions.limit = limit;
    }

    const transactions = await Transaction.findAll(findOptions);
    
    const responseLimit = findOptions.limit ? findOptions.limit : transactions.length;

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
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};