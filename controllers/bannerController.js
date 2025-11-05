const Banner = require('../models/Banner'); 

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.getAllBanners();

    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: banners
    });

  } catch (error) {
    console.error('Error di getBanners:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};