const pool = require('../config/db');

exports.create = async (client, userId, invoice, type, description, amount) => {
  const query = `
    INSERT INTO transactions (user_id, invoice_number, transaction_type, description, total_amount, created_at, updated_at)
    VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
    RETURNING *;
  `;
  const values = [userId, invoice, type, description, amount];
  
  const { rows } = await client.query(query, values);
  return rows[0];
};

exports.getHistory = async (userId, limit, offset) => {
  let query = `
    SELECT
      invoice_number,
      transaction_type,
      description,
      total_amount,
      created_at AS created_on
    FROM transactions
    WHERE user_id = $1
    ORDER BY created_at DESC
  `;
  
  const values = [userId];
  
  if (limit) {
    query += ` LIMIT $2`;
    values.push(limit);
  }
  if (offset) {
    query += ` OFFSET $3`;
    values.push(offset);
  }
  
  const { rows } = await pool.query(query, values);
  return rows;
};