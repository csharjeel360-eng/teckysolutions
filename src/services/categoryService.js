// services/categoryService.js
import { categoriesAPI } from './api';

class CategoryService {
  // Get all categories
  async getAll() {
    try {
      const response = await categoriesAPI.getAll();
      return response;
    } catch (error) {
      console.error('❌ CategoryService.getAll error:', error);
      throw this.handleError(error);
    }
  }

  // Get category by ID
  async getById(id) {
    try {
      const response = await categoriesAPI.getById(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new category
  async create(categoryData) {
    try {
      const response = await categoriesAPI.create(categoryData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update category
  async update(id, categoryData) {
    try {
      const response = await categoriesAPI.update(id, categoryData);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete category
  async delete(id) {
    try {
      const response = await categoriesAPI.delete(id);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get featured categories
  async getFeatured(limit = 6) {
    try {
      const response = await categoriesAPI.getAll();
      const categories = response.data || [];
      return {
        data: categories.slice(0, limit),
        success: true
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get categories with product counts
  async getWithProductCounts() {
    try {
      const response = await categoriesAPI.getAll();
      const categories = response.data || [];
      
      // Add mock product counts (you would get this from your API)
      const categoriesWithCounts = categories.map(category => ({
        ...category,
        productCount: Math.floor(Math.random() * 100) + 10 // Mock data
      }));
      
      return {
        data: categoriesWithCounts,
        success: true
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search categories
  async search(query) {
    try {
      const response = await categoriesAPI.getAll();
      const categories = response.data || [];
      
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(query.toLowerCase()) ||
        category.description?.toLowerCase().includes(query.toLowerCase())
      );
      
      return {
        data: filtered,
        success: true
      };
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    console.error('🔥 CategoryService error:', error);
    
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      const customError = new Error(message);
      customError.status = error.response.status;
      customError.data = error.response.data;
      throw customError;
    } else if (error.request) {
      throw new Error('Network error. Please check your connection.');
    } else {
      throw new Error('An unexpected error occurred.');
    }
  }

  // Validate category data
  validateCategory(categoryData) {
    const errors = {};

    if (!categoryData.name || categoryData.name.trim().length === 0) {
      errors.name = 'Category name is required';
    } else if (categoryData.name.trim().length < 2) {
      errors.name = 'Category name must be at least 2 characters long';
    }

    if (categoryData.description && categoryData.description.length > 500) {
      errors.description = 'Description must be less than 500 characters';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  // Generate default category data
  generateDefaultCategory() {
    return {
      name: 'New Category',
      description: '',
      image: '',
      isActive: true,
      order: 0
    };
  }

  // Format category for display
  formatCategoryForDisplay(category) {
    if (!category) return null;
    
    return {
      ...category,
      displayName: category.name,
      statusText: category.isActive ? 'Active' : 'Inactive',
      statusColor: category.isActive ? 'green' : 'red'
    };
  }
}

// Create and export singleton instance
const categoryService = new CategoryService();
export default categoryService;