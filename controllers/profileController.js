const { validationResult } = require('express-validator');
const User = require('../models/user');

const getFullImageUrl = (filePath) => {
  if (!filePath) {
    return null;
  }
  const normalizedPath = filePath.replace(/\\/g, '/');
  return `${process.env.APP_URL}/${normalizedPath}`;
};

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;

    // Kirim response 200 (Sukses)
    return res.status(200).json({
      status: 0,
      message: 'Sukses',
      data: {
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: getFullImageUrl(user.profile_image)
      }
    });

  } catch (error) {
    console.error('Error di getProfile:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};

exports.updateProfile = async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 102,
      message: errors.array()[0].msg,
      data: null
    });
  }

  try {
    const { first_name, last_name } = req.body;
    const userId = req.user.id; 

    await User.update(
      {
        first_name: first_name,
        last_name: last_name
      },
      {
        where: { id: userId }
      }
    );

    const updatedUser = await User.findByPk(userId);

    return res.status(200).json({
      status: 0,
      message: 'Update Pofile berhasil',
      data: {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_image: getFullImageUrl(user.profile_image)
      }
    });

  } catch (error) {
    console.error('Error di updateProfile:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};

exports.updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ status: 102, message: 'Image tidak ditemukan', data: null });
    }

    const imagePath = req.file.path.replace(/\\/g, '/');

    const userId = req.user.id;
    await User.update({ profile_image: imagePath }, { where: { id: userId } });

    const updatedUser = await User.findByPk(userId);

    return res.status(200).json({
      status: 0,
      message: 'Update Profile Image berhasil',
      data: {
        email: updatedUser.email,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
        profile_image: getFullImageUrl(updatedUser.profile_image)
      }
    });

  } catch (error) {
    console.error('Error di updateProfileImage:', error);
    return res.status(500).json({
      status: 500,
      message: 'Terjadi kesalahan pada server',
      data: null
    });
  }
};