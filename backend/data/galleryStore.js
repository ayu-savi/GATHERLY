const fs = require('fs');
const path = require('path');

// Curated Initial Demo Collection
const INITIAL_DEMO_COLLECTION = {
  _id: 'gallery_demo_collection_default',
  title: 'Campus Memories — Sample Showcase',
  description:
    'A curated showcase of university events, festivals, concerts, and student society milestones. (Sample gallery for demonstration).',
  isDemo: true,
  isActive: true,
  publishedAt: new Date('2026-03-15T18:00:00.000Z'),
  photographs: [
    {
      _id: 'photo_demo_1',
      photoPath: '/uploads/gallery/defaults/concert_stage.jpg',
      filename: 'concert_stage.jpg',
      eventName: 'Acoustic Harmony Music Fest',
      eventDate: 'October 24, 2025',
      photographerCredit: 'Aditya Chache',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: true,
      caption: 'Live performance under campus stage spotlights during the annual acoustic showcase.',
    },
    {
      _id: 'photo_demo_2',
      photoPath: '/uploads/gallery/defaults/cultural_festival.jpg',
      filename: 'cultural_festival.jpg',
      eventName: 'Vasant Utsav Cultural Gala',
      eventDate: 'November 12, 2025',
      photographerCredit: 'Nainoa Shizuru',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Vibrant colors and traditional rhythm celebrations across the university open plaza.',
    },
    {
      _id: 'photo_demo_3',
      photoPath: '/uploads/gallery/defaults/tech_hackathon.jpg',
      filename: 'tech_hackathon.jpg',
      eventName: 'Campus Tech Innovation Hackathon',
      eventDate: 'December 05, 2025',
      photographerCredit: 'Desola Lanre-Ologun',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Engineering students collaborating on prototype builds in the central computer labs.',
    },
    {
      _id: 'photo_demo_4',
      photoPath: '/uploads/gallery/defaults/student_gathering.jpg',
      filename: 'student_gathering.jpg',
      eventName: 'Freshers Club Orientation Evening',
      eventDate: 'September 18, 2025',
      photographerCredit: 'Priscilla Du Preez',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'New undergraduates connecting with senior society leads on the campus lawn.',
    },
    {
      _id: 'photo_demo_5',
      photoPath: '/uploads/gallery/defaults/theater_performance.jpg',
      filename: 'theater_performance.jpg',
      eventName: 'Inter-College Theater & Drama Showcase',
      eventDate: 'January 14, 2026',
      photographerCredit: 'Rob Laughter',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Dramatic sequence during the university drama society annual stage production.',
    },
    {
      _id: 'photo_demo_6',
      photoPath: '/uploads/gallery/defaults/robotics_expo.jpg',
      filename: 'robotics_expo.jpg',
      eventName: 'Autonomous Robotics & AI Expo',
      eventDate: 'January 28, 2026',
      photographerCredit: 'Alex Knight',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Autonomous rover demonstration at the university engineering exhibition floor.',
    },
    {
      _id: 'photo_demo_7',
      photoPath: '/uploads/gallery/defaults/sports_athletics.jpg',
      filename: 'sports_athletics.jpg',
      eventName: 'Inter-Department Athletics Meet',
      eventDate: 'February 08, 2026',
      photographerCredit: 'Braden Collum',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Sprint qualifiers on the university synthetic track under the evening lights.',
    },
    {
      _id: 'photo_demo_8',
      photoPath: '/uploads/gallery/defaults/arts_exhibition.jpg',
      filename: 'arts_exhibition.jpg',
      eventName: 'Canvas & Shutter Creative Showcase',
      eventDate: 'February 20, 2026',
      photographerCredit: 'Khara Woods',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Student canvas paintings and visual art installations displayed in the gallery hall.',
    },
    {
      _id: 'photo_demo_9',
      photoPath: '/uploads/gallery/defaults/academic_debate.jpg',
      filename: 'academic_debate.jpg',
      eventName: 'Parliamentary Debate Championship',
      eventDate: 'March 03, 2026',
      photographerCredit: 'Miguel Henriques',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Keynote rebuttal during the finals of the annual inter-university debate cup.',
    },
    {
      _id: 'photo_demo_10',
      photoPath: '/uploads/gallery/defaults/evening_celebration.jpg',
      filename: 'evening_celebration.jpg',
      eventName: 'Campus Spring Lantern & Lights Night',
      eventDate: 'March 15, 2026',
      photographerCredit: 'Product School',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Campus amphitheater illuminated during the spring semester closing ceremonies.',
    },
  ],
};

class GalleryStore {
  constructor() {
    this.activeCollection = JSON.parse(JSON.stringify(INITIAL_DEMO_COLLECTION));
    this.history = []; // Retained collection records in memory
  }

  /**
   * Get currently active public gallery collection
   */
  getActiveCollection() {
    return this.activeCollection;
  }

  /**
   * Atomically replace the active gallery collection
   * @param {Object} newCollectionData
   * @returns {Object} Newly published active collection
   */
  async replaceActiveCollection(newCollectionData) {
    if (!newCollectionData || !Array.isArray(newCollectionData.photographs) || newCollectionData.photographs.length === 0) {
      throw new Error('Invalid collection data: At least one photograph is required.');
    }

    // Ensure all photographs have mandatory metadata
    for (let i = 0; i < newCollectionData.photographs.length; i++) {
      const p = newCollectionData.photographs[i];
      if (!p.photoPath) {
        throw new Error(`Photograph at index ${i} is missing photoPath.`);
      }
      if (!p.eventName || p.eventName.trim() === '') {
        throw new Error(`Photograph at index ${i} is missing eventName.`);
      }
      if (!p.eventDate || p.eventDate.trim() === '') {
        throw new Error(`Photograph at index ${i} is missing eventDate.`);
      }
    }

    const previousCollection = this.activeCollection;
    const newCollectionId = `gallery_col_${Date.now()}`;

    // Ensure at least one photograph is marked featured if none is
    const hasFeatured = newCollectionData.photographs.some((p) => p.isFeatured);
    const finalizedPhotos = newCollectionData.photographs.map((p, idx) => ({
      _id: p._id || `photo_${Date.now()}_${idx}`,
      photoPath: p.photoPath,
      filename: p.filename || path.basename(p.photoPath),
      eventName: p.eventName.trim(),
      eventDate: p.eventDate.trim(),
      photographerCredit: p.photographerCredit?.trim() || 'Campus Contributor',
      photographerSource: p.photographerSource?.trim() || '',
      isSocietyAttribution: Boolean(p.isSocietyAttribution),
      isFeatured: hasFeatured ? Boolean(p.isFeatured) : idx === 0,
      caption: p.caption?.trim() || '',
    }));

    const publishedCollection = {
      _id: newCollectionId,
      title: newCollectionData.title?.trim() || 'Campus Event Highlights',
      description: newCollectionData.description?.trim() || '',
      isDemo: Boolean(newCollectionData.isDemo),
      isActive: true,
      publishedAt: new Date(),
      publishedBy: newCollectionData.publishedBy || null,
      photographs: finalizedPhotos,
    };

    // Swap active reference in memory
    this.activeCollection = publishedCollection;
    if (previousCollection) {
      this.history.push({ ...previousCollection, isActive: false });

      // Clean up previous files if they were custom uploaded (never delete defaults)
      await this.cleanupObsoleteFiles(previousCollection.photographs);
    }

    return publishedCollection;
  }

  /**
   * Safely delete obsolete uploaded files from disk
   * @param {Array} photographs
   */
  async cleanupObsoleteFiles(photographs) {
    if (!Array.isArray(photographs)) return;

    for (const photo of photographs) {
      if (!photo.photoPath) continue;

      // Do NOT touch permanent demo defaults
      if (photo.photoPath.includes('/defaults/')) continue;

      try {
        const relativePath = photo.photoPath.replace(/^\/uploads\//, '');
        const fullPath = path.join(__dirname, '..', 'uploads', relativePath);

        if (fs.existsSync(fullPath)) {
          await fs.promises.unlink(fullPath);
          console.log(`[Gallery Cleanup] Removed obsolete photo file: ${photo.filename || fullPath}`);
        }
      } catch (err) {
        console.warn(`[Gallery Cleanup] Warning: Could not delete old file ${photo.photoPath}:`, err.message);
      }
    }
  }

  /**
   * Reset to initial demo showcase
   */
  resetToDemo() {
    this.activeCollection = JSON.parse(JSON.stringify(INITIAL_DEMO_COLLECTION));
  }
}

const galleryStore = new GalleryStore();

module.exports = {
  galleryStore,
  INITIAL_DEMO_COLLECTION,
};
