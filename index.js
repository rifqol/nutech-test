// const express = require('express');
// const cors = require('cors');
// require('dotenv').config();
// const path = require('path');

// const authRoutes = require('./routes/authRoutes');
// const profileRoutes = require('./routes/profileRoutes');
// const bannerRoutes = require('./routes/bannerRoutes');
// const serviceRoutes = require('./routes/serviceRoutes');
// const balanceRoutes = require('./routes/balanceRoutes');
// const transactionRoutes = require('./routes/transactionRoutes');
// const authMiddleware = require('./middleware/authMiddleware');
// const globalErrorHandler = require('./middleware/errorHandler');

// const app = express();
// const PORT = process.env.PORT || 3000;

// app.use('/', authRoutes);
// app.use('/', bannerRoutes);
// app.use('/', authMiddleware, profileRoutes);
// app.use('/', authMiddleware, serviceRoutes);
// app.use('/', authMiddleware, balanceRoutes);
// app.use('/', authMiddleware, transactionRoutes);

// app.use(globalErrorHandler);

// app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path'); 
const { MulterError } = require('multer');

const authMiddleware = require('./middleware/authMiddleware');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const balanceRoutes = require('./routes/balanceRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const globalErrorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); 

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/', authRoutes);
app.use('/', bannerRoutes);
app.use('/', authMiddleware, profileRoutes, serviceRoutes);
app.use('/', authMiddleware, balanceRoutes);
app.use('/', authMiddleware, transactionRoutes);

app.use(globalErrorHandler);

app.listen(PORT, () => console.log(`Server berjalan di http://localhost:${PORT}`));