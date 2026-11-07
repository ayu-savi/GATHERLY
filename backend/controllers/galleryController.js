const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Gallery = require('../models/Gallery');
const { galleryStore, INITIAL_DEMO_COLLECTION } = require('../data/galleryStore');
const { getDBStatus } = require('../config/db');

/**
 * Public: Get the currently active public gallery collection
 * GET /api/gallery
 */
const getActiveGallery = async (req, res, next) => {
  try {
    const dbStatus = getDBStatus();

    if (dbStatus.connected) {
      let activeDoc = await Gallery.findOne({ isActive: true }).lean();

      // Seed initial demo collection into MongoDB if database is empty
      if (!activeDoc) {
        const seeded = await Gallery.create({
          title: INITIAL_DEMO_COLLECTION.title,
          description: INITIAL_DEMO_COLLECTION.description,
          isDemo: INITIAL_DEMO_COLLECTION.isDemo,
          publishedAt: INITIAL_DEMO_COLLECTION.publishedAt || new Date(),
          photographs: (INITIAL_DEMO_COLLECTION.photographs || []).map((p) => {
            const photoCopy = { ...p };
            delete photoCopy._id;
            return photoCopy;
          }),
          _id: undefined,
          isActive: true,
        });
        activeDoc = seeded.toObject();
      }

      return res.status(200).json({
        success: true,
        data: activeDoc,
      });
    }

    // In-memory fallback
    const activeData = galleryStore.getActiveCollection();
    return res.status(200).json({
      success: true,
      data: activeData,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Only: Upload a single or multiple photographs to server storage
 * POST /api/gallery/upload
 */
const uploadPhotograph = (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No photograph file was provided for upload.',
      });
    }

    const filename = req.file.filename;
    const photoPath = `/uploads/gallery/${filename}`;

    return res.status(201).json({
      success: true,
      message: 'Photograph uploaded successfully to server storage.',
      data: {
        filename,
        photoPath,
        size: req.file.size,
        mimetype: req.file.mimetype,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Only: Remove an uncommitted/staged uploaded photograph before publishing
 * DELETE /api/gallery/staged/:filename
 */
const deleteStagedPhotograph = async (req, res, next) => {
  try {
    const rawFilename = req.params.filename;
    if (!rawFilename) {
      return res.status(400).json({
        success: false,
        message: 'Filename parameter is required.',
      });
    }

    // Prevent directory traversal
    const safeFilename = path.basename(rawFilename);

    // Safeguard: Never delete default demo assets
    if (safeFilename.includes('defaults') || safeFilename.includes('concert_stage')) {
      return res.status(403).json({
        success: false,
        message: 'Default showcase assets cannot be deleted.',
      });
    }

    const filePath = path.join(__dirname, '..', 'uploads', 'gallery', safeFilename);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
    }

    return res.status(200).json({
      success: true,
      message: `Staged photograph ${safeFilename} removed successfully.`,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Admin Only: Atomically publish a new collection and replace the active public gallery
 * POST /api/gallery/publish
 */
const publishGallery = async (req, res, next) => {
  try {
    const { title, description, photographs, isDemo } = req.body;

    if (!photographs || !Array.isArray(photographs) || photographs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed: A published collection must contain at least one photograph.',
      });
    }

    // Comprehensive validation of all photographs before proceeding
    for (let i = 0; i < photographs.length; i++) {
      const p = photographs[i];
      if (!p.photoPath || typeof p.photoPath !== 'string') {
        return res.status(400).json({
          success: false,
          message: `Photograph #${i + 1} is missing a valid image path.`,
        });
      }
      if (!p.eventName || p.eventName.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: `Photograph #${i + 1} requires an Event Name.`,
        });
      }
      if (!p.eventDate || p.eventDate.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: `Photograph #${i + 1} requires an Event Date.`,
        });
      }

      // Verify that local file actually exists on disk before publishing
      if (p.photoPath.startsWith('/uploads/')) {
        const diskRelative = p.photoPath.replace(/^\/uploads\//, '');
        const diskFull = path.join(__dirname, '..', 'uploads', diskRelative);
        if (!fs.existsSync(diskFull)) {
          return res.status(400).json({
            success: false,
            message: `Verification error: Image file for "${p.eventName}" is missing on server disk. Publication aborted.`,
          });
        }
      }
    }

    const dbStatus = getDBStatus();
    let publishedRecord = null;

    if (dbStatus.connected) {
      // 1. Retrieve previous active collection for safe file cleanup
      const previousDoc = await Gallery.findOne({ isActive: true });

      // 2. Insert new collection as active
      const newCollection = await Gallery.create({
        title: title?.trim() || 'Campus Event Highlights',
        description: description?.trim() || '',
        isDemo: Boolean(isDemo),
        isActive: true,
        publishedAt: new Date(),
        publishedBy: req.user._id,
        photographs: photographs.map((p) => {
          const item = { ...p };
          if (item._id && typeof item._id === 'string' && !mongoose.Types.ObjectId.isValid(item._id)) {
            delete item._id;
          }
          return item;
        }),
      });

      // 3. Mark previous collections as inactive
      if (previousDoc) {
        await Gallery.updateMany(
          { _id: { $ne: newCollection._id } },
          { isActive: false }
        );

        // 4. Safely unlink previous non-demo uploaded files
        await galleryStore.cleanupObsoleteFiles(previousDoc.photographs);
      }

      // Sync memory store
      galleryStore.activeCollection = newCollection.toObject();
      publishedRecord = newCollection;
    } else {
      // In-memory atomic replacement
      publishedRecord = await galleryStore.replaceActiveCollection({
        title,
        description,
        isDemo,
        photographs: photographs.map((p) => {
          const item = { ...p };
          if (item._id && typeof item._id === 'string' && !mongoose.Types.ObjectId.isValid(item._id)) {
            delete item._id;
          }
          return item;
        }),
        publishedBy: req.user?._id || req.user?.id,
      });
    }

    return res.status(200).json({
      success: true,
      message: 'New campus memories gallery published and activated successfully.',
      data: publishedRecord,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getActiveGallery,
  uploadPhotograph,
  deleteStagedPhotograph,
  publishGallery,
};
