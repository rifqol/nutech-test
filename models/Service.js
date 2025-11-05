const pool = require('../config/db');

exports.getAllServices = async () => {
  const query = 'SELECT service_code, service_name, service_icon, service_tariff FROM services';
  
  const { rows } = await pool.query(query);
  return rows;
};

exports.findByCode = async (serviceCode) => {
  const query = 'SELECT * FROM services WHERE service_code = $1';
  const { rows } = await pool.query(query, [serviceCode]);
  return rows[0];
};