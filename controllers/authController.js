const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 102, message: errors.array()[0].msg, data: null });
  }

  try {
    const { email, first_name, last_name, password } = req.body;

    const existingUser = await userModel.findByEmail(email);

    if (existingUser) {
      return res.status(400).json({ status: 102, message: 'Email sudah terdaftar', data: null });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const newUser = await userModel.createUser(email, first_name, last_name, password_hash);

    return res.status(200).json({
      status: 0,
      message: 'Registrasi berhasil silahkan login',
      data: null
    });

  } catch (error) {
    console.error('Error saat registrasi:', error);
    return res.status(500).json({ status: 500, message: '...', data: null });
  }
};

exports.loginUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ status: 102, message: errors.array()[0].msg, data: null });
  }

  try {
    const { email, password } = req.body;

    const user = await userModel.findByEmail(email);

    if (!user) {
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ status: 103, message: 'Username atau password salah', data: null });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '12h' });

    return res.status(200).json({
      status: 0,
      message: 'Login Sukses',
      data: { token: token }
    });

  } catch (error) {
    console.error('Error saat login:', error);
    return res.status(500).json({ status: 500, message: '...', data: null });
  }
};