import api from './api';

export const galleryService = {
  /**
   * Fetch the current active campus memories gallery
   */
  async getActiveGallery() {
    const response = await api.get('/gallery');
    return response.data;
  },

  /**
   * Upload an image photograph file to server storage (Admin only)
   * @param {File} file
   */
  async uploadPhoto(file) {
    const formData = new FormData();
    formData.append('photo', file);

    const response = await api.post('/gallery/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  /**
   * Delete an uncommitted staged photo before publication (Admin only)
   * @param {string} filename
   */
  async deleteStagedPhoto(filename) {
    const response = await api.delete(`/gallery/staged/${encodeURIComponent(filename)}`);
    return response.data;
  },

  /**
   * Atomically publish and activate a new collection (Admin only)
   * @param {Object} collectionData - { title, description, photographs, isDemo }
   */
  async publishGallery(collectionData) {
    const response = await api.post('/gallery/publish', collectionData);
    return response.data;
  },
};

export default galleryService;
