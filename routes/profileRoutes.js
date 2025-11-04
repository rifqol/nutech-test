const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getProfile, updateProfile, updateProfileImage } = require('../controllers/profileController');
const upload = require('../middleware/uploadMiddleware');


router.get('/profile', getProfile);
router.put(
  '/profile/update',
  [
    body('first_name').notEmpty().withMessage('Parameter first_name tidak boleh kosong')
  ],
  updateProfile
);
router.put(
  '/profile/image',
  upload.single('profile_image'),
  updateProfileImage
);

module.exports = router;