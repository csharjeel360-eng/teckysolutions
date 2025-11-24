 // Format currency
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

// Format date
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return 'Invalid date';
  
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    
    return new Date(dateString).toLocaleDateString('en-US', {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
};

// Format date and time
export const formatDateTime = (dateString, options = {}) => {
  if (!dateString) return 'Invalid date';
  
  try {
    const defaultOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    };
    
    return new Date(dateString).toLocaleDateString('en-US', {
      ...defaultOptions,
      ...options,
    });
  } catch (error) {
    console.error('Error formatting date time:', error);
    return 'Invalid date';
  }
};

// Generate excerpt from text
export const generateExcerpt = (text, maxLength = 120) => {
  if (!text) return '';
  
  // Remove HTML tags if present
  const cleanText = text.replace(/<[^>]*>/g, '');
  
  if (cleanText.length <= maxLength) {
    return cleanText;
  }
  
  return cleanText.substring(0, maxLength).trim() + '...';
};

// Calculate discount percentage
export const calculateDiscount = (originalPrice, salePrice) => {
  if (!originalPrice || !salePrice || originalPrice <= 0) return 0;
  if (salePrice >= originalPrice) return 0;
  
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
};

// Calculate sale price
export const calculateSalePrice = (originalPrice, discountPercent) => {
  if (!originalPrice || !discountPercent) return originalPrice;
  return originalPrice - (originalPrice * discountPercent / 100);
};

// Validate email
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL
export const validateURL = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

// Validate phone number (US format)
export const validatePhone = (phone) => {
  if (!phone) return false;
  const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
};

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Generate random ID
export const generateId = (prefix = '') => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};

// Generate unique slug from text
export const generateSlug = (text) => {
  if (!text) return '';
  
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

// Get image placeholder
export const getImagePlaceholder = (width = 300, height = 300, text = 'No Image') => {
  const encodedText = encodeURIComponent(text);
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodedText}`;
};

// Generate dynamic placeholder with text and color
export const getDynamicPlaceholder = (text, width = 300, height = 300) => {
  const colors = ['ff6b6b', '4ecdc4', '45b7d1', '96ceb4', 'feca57', 'ff9ff3'];
  const color = colors[text?.length % colors.length] || '4ecdc4';
  const encodedText = encodeURIComponent(text || 'Image');
  return `https://via.placeholder.com/${width}x${height}/${color}/ffffff?text=${encodedText}`;
};

// Calculate average rating
export const calculateAverageRating = (reviews) => {
  if (!reviews || !Array.isArray(reviews) || reviews.length === 0) return 0;
  
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return parseFloat((sum / reviews.length).toFixed(1));
};

// Calculate rating distribution
export const calculateRatingDistribution = (reviews) => {
  if (!reviews || !Array.isArray(reviews)) {
    return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  }
  
  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  
  reviews.forEach(review => {
    const rating = Math.round(review.rating);
    if (distribution[rating] !== undefined) {
      distribution[rating]++;
    }
  });
  
  return distribution;
};

// Format relative time (e.g., "2 days ago", "just now")
export const formatRelativeTime = (dateString) => {
  if (!dateString) return 'Unknown time';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 0) {
      return 'in the future';
    }
    
    if (diffInSeconds < 60) {
      return 'just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return 'Unknown time';
  }
};

// Format number with commas
export const formatNumber = (number) => {
  if (number === null || number === undefined) return '0';
  return number.toLocaleString();
};

// Format large numbers (1K, 1M, etc.)
export const formatLargeNumber = (number) => {
  if (number === null || number === undefined) return '0';
  
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1) + 'M';
  }
  
  if (number >= 1000) {
    return (number / 1000).toFixed(1) + 'K';
  }
  
  return number.toString();
};

// Generate random color for placeholders
export const generateRandomColor = () => {
  const colors = [
    'ff6b6b', '4ecdc4', '45b7d1', '96ceb4', 'feca57', 'ff9ff3',
    '54a0ff', '5f27cd', '00d2d3', 'ff9ff3', 'f368e0', 'ff9f43'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Capitalize first letter
export const capitalize = (text) => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

// Capitalize each word
export const capitalizeWords = (text) => {
  if (!text) return '';
  return text.replace(/\w\S*/g, (word) => 
    word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
  );
};

// Truncate text
export const truncate = (text, maxLength, suffix = '...') => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

// Remove HTML tags
export const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, '');
};

// Get initials from name
export const getInitials = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .substring(0, 2);
};

// Generate gradient colors
export const generateGradient = (color1, color2, angle = 45) => {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
};

// Check if value is empty
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

// Deep clone object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    Object.keys(obj).forEach(key => {
      clonedObj[key] = deepClone(obj[key]);
    });
    return clonedObj;
  }
};

// Merge objects deeply
export const deepMerge = (target, source) => {
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          output[key] = source[key];
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        output[key] = source[key];
      }
    });
  }
  
  return output;
};

// Check if value is object
export const isObject = (item) => {
  return item && typeof item === 'object' && !Array.isArray(item);
};

// Get query parameters from URL
export const getQueryParams = (url = window.location.search) => {
  const params = new URLSearchParams(url);
  const result = {};
  
  for (const [key, value] of params) {
    result[key] = value;
  }
  
  return result;
};

// Build query string from object
export const buildQueryString = (params) => {
  if (!params || typeof params !== 'object') return '';
  
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined) {
      searchParams.append(key, params[key]);
    }
  });
  
  return searchParams.toString();
};

// Scroll to element smoothly
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
};

// Copy text to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

// Download file
export const downloadFile = (content, filename, contentType = 'text/plain') => {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Generate random number in range
export const randomInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Shuffle array
export const shuffleArray = (array) => {
  if (!Array.isArray(array)) return [];
  
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Remove duplicates from array
export const removeDuplicates = (array, key = null) => {
  if (!Array.isArray(array)) return [];
  
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) {
        return false;
      }
      seen.add(value);
      return true;
    });
  }
  
  return [...new Set(array)];
};

// Group array by key
export const groupBy = (array, key) => {
  if (!Array.isArray(array)) return {};
  
  return array.reduce((groups, item) => {
    const group = item[key];
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(item);
    return groups;
  }, {});
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  if (!Array.isArray(array)) return [];
  
  return [...array].sort((a, b) => {
    let aValue = a[key];
    let bValue = b[key];
    
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }
    
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Format file size
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Check if device is mobile
export const isMobile = () => {
  return window.innerWidth <= 768;
};

// Check if device is tablet
export const isTablet = () => {
  return window.innerWidth > 768 && window.innerWidth <= 1024;
};

// Check if device is desktop
export const isDesktop = () => {
  return window.innerWidth > 1024;
};

// Get current breakpoint
export const getBreakpoint = () => {
  const width = window.innerWidth;
  
  if (width < 640) return 'xs';
  if (width < 768) return 'sm';
  if (width < 1024) return 'md';
  if (width < 1280) return 'lg';
  return 'xl';
};

// Add delay
export const delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Parse JSON safely
export const safeJsonParse = (str, defaultValue = null) => {
  try {
    return JSON.parse(str);
  } catch (error) {
    return defaultValue;
  }
};

// Stringify JSON safely
export const safeJsonStringify = (obj, defaultValue = '{}') => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    return defaultValue;
  }
};

// Generate UUID
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Calculate age from birth date
export const calculateAge = (birthDate) => {
  if (!birthDate) return 0;
  
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
};

// Export all functions as default object for easier imports
export default {
  formatCurrency,
  formatDate,
  formatDateTime,
  generateExcerpt,
  calculateDiscount,
  calculateSalePrice,
  validateEmail,
  validateURL,
  validatePhone,
  debounce,
  throttle,
  generateId,
  generateSlug,
  getImagePlaceholder,
  getDynamicPlaceholder,
  calculateAverageRating,
  calculateRatingDistribution,
  formatRelativeTime,
  formatNumber,
  formatLargeNumber,
  generateRandomColor,
  capitalize,
  capitalizeWords,
  truncate,
  stripHtml,
  getInitials,
  generateGradient,
  isEmpty,
  deepClone,
  deepMerge,
  isObject,
  getQueryParams,
  buildQueryString,
  scrollToElement,
  copyToClipboard,
  downloadFile,
  randomInRange,
  shuffleArray,
  removeDuplicates,
  groupBy,
  sortBy,
  formatFileSize,
  isMobile,
  isTablet,
  isDesktop,
  getBreakpoint,
  delay,
  safeJsonParse,
  safeJsonStringify,
  generateUUID,
  calculateAge
};