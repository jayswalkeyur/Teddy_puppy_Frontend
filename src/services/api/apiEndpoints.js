const API_ENDPOINTS = {
  puppies: {
    list: '/puppies',
    featured: '/puppies/featured',
    bySlug: (slug) => `/puppies/${encodeURIComponent(slug)}`,
  },
  enquiries: { create: '/enquiries' },
  contact: { create: '/contact' },
};

export default API_ENDPOINTS;
