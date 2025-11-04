// File: models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Meng-impor koneksi dari db.js

const User = sequelize.define('User', {
  // id akan dibuat otomatis
  
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  
  first_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  last_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  profile_image: {
    type: DataTypes.STRING,
    allowNull: true, 
  },

}, {
  tableName: 'users',
  // Kita definisikan timestamps di sini, persis seperti file Admin.js Anda
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;