import api from './api';

export const proposalService = {
  /**
   * Submit a new comprehensive campus event proposal
   */
  submitProposal: async (proposalData) => {
    const response = await api.post('/proposals', proposalData);
    return response.data;
  },

  /**
   * Get all proposals submitted by current student organizer
   */
  getMyProposals: async () => {
    const response = await api.get('/proposals/my');
    return response.data;
  },

  /**
   * Get single proposal by ID or reference code
   */
  getProposalById: async (id) => {
    const response = await api.get(`/proposals/${id}`);
    return response.data;
  },

  /**
   * Get all proposals for administrative review (Admin only)
   */
  getAllProposals: async (params = {}) => {
    const response = await api.get('/proposals', { params });
    return response.data;
  },

  /**
   * Update proposal review status (Admin only)
   */
  updateProposalStatus: async (id, status, reviewFeedback = '') => {
    const response = await api.patch(`/proposals/${id}/status`, { status, reviewFeedback });
    return response.data;
  },
};

export default proposalService;

