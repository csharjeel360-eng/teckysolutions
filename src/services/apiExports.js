// services/apiExports.js
import api from './api';

// SIMPLE BLOGS API - NO COMPLEX STRUCTURES
export const blogsAPI = {
  getAll: (params = {}) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  getById: (id) => api.get(`/blogs/id/${id}`),
  create: (blogData) => {
    if (blogData instanceof FormData) {
      return api.post('/blogs', blogData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/blogs', blogData);
  },
  update: (id, blogData) => {
    if (blogData instanceof FormData) {
      return api.put(`/blogs/${id}`, blogData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/blogs/${id}`, blogData);
  },
  delete: (id) => api.delete(`/blogs/${id}`),
  deleteContentImage: (blogId, publicId) => api.delete(`/blogs/${blogId}/content-images/${publicId}`),
  like: (id) => api.post(`/blogs/${id}/like`),
  addComment: (id, comment) => api.post(`/blogs/${id}/comments`, { comment }),
  getPopular: () => api.get('/blogs/featured/popular'),
  getFeatured: () => api.get('/blogs/featured/featured')
};

// Other APIs
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => {
    if (categoryData instanceof FormData) {
      return api.post('/categories', categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/categories', categoryData);
  },
  update: (id, categoryData) => {
    if (categoryData instanceof FormData) {
      return api.put(`/categories/${id}`, categoryData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/categories/${id}`, categoryData);
  },
  delete: (id) => api.delete(`/categories/${id}`),
};

export const productsAPI = {
  getAll: (params = {}) => api.get('/listings', { params }),
  getById: (id) => api.get(`/listings/${id}`),
  create: (productData) => {
    if (productData instanceof FormData) {
      return api.post('/listings', productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/listings', productData);
  },
  update: (id, productData) => {
    if (productData instanceof FormData) {
      return api.put(`/listings/${id}`, productData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/listings/${id}`, productData);
  },
  delete: (id) => api.delete(`/listings/${id}`),
  deleteImage: (productId, imageId) => api.delete(`/listings/${productId}/images/${imageId}`),
};

export const bannersAPI = {
  getAll: () => api.get('/banners'),
  getById: (id) => api.get(`/banners/${id}`),
  create: (bannerData) => {
    if (bannerData instanceof FormData) {
      return api.post('/banners', bannerData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/banners', bannerData);
  },
  update: (id, bannerData) => {
    if (bannerData instanceof FormData) {
      return api.put(`/banners/${id}`, bannerData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/banners/${id}`, bannerData);
  },
  delete: (id) => api.delete(`/banners/${id}`),
};

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
};

export const adminAPI = {
  getDashboardStats: () => api.get('/admin/dashboard'),
  getUsers: () => api.get('/admin/users'),
};

// Debug logs removed