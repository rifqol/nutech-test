const Service = require('../models/Service'); 

exports.getServices = async (req, res) => {
  try {
    const services = await Service.findAll({
      attributes: ['service_code', 'service_name', 'service_icon', 'service_tariff']
    });
    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: services
    });

  } catch (error) {
    console.error('Error di getServices:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};