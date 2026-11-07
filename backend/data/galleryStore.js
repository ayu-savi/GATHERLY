const fs = require('fs');
const path = require('path');

// Curated Initial Demo Collection — Indian University Campus Showcase
const INITIAL_DEMO_COLLECTION = {
  _id: 'gallery_demo_collection_default',
  title: 'Campus Memories — Indian University Showcase',
  description:
    'A curated showcase celebrating Indian university cultural fests, classical and fusion dance, rock concerts, tech hackathons, ethnic fashion, and sports carnivals. (Sample gallery for demonstration).',
  isDemo: true,
  isActive: true,
  publishedAt: new Date('2026-03-15T18:00:00.000Z'),
  photographs: [
    {
      _id: 'photo_demo_1',
      photoPath: '/uploads/gallery/defaults/rangmanch_cultural_fest.jpg',
      filename: 'rangmanch_cultural_fest.jpg',
      eventName: 'Rangmanch — Annual College Cultural Gala',
      eventDate: 'November 14, 2025',
      photographerCredit: 'Nainoa Shizuru',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: true,
      caption: 'Vibrant festive stage illuminations and student crowd celebration during the inter-university cultural gala.',
    },
    {
      _id: 'photo_demo_2',
      photoPath: '/uploads/gallery/defaults/udaan_dance_night.jpg',
      filename: 'udaan_dance_night.jpg',
      eventName: 'Udaan — Classical & Fusion Dance Night',
      eventDate: 'November 15, 2025',
      photographerCredit: 'Abhishek Prasad',
      photographerSource: 'Unsplash',
      isSocietyAttribution: true,
      isFeatured: false,
      caption: 'Graceful mudras and traditional ghungroo rhythms performed on the auditorium mainstage.',
    },
    {
      _id: 'photo_demo_3',
      photoPath: '/uploads/gallery/defaults/campus_beats_music_fest.jpg',
      filename: 'campus_beats_music_fest.jpg',
      eventName: 'Campus Beats — Inter-College Rock & Fusion Band Fest',
      eventDate: 'November 16, 2025',
      photographerCredit: 'Vishnu R Nair',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Live acoustic guitars, drums, and student band solos echoing across the open amphitheater.',
    },
    {
      _id: 'photo_demo_4',
      photoPath: '/uploads/gallery/defaults/ethnic_runway_showcase.jpg',
      filename: 'ethnic_runway_showcase.jpg',
      eventName: 'Vogue Heritage — Ethnic Runway & Fashion Showcase',
      eventDate: 'December 02, 2025',
      photographerCredit: 'Akash Raj',
      photographerSource: 'Unsplash',
      isSocietyAttribution: true,
      isFeatured: false,
      caption: 'Student models presenting handcrafted Indian textiles, silks, and contemporary fusion drapes.',
    },
    {
      _id: 'photo_demo_5',
      photoPath: '/uploads/gallery/defaults/hackverse_student_hackathon.jpg',
      filename: 'hackverse_student_hackathon.jpg',
      eventName: 'HackVerse — 36-Hour National Student Hackathon',
      eventDate: 'December 12, 2025',
      photographerCredit: 'Desola Lanre-Ologun',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Overnight coding sprints, AI prototypes, and full-stack software development in computer labs.',
    },
    {
      _id: 'photo_demo_6',
      photoPath: '/uploads/gallery/defaults/robokriti_robotics_expo.jpg',
      filename: 'robokriti_robotics_expo.jpg',
      eventName: 'RoboKriti — Autonomous Robotics & Hardware Expo',
      eventDate: 'January 18, 2026',
      photographerCredit: 'Alex Knight',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Autonomous rover navigation and line-follower robotics competitions in the engineering hangar.',
    },
    {
      _id: 'photo_demo_7',
      photoPath: '/uploads/gallery/defaults/freshers_fiesta_orientation.jpg',
      filename: 'freshers_fiesta_orientation.jpg',
      eventName: 'Freshers Fiesta — Society Welcoming & Orientation',
      eventDate: 'August 22, 2025',
      photographerCredit: 'Priscilla Du Preez',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'First-year undergraduates discovering student societies, tech clubs, and campus cultural teams.',
    },
    {
      _id: 'photo_demo_8',
      photoPath: '/uploads/gallery/defaults/expressions_art_exhibition.jpg',
      filename: 'expressions_art_exhibition.jpg',
      eventName: 'Expressions — Fine Arts & Photography Exhibition',
      eventDate: 'January 25, 2026',
      photographerCredit: 'Khara Woods',
      photographerSource: 'Unsplash',
      isSocietyAttribution: true,
      isFeatured: false,
      caption: 'Student oil canvases, digital illustrations, and photographic prints in the creative library foyer.',
    },
    {
      _id: 'photo_demo_9',
      photoPath: '/uploads/gallery/defaults/campus_sports_carnival.jpg',
      filename: 'campus_sports_carnival.jpg',
      eventName: 'Campus Sports Carnival — Inter-Hostel Cricket & Track Finals',
      eventDate: 'February 10, 2026',
      photographerCredit: 'Surya Prakash',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Intense inter-hostel cricket cup finals cheered by enthusiastic student spectators in the stands.',
    },
    {
      _id: 'photo_demo_10',
      photoPath: '/uploads/gallery/defaults/awaaz_street_play.jpg',
      filename: 'awaaz_street_play.jpg',
      eventName: 'Awaaz — Inter-College Nukkad Natak Street Play',
      eventDate: 'February 22, 2026',
      photographerCredit: 'Rob Laughter',
      photographerSource: 'Unsplash',
      isSocietyAttribution: true,
      isFeatured: false,
      caption: 'High-energy street drama troupe addressing societal themes through acoustic rhythm and dialogue.',
    },
    {
      _id: 'photo_demo_11',
      photoPath: '/uploads/gallery/defaults/samvaad_parliamentary_symposium.jpg',
      filename: 'samvaad_parliamentary_symposium.jpg',
      eventName: 'Samvaad — Literary & Youth Parliament Symposium',
      eventDate: 'March 05, 2026',
      photographerCredit: 'Mimi Thian',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Interactive parliamentary roundtables, student resolutions, and panel discussions on public policy.',
    },
    {
      _id: 'photo_demo_12',
      photoPath: '/uploads/gallery/defaults/utsav_spring_lantern_night.jpg',
      filename: 'utsav_spring_lantern_night.jpg',
      eventName: 'Utsav — Campus Spring Lantern & Evening Celebration',
      eventDate: 'March 18, 2026',
      photographerCredit: 'Product School',
      photographerSource: 'Unsplash',
      isSocietyAttribution: false,
      isFeatured: false,
      caption: 'Hundreds of lamps and ambient fairy lights decorating the central lawn during spring semester closing.',
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

