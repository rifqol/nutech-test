exports.getBalance = async (req, res) => {
  try {
    const balance = req.user.balance;

    return res.status(200).json({
      status: 0,
      message: 'Get Balance Berhasil',
      data: {
        balance: balance
      }
    });

  } catch (error){
    console.error('Error di getBalance:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};