import api from '../../services/api/axiosInstance';
import endpoints from '../../services/api/apiEndpoints';

export const createPuppyEnquiry = async (payload, config = {}) =>
  (await api.post(endpoints.enquiries.create, payload, config)).data;
