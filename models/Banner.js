const pool = require('../config/db');

exports.getAllBanners = async () => {
  const query = 'SELECT banner_name, banner_image, description FROM banners';
  const { rows } = await pool.query(query);
  return rows;
};