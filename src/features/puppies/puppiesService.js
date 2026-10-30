import api from '../../services/api/axiosInstance';
import endpoints from '../../services/api/apiEndpoints';

export const getPuppies = async (params = {}, config = {}) =>
  (await api.get(endpoints.puppies.list, { params, ...config })).data;

export const getFeaturedPuppies = async (config = {}) =>
  (await api.get(endpoints.puppies.featured, config)).data;

export const getPuppyBySlug = async (slug, config = {}) =>
  (await api.get(endpoints.puppies.bySlug(slug), config)).data;
