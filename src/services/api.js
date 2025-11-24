// services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Debug flag (set to false to disable verbose logging)
const DEBUG = false;

// Request interceptor with debug
api.interceptors.request.use(
  (config) => {
    // Remove default Content-Type if FormData is being sent
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    // Request debug logging removed
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    if (DEBUG) {
      console.error('❌ Request Interceptor Error:', error);
    }
    return Promise.reject(error);
  }
);

// Response interceptor with debug
api.interceptors.response.use(
  (response) => {
    // Response debug logging removed
    return response;
  },
  (error) => {
    // Don't log 404 errors - they're often expected (e.g., image deletion attempts)
    if (DEBUG && error.response?.status !== 404) {
      console.error('❌ API Error:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        response: error.response?.data,
      });
    }
    
    // Only redirect to login on 401 if we have a token (user was logged in but session expired)
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// BLOGS API
export const blogsAPI = {
  getAll: (params = {}) => api.get('/blogs', { params }),
  getBySlug: (slug) => api.get(`/blogs/${slug}`),
  getById: (id) => api.get(`/blogs/id/${id}`),
  create: (blogData) => {
    if (blogData instanceof FormData) {
      return api.post('/blogs', blogData);
    }
    return api.post('/blogs', blogData);
  },
  update: (id, blogData) => {
    if (blogData instanceof FormData) {
      // For FormData, check if there are any files
      const hasFiles = Array.from(blogData.entries()).some(([key, value]) => 
        value instanceof File || value instanceof Blob
      );
        // Debug logs removed
      
      if (!hasFiles) {
        // Convert FormData to plain object and send as JSON
        const dataObj = {};
        for (let [key, value] of blogData.entries()) {
          if (dataObj[key]) {
            if (!Array.isArray(dataObj[key])) {
              dataObj[key] = [dataObj[key]];
            }
            dataObj[key].push(value);
          } else {
            dataObj[key] = value;
          }
        }
        // Sending blog update as JSON (no files detected)
        
        // Use Fetch API directly with explicit JSON serialization to bypass any axios issues
        const token = localStorage.getItem('token');
        const fetchOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(dataObj)
        };
        
        // Fetch options prepared
        
        return fetch(`${API_BASE_URL}/blogs/${id}`, fetchOptions)
          .then(response => {
            if (!response.ok) {
              return response.json().then(data => {
                throw new Error(JSON.stringify({ status: response.status, data }));
              });
            }
            return response.json();
          })
          .catch(error => {
            if (DEBUG) {
              console.error('Fetch error:', error);
            }
            throw error;
          });
      }
      
      return api.put(`/blogs/${id}`, blogData);
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

// CATEGORIES API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// PRODUCTS API - FIXED DUPLICATE getReviews
export const productsAPI = {
  // Basic CRUD
  getAll: (params = {}) => api.get('/products', { params }),
  getById: (id) => api.get(`/products/${id}`),
  getBySlug: (slug) => api.get(`/products/slug/${slug}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  delete: (id) => api.delete(`/products/${id}`),
  
  // Images Management
  deleteImage: (productId, imageId) => api.delete(`/products/${productId}/images/${imageId}`),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData),
  
  // Analytics & Tracking
  recordBuyClick: (id) => api.post(`/products/${id}/buy-click`),
  recordView: (id) => api.post(`/products/${id}/view`),
  getAnalytics: (id) => api.get(`/products/${id}/analytics`),
  
  // Reviews System
  addReview: (id, review) => api.post(`/products/${id}/reviews`, review),
  getReviews: (id) => api.get(`/products/${id}/reviews`),
  
  // Search & Filtering
  search: (params = {}) => api.get('/products/search', { params }),
  getByCategory: (categoryId, params = {}) => api.get(`/products/category/${categoryId}`, { params }),
  getByTag: (tag, params = {}) => api.get(`/products/tag/${tag}`, { params }),
  getRelated: (id) => api.get(`/products/${id}/related`),
  getFeatured: (params = {}) => api.get('/products/featured', { params }),
  getPopular: (params = {}) => api.get('/products/popular', { params }),
  
  // Management
  updateStock: (id, stock) => api.patch(`/products/${id}/stock`, { stock }),
  toggleFeatured: (id) => api.patch(`/products/${id}/featured`),
  
  // Bulk Operations
  bulkUpdate: (products) => api.patch('/products/bulk-update', { products }),
  bulkDelete: (ids) => api.post('/products/bulk-delete', { ids }),
  
  // Import/Export
  exportProducts: (params = {}) => api.get('/products/export', { 
    params, 
    responseType: 'blob' 
  }),
  importProducts: (formData) => api.post('/products/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  
  // Statistics
  getStatistics: () => api.get('/products/statistics'),
  getCategoriesWithCounts: () => api.get('/products/categories/counts'),
};

// BANNERS API
export const bannersAPI = {
  getAll: () => api.get('/banners'),
  getById: (id) => api.get(`/banners/${id}`),
  getByPosition: (position) => api.get(`/banners/position/${position}`),
  getHomepage: () => api.get('/banners/homepage'),
  create: (bannerData) => api.post('/banners', bannerData),
  update: (id, bannerData) => api.put(`/banners/${id}`, bannerData),
  delete: (id) => api.delete(`/banners/${id}`),
  toggle: (id) => api.patch(`/banners/${id}/toggle`)
};

// AUTH API - UPDATED WITH GOOGLE AUTH AND FIREBASE INTEGRATION
export const authAPI = {
  // Firebase authentication (exchange Firebase ID token for app JWT)
  firebaseAuth: (idToken, provider = 'firebase') => api.post('/auth/firebase', { idToken, provider }),

  // Email/Password Authentication
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  
  // Google OAuth Authentication
  loginWithGoogle: (googleData) => api.post('/auth/google', googleData),

  // Admin login (separate endpoint if backend exposes admin-only auth)
  adminLogin: (credentials) => api.post('/auth/admin/login', credentials),
  // Create admin (development only - backend exposes /auth/create-admin)
  createAdmin: (adminData) => api.post('/auth/create-admin', adminData),
  
  // Profile Management
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  changePassword: (passwordData) => api.put('/auth/password', passwordData),
  
  // Session Management
  logout: () => api.post('/auth/logout'),
  refreshToken: () => api.post('/auth/refresh-token'),
  
  // Password Reset (Backend - optional, Firebase handles the actual reset)
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
  
  // Email Verification
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  resendVerification: () => api.post('/auth/resend-verification'),
  
  // Account Management
  deleteAccount: () => api.delete('/auth/account'),
  updatePreferences: (preferences) => api.put('/auth/preferences', preferences),
};

// ADMIN API
export const adminAPI = {
  // Dashboard
  getDashboardStats: () => api.get('/admin/dashboard'),
  getAnalytics: (params = {}) => api.get('/admin/analytics', { params }),
  
  // User Management
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  createUser: (userData) => api.post('/admin/users', userData),
  updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  toggleUserStatus: (id) => api.patch(`/admin/users/${id}/status`),
  
  // Order Management
  getOrders: (params = {}) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrder: (id, orderData) => api.put(`/admin/orders/${id}`, orderData),
  deleteOrder: (id) => api.delete(`/admin/orders/${id}`),
  
  // Product Management
  getProducts: (params = {}) => api.get('/admin/products', { params }),
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  
  // Blog Management
  getBlogs: (params = {}) => api.get('/admin/blogs', { params }),
  createBlog: (blogData) => api.post('/admin/blogs', blogData),
  updateBlog: (id, blogData) => api.put(`/admin/blogs/${id}`, blogData),
  deleteBlog: (id) => api.delete(`/admin/blogs/${id}`),
  
  // Category Management
  getCategories: () => api.get('/admin/categories'),
  createCategory: (categoryData) => api.post('/admin/categories', categoryData),
  updateCategory: (id, categoryData) => api.put(`/admin/categories/${id}`, categoryData),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  
  // Banner Management
  getBanners: () => api.get('/admin/banners'),
  createBanner: (bannerData) => api.post('/admin/banners', bannerData),
  updateBanner: (id, bannerData) => api.put(`/admin/banners/${id}`, bannerData),
  deleteBanner: (id) => api.delete(`/admin/banners/${id}`),
  
  // Settings
  getSettings: () => api.get('/admin/settings'),
  updateSettings: (settings) => api.put('/admin/settings', settings),
  
  // Reports
  generateReport: (reportType, params = {}) => api.get(`/admin/reports/${reportType}`, { params }),
  exportData: (dataType, params = {}) => api.get(`/admin/export/${dataType}`, { 
    params, 
    responseType: 'blob' 
  }),
};

// CART API - UPDATED WITH EXTERNAL PRODUCTS SUPPORT
export const cartAPI = {
  // Basic Cart Operations
  getCart: () => api.get('/cart').catch(error => apiUtils ? apiUtils.handleError(error) : Promise.reject(error)),
  addToCart: (productId, quantity = 1) => api.post('/cart/items', { productId, quantity }),
  updateCartItem: (productId, quantity) => api.put(`/cart/items/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/items/${productId}`),
  clearCart: () => api.delete('/cart'),
  getCartCount: () => api.get('/cart/count'),
  
  // Coupon Operations
  applyCoupon: (couponCode) => api.post('/cart/coupon', { couponCode }),
  removeCoupon: () => api.delete('/cart/coupon'),
  
  // ✅ ADDED: External Products Operations
  // Guarded: avoid repeated 404s by remembering if backend supports this endpoint.
  getExternalProducts: () => {
    try {
      const supported = localStorage.getItem('externalProductsSupported');
      if (supported === 'false') {
        // Return a resolved response shaped like the real API (empty result)
        return Promise.resolve({ data: { data: { externalProducts: [], count: 0 } } });
      }

      return api.get('/cart/external-products').catch(err => {
        if (err.response?.status === 404) {
          // Remember that backend doesn't support this endpoint to avoid future 404s
          try { localStorage.setItem('externalProductsSupported', 'false'); } catch(e) {}
          return Promise.resolve({ data: { data: { externalProducts: [], count: 0 } } });
        }
        return Promise.reject(err);
      });
    } catch (e) {
      // Fallback to the direct request if localStorage access fails
      return api.get('/cart/external-products');
    }
  },
  
  // ✅ ADDED: Bulk External Products Operations
  buyAllExternalProducts: () => api.post('/cart/buy-all-external'),
  
  // ✅ ADDED: Individual External Product Purchase
  buyExternalProduct: (productId) => api.post(`/cart/items/${productId}/buy-external`),
  
  // ✅ ADDED: Cart Analytics
  getCartAnalytics: () => api.get('/cart/analytics'),
  
  // ✅ ADDED: Save for Later (if implemented)
  moveToSaveForLater: (productId) => api.post(`/cart/items/${productId}/save-later`),
  getSavedItems: () => api.get('/cart/saved-items'),
  moveToCart: (productId) => api.post(`/cart/saved-items/${productId}/move-to-cart`),
  
  // ✅ ADDED: Cart Sharing
  shareCart: (email) => api.post('/cart/share', { email }),
  getSharedCart: (shareToken) => api.get(`/cart/shared/${shareToken}`),
  
  // ✅ ADDED: Cart Recommendations
  getRecommendations: () => api.get('/cart/recommendations')
};

// ORDERS API
export const ordersAPI = {
  getAll: (params = {}) => api.get('/orders', { params }),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  update: (id, orderData) => api.put(`/orders/${id}`, orderData),
  cancel: (id) => api.post(`/orders/${id}/cancel`),
  getOrderHistory: () => api.get('/orders/history'),
  trackOrder: (id) => api.get(`/orders/${id}/track`),
  downloadInvoice: (id) => api.get(`/orders/${id}/invoice`, { responseType: 'blob' }),
};

// WISHLIST API
export const wishlistAPI = {
  getAll: () => api.get('/wishlist'),
  addToWishlist: (productId) => api.post('/wishlist/items', { productId }),
  removeFromWishlist: (productId) => api.delete(`/wishlist/items/${productId}`),
  checkInWishlist: (productId) => api.get(`/wishlist/items/${productId}`),
  moveToCart: (productId) => api.post(`/wishlist/items/${productId}/move-to-cart`),
  clearWishlist: () => api.delete('/wishlist'),
};

// REVIEWS API
export const reviewsAPI = {
  getUserReviews: () => api.get('/reviews/user'),
  updateReview: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
  deleteReview: (id) => api.delete(`/reviews/${id}`),
  reportReview: (id, reason) => api.post(`/reviews/${id}/report`, { reason }),
  getPendingReviews: () => api.get('/reviews/pending'),
  getReviewStats: () => api.get('/reviews/stats'),
};

// UPLOADS API - FIXED TO MATCH BACKEND ROUTES
export const uploadsAPI = {
  // Single image upload
  uploadImage: (formData) => api.post('/uploads/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  // Multiple images upload
  uploadImages: (formData) => api.post('/uploads/images', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  // Delete image
  deleteImage: (publicId) => api.delete(`/uploads/image/${publicId}`),
  // File upload (generic)
  uploadFile: (formData) => api.post('/uploads/files', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteFile: (fileId) => api.delete(`/uploads/files/${fileId}`),
  // Avatar upload
  uploadAvatar: (formData) => api.post('/uploads/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// SETTINGS API
export const settingsAPI = {
  getSettings: () => api.get('/settings'),
  updateSettings: (settings) => api.put('/settings', settings),
  getPublicSettings: () => api.get('/settings/public'),
};

// NOTIFICATIONS API
export const notificationsAPI = {
  getAll: (params = {}) => api.get('/notifications', { params }),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  delete: (id) => api.delete(`/notifications/${id}`),
  getUnreadCount: () => api.get('/notifications/unread-count'),
};

// ADDRESSES API
export const addressesAPI = {
  getAll: () => api.get('/addresses'),
  getById: (id) => api.get(`/addresses/${id}`),
  create: (addressData) => api.post('/addresses', addressData),
  update: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  delete: (id) => api.delete(`/addresses/${id}`),
  setDefault: (id) => api.patch(`/addresses/${id}/default`),
};

// PAYMENTS API
export const paymentsAPI = {
  createPaymentIntent: (orderData) => api.post('/payments/create-intent', orderData),
  confirmPayment: (paymentData) => api.post('/payments/confirm', paymentData),
  getPaymentMethods: () => api.get('/payments/methods'),
  addPaymentMethod: (methodData) => api.post('/payments/methods', methodData),
  deletePaymentMethod: (methodId) => api.delete(`/payments/methods/${methodId}`),
  getPaymentHistory: () => api.get('/payments/history'),
};

// SUBSCRIPTIONS API
export const subscriptionsAPI = {
  getPlans: () => api.get('/subscriptions/plans'),
  subscribe: (planId, paymentMethod) => api.post('/subscriptions/subscribe', { planId, paymentMethod }),
  cancelSubscription: () => api.post('/subscriptions/cancel'),
  updateSubscription: (planId) => api.put('/subscriptions/update', { planId }),
  getSubscription: () => api.get('/subscriptions/current'),
  getInvoices: () => api.get('/subscriptions/invoices'),
};

// SUPPORT API
export const supportAPI = {
  createTicket: (ticketData) => api.post('/support/tickets', ticketData),
  getTickets: (params = {}) => api.get('/support/tickets', { params }),
  getTicket: (id) => api.get(`/support/tickets/${id}`),
  addMessage: (ticketId, message) => api.post(`/support/tickets/${id}/messages`, { message }),
  closeTicket: (id) => api.patch(`/support/tickets/${id}/close`),
  getFaqs: () => api.get('/support/faqs'),
};

// FIREBASE API (Utility functions for Firebase integration)
export const firebaseAPI = {
  // These are client-side only, but we can define them here for consistency
  // The actual implementation is in the useAuth hook
  googleAuth: {
    // This would be handled by the frontend Firebase SDK
    // We keep this here as a reference
    provider: 'google',
    scopes: ['email', 'profile']
  },
  passwordReset: {
    // Firebase handles this, but we can define the expected behavior
    actionCodeSettings: {
      url: `${window.location.origin}/reset-password`,
      handleCodeInApp: false
    }
  }
};

// Debug export info removed

// Utility functions for API error handling
export const apiUtils = {
  // Extract error message from various error formats
  getErrorMessage: (error) => {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.response?.data?.error) {
      return error.response.data.error;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  },
  
  // Check if error is a network error
  isNetworkError: (error) => {
    return error.message === 'Network Error' || error.code === 'NETWORK_ERROR';
  },
  
  // Check if error is due to authentication
  isAuthError: (error) => {
    return error.response?.status === 401 || error.response?.status === 403;
  },
  
  // Handle API errors consistently
  handleError: (error, customMessage = null) => {
    const message = customMessage || apiUtils.getErrorMessage(error);
    
    if (DEBUG) {
      console.error('API Error Handler:', {
        message,
        originalError: error,
        status: error.response?.status,
        data: error.response?.data
      });
    }
    
    return {
      success: false,
      error: message,
      status: error.response?.status,
      data: error.response?.data
    };
  },
  
  // Success response wrapper
  handleSuccess: (data, message = null) => {
    return {
      success: true,
      data,
      message
    };
  }
};

export { api };
export default api;