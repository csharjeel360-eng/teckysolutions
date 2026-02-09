// services/api.js
import axios from 'axios';

const API_BASE_URL = 'https://e-commerce-server-two-snowy.vercel.app/api';

// 🚀 Request deduplication & caching for performance optimization
const requestCache = new Map(); // { key: { data, timestamp } }
const inFlightRequests = new Map(); // { key: promise } - for deduplication
const CACHE_TTL = 30000; // 30 seconds (adjust per endpoint)

// Cache key generator
const getCacheKey = (method, url, params) => {
  const paramStr = params ? JSON.stringify(params) : '';
  return `${method}:${url}:${paramStr}`;
};

// Check if cached data is still fresh
const isCacheFresh = (timestamp, ttl = CACHE_TTL) => {
  return Date.now() - timestamp < ttl;
};

// Retrieve from cache
const getFromCache = (key) => {
  const cached = requestCache.get(key);
  if (cached && isCacheFresh(cached.timestamp)) {
    return cached.data;
  }
  requestCache.delete(key);
  return null;
};

// Store in cache
const setInCache = (key, data) => {
  requestCache.set(key, { data, timestamp: Date.now() });
};

// 🚀 In-flight request deduplication
const getOrCreateRequest = (key, requestFn) => {
  if (inFlightRequests.has(key)) {
    return inFlightRequests.get(key);
  }
  const promise = requestFn().finally(() => inFlightRequests.delete(key));
  inFlightRequests.set(key, promise);
  return promise;
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased to 30s to handle slow backends
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
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with caching & deduplication
api.interceptors.response.use(
  (response) => {
    // Don't cache admin or auth requests - they need fresh data
    const url = response.config.url;
    const isAdminRoute = url.includes('/admin/') || url.includes('/auth/');
    
    // Cache GET requests for performance (but NOT admin/auth routes)
    if (response.config.method === 'get' && response.status === 200 && !isAdminRoute) {
      const cacheKey = getCacheKey(response.config.method, response.config.url, response.config.params);
      setInCache(cacheKey, response);
    }
    return response;
  },
  (error) => {
    // Don't log 404 errors - they're often expected
    if (error.response?.status !== 404) {
      console.error('❌ API Error:', error.response?.status, error.config?.url);
    }
    
    // Only redirect to login on 401 if we have a token
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// 🚀 Optimized GET wrapper with cache & deduplication
const cachedGet = (url, params = {}) => {
  // Don't cache admin or auth routes - they need fresh data every time
  const isAdminRoute = url.includes('/admin/') || url.includes('/auth/');
  
  if (isAdminRoute) {
    // For admin routes, skip cache and go directly to API
    return api.get(url, { params });
  }
  
  const cacheKey = getCacheKey('get', url, params);
  
  // Check cache first
  const cached = getFromCache(cacheKey);
  if (cached) {
    return Promise.resolve(cached);
  }
  
  // Use in-flight deduplication for identical requests
  return getOrCreateRequest(cacheKey, () => 
    api.get(url, { params })
  );
};

// BLOGS API
export const blogsAPI = {
  getAll: (params = {}) => cachedGet('/blogs', params),
  getBySlug: (slug) => cachedGet(`/blogs/${slug}`),
  getById: (id) => cachedGet(`/blogs/id/${id}`),
  create: (blogData) => {
    // Only clear blog-related cache, not all cache
    for (let key of requestCache.keys()) {
      if (key.includes('/blogs')) {
        requestCache.delete(key);
      }
    }
    if (blogData instanceof FormData) {
      return api.post('/blogs', blogData);
    }
    return api.post('/blogs', blogData);
  },
  update: (id, blogData) => {
    // Only clear blog-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/blogs')) {
        requestCache.delete(key);
      }
    }
    if (blogData instanceof FormData) {
      const hasFiles = Array.from(blogData.entries()).some(([key, value]) => 
        value instanceof File || value instanceof Blob
      );
      if (!hasFiles) {
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
        const token = localStorage.getItem('token');
        const fetchOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
          },
          body: JSON.stringify(dataObj)
        };
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
            throw error;
          });
      }
      return api.put(`/blogs/${id}`, blogData);
    }
    return api.put(`/blogs/${id}`, blogData);
  },
  delete: (id) => {
    // Only clear blog-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/blogs')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/blogs/${id}`);
  },
  deleteContentImage: (blogId, publicId) => {
    // Only clear blog-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/blogs')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/blogs/${blogId}/content-images/${publicId}`);
  },
  like: (id) => {
    // Only clear blog-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/blogs')) {
        requestCache.delete(key);
      }
    }
    return api.post(`/blogs/${id}/like`);
  },
  addComment: (id, comment) => {
    // Only clear blog-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/blogs')) {
        requestCache.delete(key);
      }
    }
    return api.post(`/blogs/${id}/comments`, { comment });
  },
  getPopular: () => cachedGet('/blogs/featured/popular'),
  getFeatured: () => cachedGet('/blogs/featured/featured')
};

// CATEGORIES API
export const categoriesAPI = {
  getAll: (params = {}) => cachedGet('/categories', params),
  getById: (id) => cachedGet(`/categories/${id}`),
  create: (categoryData) => {
    // Only clear category-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/categories') || key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.post('/categories', categoryData);
  },
  update: (id, categoryData) => {
    // Only clear category-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/categories') || key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.put(`/categories/${id}`, categoryData);
  },
  delete: (id) => {
    // Only clear category-related cache
    for (let key of requestCache.keys()) {
      if (key.includes('/categories') || key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/categories/${id}`);
  },
};

  // LISTINGS API (formerly PRODUCTS)
export const productsAPI = {
  // Basic CRUD
  getAll: (params = {}) => cachedGet('/listings', params),
  getById: (id) => cachedGet(`/listings/${id}`),
  getBySlug: (slug) => cachedGet(`/listings/slug/${slug}`),
  create: (productData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings') || key.includes('/categories')) {
        requestCache.delete(key);
      }
    }
    return api.post('/listings', productData);
  },
  update: (id, productData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings') || key.includes('/categories')) {
        requestCache.delete(key);
      }
    }
    return api.put(`/listings/${id}`, productData);
  },
  delete: (id) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings') || key.includes('/categories')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/listings/${id}`);
  },
  
  // Images Management
  deleteImage: (productId, imageId) => {
    for (let key of requestCache.keys()) {
      if (key.includes(`/listings/${productId}`)) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/listings/${productId}/images/${imageId}`);
  },
  uploadImages: (id, formData) => {
    for (let key of requestCache.keys()) {
      if (key.includes(`/listings/${id}`)) {
        requestCache.delete(key);
      }
    }
    return api.post(`/listings/${id}/images`, formData);
  },
  
  // Analytics & Tracking
  recordBuyClick: (id) => api.post(`/listings/${id}/buy-click`),
  recordView: (id) => api.post(`/listings/${id}/view`),
  getAnalytics: (id) => cachedGet(`/listings/${id}/analytics`),
  
  // Reviews System
  addReview: (id, review) => {
    for (let key of requestCache.keys()) {
      if (key.includes(`/listings/${id}`)) {
        requestCache.delete(key);
      }
    }
    return api.post(`/listings/${id}/reviews`, review);
  },
  getReviews: (id) => cachedGet(`/listings/${id}/reviews`),
  
  // Search & Filtering
  search: (params = {}) => cachedGet('/listings/search', params),
  getByCategory: (categoryId, params = {}) => cachedGet(`/listings/category/${categoryId}`, params),
  getByTag: (tag, params = {}) => cachedGet(`/listings/tag/${tag}`, params),
  getRelated: (id) => cachedGet(`/listings/${id}/related`),
  getFeatured: (params = {}) => cachedGet('/listings/featured', params),
  getPopular: (params = {}) => cachedGet('/listings/popular', params),
  
  // Management
  updateStock: (id, stock) => {
    for (let key of requestCache.keys()) {
      if (key.includes(`/listings/${id}`) || key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.patch(`/listings/${id}/stock`, { stock });
  },
  toggleFeatured: (id) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.patch(`/listings/${id}/featured`);
  },
  
  // Bulk Operations
  bulkUpdate: (products) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.patch('/listings/bulk-update', { products });
  },
  bulkDelete: (ids) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.post('/listings/bulk-delete', { ids });
  },
  
  // Import/Export
  exportProducts: (params = {}) => api.get('/listings/export', { 
    params, 
    responseType: 'blob' 
  }),
  importProducts: (formData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/listings')) {
        requestCache.delete(key);
      }
    }
    return api.post('/listings/import', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  
  // Statistics
  getStatistics: () => cachedGet('/listings/statistics'),
  getCategoriesWithCounts: () => cachedGet('/listings/categories/counts'),
};

// BANNERS API
export const bannersAPI = {
  getAll: () => cachedGet('/banners'),
  getById: (id) => cachedGet(`/banners/${id}`),
  getByPosition: (position) => cachedGet(`/banners/position/${position}`),
  getHomepage: () => cachedGet('/banners/homepage'),
  create: (bannerData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/banners')) {
        requestCache.delete(key);
      }
    }
    return api.post('/banners', bannerData);
  },
  update: (id, bannerData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/banners')) {
        requestCache.delete(key);
      }
    }
    return api.put(`/banners/${id}`, bannerData);
  },
  delete: (id) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/banners')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/banners/${id}`);
  },
  toggle: (id) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/banners')) {
        requestCache.delete(key);
      }
    }
    return api.patch(`/banners/${id}/toggle`);
  }
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
  getProducts: (params = {}) => api.get('/admin/listings', { params }),
  createProduct: (productData) => api.post('/admin/listings', productData),
  updateProduct: (id, productData) => api.put(`/admin/listings/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/listings/${id}`),
  
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
  getCart: () => cachedGet('/cart').catch(error => apiUtils ? apiUtils.handleError(error) : Promise.reject(error)),
  addToCart: (productId, quantity = 1) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    // Support passing either a productId or an external product object
    if (typeof productId === 'string' || typeof productId === 'number') {
      return api.post('/cart/items', { productId, quantity });
    }

    // productId is an object describing an external item
    const productObj = productId || {};
    const body = {
      quantity,
      productTitle: productObj.title || productObj.productTitle || productObj.name || null,
      price: productObj.price || productObj.itemPrice || 0,
      productLink: productObj.externalLink || productObj.productLink || null,
      productImage: (productObj.images && productObj.images[0] && productObj.images[0].url) || productObj.productImage || null
    };
    return api.post('/cart/items', body);
  },
  updateCartItem: (productId, quantity) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.put(`/cart/items/${productId}`, { quantity });
  },
  removeFromCart: (productId) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/cart/items/${productId}`);
  },
  clearCart: () => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.delete('/cart');
  },
  getCartCount: () => cachedGet('/cart/count'),
  
  // Coupon Operations
  applyCoupon: (couponCode) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.post('/cart/coupon', { couponCode });
  },
  removeCoupon: () => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.delete('/cart/coupon');
  },
  
  // ✅ ADDED: External Products Operations
  getExternalProducts: () => {
    try {
      const supported = localStorage.getItem('externalProductsSupported');
      if (supported === 'false') {
        return Promise.resolve({ data: { data: { externalProducts: [], count: 0 } } });
      }
      return cachedGet('/cart/external-products').catch(err => {
        if (err.response?.status === 404) {
          try { localStorage.setItem('externalProductsSupported', 'false'); } catch(e) {}
          return Promise.resolve({ data: { data: { externalProducts: [], count: 0 } } });
        }
        return Promise.reject(err);
      });
    } catch (e) {
      return cachedGet('/cart/external-products');
    }
  },
  
  // ✅ ADDED: Bulk External Products Operations
  buyAllExternalProducts: () => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.post('/cart/buy-all-external');
  },
  
  // ✅ ADDED: Individual External Product Purchase
  buyExternalProduct: (productId) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.post(`/cart/items/${productId}/buy-external`);
  },
  
  // ✅ ADDED: Cart Analytics
  getCartAnalytics: () => cachedGet('/cart/analytics'),
  
  // ✅ ADDED: Save for Later
  moveToSaveForLater: (productId) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.post(`/cart/items/${productId}/save-later`);
  },
  getSavedItems: () => cachedGet('/cart/saved-items'),
  moveToCart: (productId) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.post(`/cart/saved-items/${productId}/move-to-cart`);
  },
  
  // ✅ ADDED: Cart Sharing
  shareCart: (email) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/cart')) {
        requestCache.delete(key);
      }
    }
    return api.post('/cart/share', { email });
  },
  getSharedCart: (shareToken) => cachedGet(`/cart/shared/${shareToken}`),
  
  // ✅ ADDED: Cart Recommendations
  getRecommendations: () => cachedGet('/cart/recommendations')
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
    timeout: 30000,
  }),
  // Multiple images upload
  uploadImages: (formData) => api.post('/uploads/images', formData, {
    timeout: 60000,
  }),
  // Delete image
  deleteImage: (publicId) => api.delete(`/uploads/image/${publicId}`),
  // File upload (generic)
  uploadFile: (formData) => api.post('/uploads/files', formData, {
  }),
  deleteFile: (fileId) => api.delete(`/uploads/files/${fileId}`),
  // Avatar upload
  uploadAvatar: (formData) => api.post('/uploads/avatar', formData, {
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

// OFFERS API - CPA/Affiliate Offers
export const offersAPI = {
  // Public endpoints
  getAll: (params = {}) => cachedGet('/offers', params),
  getById: (id) => cachedGet(`/offers/${id}`),
  getByCategory: (categoryId) => cachedGet(`/offers/category/${categoryId}`),
  getByType: (type) => cachedGet(`/offers/type/${type}`),
  search: (params = {}) => cachedGet('/offers', params),
  
  // Admin endpoints
  adminGetAll: (params = {}) => api.get('/offers/admin/all', { params }),
  create: (offerData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/offers')) {
        requestCache.delete(key);
      }
    }
    return api.post('/offers/admin', offerData);
  },
  update: (id, offerData) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/offers')) {
        requestCache.delete(key);
      }
    }
    return api.put(`/offers/admin/${id}`, offerData);
  },
  delete: (id) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/offers')) {
        requestCache.delete(key);
      }
    }
    return api.delete(`/offers/admin/${id}`);
  },
  toggleFeatured: (id) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/offers')) {
        requestCache.delete(key);
      }
    }
    return api.patch(`/offers/admin/${id}/toggle-featured`);
  },
  updateStatus: (id, status) => {
    for (let key of requestCache.keys()) {
      if (key.includes('/offers')) {
        requestCache.delete(key);
      }
    }
    return api.patch(`/offers/admin/${id}/status`, { status });
  },
  getStats: () => api.get('/offers/admin/stats')
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