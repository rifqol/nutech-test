const express = require('express');
const { body } = require('express-validator');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post(
  '/registration',
  [
    body('email')
      .isEmail()
      .withMessage('Paramter email tidak sesuai format'),
    body('first_name')
      .notEmpty()
      .withMessage('Parameter first_name tidak boleh kosong'),
      
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password minimal 8 karakter'),
  ],
  registerUser
);

router.post(
  '/login',
  [
    body('email')
      .isEmail()
      .withMessage('Paramter email tidak sesuai format'),
      
    body('password')
      .isLength({ min: 8 })
      .withMessage('Parameter password minimal 8 karakter'), 
  ],
  loginUser 
);

module.exports = router;