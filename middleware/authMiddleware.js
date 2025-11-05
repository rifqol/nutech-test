const jwt = require('jsonwebtoken');
const userModel = require('../models/User');

module.exports = async (req, res, next) => {
  const authHeader = req.header('Authorization');

  if (!authHeader) {
    return res.status(401).json({ status: 108, message: '...', data: null });
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const user = await userModel.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
    }
    
    delete user.password; 
    
    req.user = user;
    next();

  } catch (ex) {
    return res.status(401).json({ status: 108, message: 'Token tidak tidak valid atau kadaluwarsa', data: null });
  }
};