// File: middleware/authMiddleware.js

const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Kita gunakan model User

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ 
      status: 'error',
      message: 'Akses ditolak. Token tidak disediakan.' 
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Cari User berdasarkan ID dari token
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } // Jangan ikutkan password
    });

    if (!user) {
      return res.status(401).json({ 
        status: 'error',
        message: 'Token tidak valid. User tidak ditemukan.' 
      });
    }

    // Lampirkan data user ke object request
    req.user = user; 
    next(); // Lanjutkan ke controller/route berikutnya

  } catch (ex) {
    res.status(400).json({ 
      status: 'error',
      message: 'Token tidak valid.' 
    });
  }
};