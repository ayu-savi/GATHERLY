const RENDER_BASE_URL = 'https://gatherly-pahb.onrender.com';

/**
 * Normalizes an image path so it always resolves correctly both locally and in production
 * @param {string} path - Raw image path (e.g., "/uploads/events/photo.jpg" or "https://...")
 * @returns {string} Fully resolved image URL
 */
export const getFullImageUrl = (path) => {
  if (!path || typeof path !== 'string') return '/uploads/events/rhythm_lights_cultural.jpg';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // In production, prepend Render backend URL if path starts with /uploads
  if (import.meta.env.PROD && path.startsWith('/uploads')) {
    return `${RENDER_BASE_URL}${path}`;
  }
  return path;
};

export default getFullImageUrl;
