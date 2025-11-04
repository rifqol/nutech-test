const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Banner = sequelize.define('Banner', {
  // 'id' akan dibuat otomatis
  
  banner_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  
  banner_image: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },

  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },

}, {
  tableName: 'banners',
  timestamps: false,
});

module.exports = Banner;