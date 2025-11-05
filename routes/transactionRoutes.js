const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { topUp, createTransaction, getTransactionHistory } = require('../controllers/transactionController');

router.post(
  '/topup',
  [
    body('top_up_amount')
      .isInt({ min: 1 })
      .withMessage('Paramter amount hanya boleh angka dan tidak boleh lebih kecil dari 0')
  ],
  topUp
);

router.post(
  '/transaction',
  [
    body('service_code')
      .notEmpty()
      .withMessage('Parameter service_code tidak boleh kosong')
  ],
  createTransaction
);

router.get(
  '/transaction/history', 
  getTransactionHistory
);

module.exports = router;