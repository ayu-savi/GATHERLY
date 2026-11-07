const express = require('express');
const router = express.Router();
const galleryController = require('../controllers/galleryController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public: Retrieve current active gallery
router.get('/', galleryController.getActiveGallery);

// Admin Only: Upload photograph file to server storage
router.post(
  '/upload',
  protect,
  authorizeRoles('admin'),
  (req, res, next) => {
    upload.single('photo')(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || 'File upload failed. Ensure image is under 10MB and in valid format.',
        });
      }
      next();
    });
  },
  galleryController.uploadPhotograph
);

// Admin Only: Delete an uncommitted staged photo before publication
router.delete('/staged/:filename', protect, authorizeRoles('admin'), galleryController.deleteStagedPhotograph);

// Admin Only: Atomically publish and replace active collection
router.post('/publish', protect, authorizeRoles('admin'), galleryController.publishGallery);

module.exports = router;
