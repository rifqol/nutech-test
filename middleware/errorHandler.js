const { MulterError } = require('multer');

const globalErrorHandler = (err, req, res, next) => {
  
  // Cek jika error dari Multer
  if (err instanceof MulterError) {
    let message = err.message;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'File terlalu besar (Max 2MB)';
    }
    return res.status(400).json({ status: 102, message: message, data: null });
  }

  if (err.message === 'Format Image tidak sesuai') {
    return res.status(400).json({ status: 102, message: err.message, data: null });
  }

  console.error(err.stack); 
  return res.status(500).json({ 
    status: 500, 
    message: 'Terjadi kesalahan pada server', 
    data: null 
  });
};

module.exports = globalErrorHandler;