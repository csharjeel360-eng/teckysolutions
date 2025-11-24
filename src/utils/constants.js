export const APP_CONFIG = {
  name: 'TemuClone',
  version: '1.0.0',
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  uploadMaxSize: import.meta.env.VITE_UPLOAD_MAX_SIZE || 5242880,
};

export const PRODUCT_CATEGORIES = [
  'Electronics',
  'Fashion',
  'Home & Garden',
  'Beauty & Health',
  'Sports & Outdoors',
  'Toys & Games',
  'Automotive',
  'Books & Media',
];

export const SORT_OPTIONS = [
  { value: 'createdAt', label: 'Newest First' },
  { value: '-createdAt', label: 'Oldest First' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
  { value: 'title', label: 'Name: A to Z' },
  { value: '-title', label: 'Name: Z to A' },
  { value: '-averageRating', label: 'Highest Rated' },
];

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const BLOG_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};