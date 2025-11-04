// File: config/db.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_DATABASE, 
  process.env.DB_USER,     
  process.env.DB_PASSWORD, 
  {
    host: process.env.DB_HOST,   
    port: process.env.DB_PORT,  
    dialect: 'postgres',   
    logging: false,
    
    dialectOptions: {
      ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
    }
  }
);

// Tes koneksi
sequelize.authenticate()
  .then(() => console.log('Koneksi database (PostgreSQL) berhasil.'))
  .catch(err => console.error('Koneksi database gagal:', err));

module.exports = sequelize;