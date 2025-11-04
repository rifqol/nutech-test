const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Impor koneksi sequelize dari db.js
const sequelize = require('./config/db');

// Impor rute
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json()); 

sequelize.sync({ alter: true })
    .then(() => console.log('Database berhasil disinkronkan.'))
    .catch((err) => console.error('Error sinkronisasi database:', err));


app.use('/', authRoutes);

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));