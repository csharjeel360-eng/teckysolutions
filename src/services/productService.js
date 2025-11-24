// services/productService.js
import { productsAPI } from './api';

class ProductService {
  // Get all products with filters
  async getAll(params = {}) {
    try {
      const response = await productsAPI.getAll(params);
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data?.data || [],
        pagination: response.data?.pagination || {}
      };
    } catch (error) {
      console.error('❌ ProductService.getAll error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch products',
        products: [],
        data: null
      };
    }
  }

  // Get product by ID
  async getById(id) {
    try {
      const response = await productsAPI.getById(id);
      return {
        success: true,
        data: response.data,
        product: response.data?.product || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.getById error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Product not found',
        data: null,
        product: null
      };
    }
  }

  // Get product by slug
  async getBySlug(slug) {
    try {
      const response = await productsAPI.getBySlug(slug);
      return {
        success: true,
        data: response.data,
        product: response.data?.product || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.getBySlug error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Product not found',
        data: null,
        product: null
      };
    }
  }

  // Create new product
  async create(formData) {
    try {
      const response = await productsAPI.create(formData);
      return {
        success: true,
        data: response.data,
        message: 'Product created successfully',
        product: response.data?.product || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.create error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to create product',
        data: null,
        product: null
      };
    }
  }

  // Update product
  async update(id, formData) {
    try {
      const response = await productsAPI.update(id, formData);
      return {
        success: true,
        data: response.data,
        message: 'Product updated successfully',
        product: response.data?.product || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.update error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update product',
        data: null,
        product: null
      };
    }
  }

  // Delete product
  async delete(id) {
    try {
      const response = await productsAPI.delete(id);
      return {
        success: true,
        data: response.data,
        message: 'Product deleted successfully'
      };
    } catch (error) {
      console.error('❌ ProductService.delete error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete product',
        data: null
      };
    }
  }

  // Record buy click
  async recordBuyClick(id) {
    try {
      const response = await productsAPI.recordBuyClick(id);
      return {
        success: true,
        data: response.data,
        message: 'Buy click recorded'
      };
    } catch (error) {
      console.error('❌ ProductService.recordBuyClick error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to record buy click',
        data: null
      };
    }
  }

  // Record product view
  async recordView(id) {
  try {
    const response = await productsAPI.recordView(id);
    return {
      success: true,
      data: response.data,
      message: 'View recorded'
    };
    } catch (error) {
    console.error('❌ ProductService.recordView error:', error);
    // Don't treat 404 as a critical error for views
    if (error.response?.status === 404) {
      return {
        success: true,
        data: { views: 0 },
        message: 'View recording not implemented'
      };
    }
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to record view',
      data: null
    };
  }
}

  // Add review to product
 async addReview(id, review) {
  try {
    const response = await productsAPI.addReview(id, review);
    return {
      success: true,
      data: response.data,
      message: response.data?.message || 'Review added successfully',
      review: response.data?.review || response.data
    };
  } catch (error) {
    console.error('❌ ProductService.addReview error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message || 'Failed to add review',
      data: null,
      review: null
    };
  }
}

  // Get product reviews
  async getReviews(id) {
    try {
      const response = await productsAPI.getReviews(id);
      return {
        success: true,
        data: response.data,
        reviews: response.data?.reviews || response.data || []
      };
    } catch (error) {
      console.error('❌ ProductService.getReviews error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch reviews',
        reviews: [],
        data: null
      };
    }
  }

  // Get related products
  async getRelated(id) {
    try {
      const response = await productsAPI.getRelated(id);
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data?.related || []
      };
    } catch (error) {
      console.error('❌ ProductService.getRelated error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch related products',
        products: [],
        data: null
      };
    }
  }

  // Get featured products
  async getFeatured(limit = 10) {
    try {
      const response = await productsAPI.getFeatured({ limit });
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data?.featured || []
      };
    } catch (error) {
      console.error('❌ ProductService.getFeatured error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch featured products',
        products: [],
        data: null
      };
    }
  }

  // Get popular products
  async getPopular(limit = 10) {
    try {
      const response = await productsAPI.getPopular({ limit });
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data?.popular || []
      };
    } catch (error) {
      console.error('❌ ProductService.getPopular error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch popular products',
        products: [],
        data: null
      };
    }
  }

  // Search products
  async search(query, params = {}) {
    try {
      const response = await productsAPI.search({ q: query, ...params });
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data?.results || [],
        pagination: response.data?.pagination || {}
      };
    } catch (error) {
      console.error('❌ ProductService.search error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to search products',
        products: [],
        data: null
      };
    }
  }

  // Get products by category
  async getByCategory(categoryId, params = {}) {
    try {
      const response = await productsAPI.getByCategory(categoryId, params);
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data || [],
        pagination: response.data?.pagination || {}
      };
    } catch (error) {
      console.error('❌ ProductService.getByCategory error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch category products',
        products: [],
        data: null
      };
    }
  }

  // Get products by tag
  async getByTag(tag, params = {}) {
    try {
      const response = await productsAPI.getByTag(tag, params);
      return {
        success: true,
        data: response.data,
        products: response.data?.products || response.data || [],
        pagination: response.data?.pagination || {}
      };
    } catch (error) {
      console.error('❌ ProductService.getByTag error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch tag products',
        products: [],
        data: null
      };
    }
  }

  // Update product stock
  async updateStock(id, stock) {
    try {
      const response = await productsAPI.updateStock(id, stock);
      return {
        success: true,
        data: response.data,
        message: 'Stock updated successfully'
      };
    } catch (error) {
      console.error('❌ ProductService.updateStock error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update stock',
        data: null
      };
    }
  }

  // Toggle product featured status
  async toggleFeatured(id) {
    try {
      const response = await productsAPI.toggleFeatured(id);
      return {
        success: true,
        data: response.data,
        message: 'Featured status updated'
      };
    } catch (error) {
      console.error('❌ ProductService.toggleFeatured error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update featured status',
        data: null
      };
    }
  }

  // Upload product images
  async uploadImages(id, formData) {
    try {
      const response = await productsAPI.uploadImages(id, formData);
      return {
        success: true,
        data: response.data,
        message: 'Images uploaded successfully',
        images: response.data?.images || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.uploadImages error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to upload images',
        data: null,
        images: []
      };
    }
  }

  // Delete product image
  async deleteImage(id, imageId) {
    try {
      const response = await productsAPI.deleteImage(id, imageId);
      return {
        success: true,
        data: response.data,
        message: 'Image deleted successfully'
      };
    } catch (error) {
      console.error('❌ ProductService.deleteImage error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete image',
        data: null
      };
    }
  }

  // Get product analytics
  async getAnalytics(id) {
    try {
      const response = await productsAPI.getAnalytics(id);
      return {
        success: true,
        data: response.data,
        analytics: response.data?.analytics || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.getAnalytics error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch analytics',
        data: null,
        analytics: {}
      };
    }
  }

  // Bulk operations
  async bulkUpdate(products) {
    try {
      const response = await productsAPI.bulkUpdate(products);
      return {
        success: true,
        data: response.data,
        message: 'Products updated successfully'
      };
    } catch (error) {
      console.error('❌ ProductService.bulkUpdate error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update products',
        data: null
      };
    }
  }

  async bulkDelete(ids) {
    try {
      const response = await productsAPI.bulkDelete(ids);
      return {
        success: true,
        data: response.data,
        message: 'Products deleted successfully'
      };
    } catch (error) {
      console.error('❌ ProductService.bulkDelete error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to delete products',
        data: null
      };
    }
  }

  // Export products
  async exportProducts(format = 'csv', params = {}) {
    try {
      const response = await productsAPI.exportProducts({ format, ...params });
      return {
        success: true,
        data: response.data,
        blob: response.data
      };
    } catch (error) {
      console.error('❌ ProductService.exportProducts error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to export products',
        data: null
      };
    }
  }

  // Import products
  async importProducts(formData) {
    try {
      const response = await productsAPI.importProducts(formData);
      return {
        success: true,
        data: response.data,
        message: 'Products imported successfully',
        stats: response.data?.stats || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.importProducts error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to import products',
        data: null,
        stats: {}
      };
    }
  }

  // Get product statistics
  async getStatistics() {
    try {
      const response = await productsAPI.getStatistics();
      return {
        success: true,
        data: response.data,
        statistics: response.data?.statistics || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.getStatistics error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch statistics',
        data: null,
        statistics: {}
      };
    }
  }

  // Get categories with counts
  async getCategoriesWithCounts() {
    try {
      const response = await productsAPI.getCategoriesWithCounts();
      return {
        success: true,
        data: response.data,
        categories: response.data?.categories || response.data
      };
    } catch (error) {
      console.error('❌ ProductService.getCategoriesWithCounts error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch categories with counts',
        data: null,
        categories: []
      };
    }
  }

  // Helper methods
  calculateDiscount(originalPrice, salePrice) {
    if (!originalPrice || !salePrice || originalPrice <= salePrice) return 0;
    return Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  }

  formatPrice(price) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }

  generateSlug(title) {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  validateProductData(productData) {
    const errors = [];

    if (!productData.name || productData.name.trim().length < 2) {
      errors.push('Product name is required and must be at least 2 characters long');
    }

    if (!productData.price || productData.price < 0) {
      errors.push('Valid price is required');
    }

    if (productData.stock !== undefined && productData.stock < 0) {
      errors.push('Stock cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Create and export singleton instance
const productService = new ProductService();
export default productService;