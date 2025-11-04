const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  // --- UBAH DISINI (Token tidak ada) ---
  if (!authHeader) {
    return res.status(401).json({ 
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa' ,
      data: null
    });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['password'] } 
    });
    if (!user) {
      return res.status(401).json({ 
        status: 108,
        message: 'Token tidak tidak valid atau kadaluwarsa',
        data: null
      });
    }

    req.user = user; 
    next(); 

  } catch (ex) {
    return res.status(401).json({ 
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null
    });
  }
};