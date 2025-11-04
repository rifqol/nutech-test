const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Service = sequelize.define('Service', {
  
  service_code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  
  service_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  service_icon: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isUrl: true,
    },
  },

  service_tariff: {
    type: DataTypes.INTEGER, 
    allowNull: false,
  },

}, {
  tableName: 'services',
  timestamps: false, 
});

module.exports = Service;