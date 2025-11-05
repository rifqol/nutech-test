const pool = require('../config/db');

exports.findByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

exports.findByPk = async (id) => {
  const query = 'SELECT * FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

exports.createUser = async (email, first_name, last_name, password_hash) => {
  const query = `
    INSERT INTO users (email, first_name, last_name, password, balance, created_at, updated_at)
    VALUES ($1, $2, $3, $4, 0, NOW(), NOW())
    RETURNING id, email, first_name, last_name, balance, profile_image
  `;
  const values = [email, first_name, last_name, password_hash];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

exports.updateProfile = async (id, first_name, last_name) => {
  const query = `
    UPDATE users
    SET first_name = $1, last_name = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *; 
  `;
  const { rows } = await pool.query(query, [first_name, last_name, id]);
  return rows[0];
};

exports.updateProfileImage = async (id, imagePath) => {
  const query = `
    UPDATE users
    SET profile_image = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await pool.query(query, [imagePath, id]);
  return rows[0];
};

exports.getBalance = async (id) => {
  const query = 'SELECT balance FROM users WHERE id = $1';
  const { rows } = await pool.query(query, [id]);
  return rows[0].balance;
};

exports.findByIdForUpdate = async (client, id) => {
  const query = 'SELECT * FROM users WHERE id = $1 FOR UPDATE';
  const { rows } = await client.query(query, [id]);
  return rows[0];
};

exports.updateBalance = async (client, id, newBalance) => {
  const query = `
    UPDATE users SET balance = $1, updated_at = NOW()
    WHERE id = $2
  `;
  await client.query(query, [newBalance, id]);
};