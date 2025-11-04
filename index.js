const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); 
const { MulterError } = require('multer');
const sequelize = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const serviceRoutes = require('./routes/serviceRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

sequelize.sync({ alter: true })
    .then(() => console.log('Database berhasil disinkronkan.'))
    .catch((err) => console.error('Error sinkronisasi database:', err));


app.use('/', authRoutes);
app.use('/', bannerRoutes);
app.use('/', authMiddleware, profileRoutes, serviceRoutes);

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));