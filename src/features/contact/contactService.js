import api from '../../services/api/axiosInstance';
import endpoints from '../../services/api/apiEndpoints';

export const createContactMessage = async (payload, config = {}) =>
  (await api.post(endpoints.contact.create, payload, config)).data;
