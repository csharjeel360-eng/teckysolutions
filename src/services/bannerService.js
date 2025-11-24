// services/bannerService.js
import { bannersAPI } from './api';

class BannerService {
  // Get all banners
  async getBanners() {
    try {
      const response = await bannersAPI.getAll();
      return response.data;
    } catch (error) {
      console.error('❌ BannerService.getBanners error:', error);
      throw this.handleError(error);
    }
  }

  // Get banner by ID
  async getBannerById(id) {
    try {
      const response = await bannersAPI.getById(id);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get banners by position
  async getBannersByPosition(position) {
    try {
      const response = await bannersAPI.getByPosition(position);
      return response.data;
    } catch (error) {
      console.error('❌ BannerService.getBannersByPosition error:', error);
      throw this.handleError(error);
    }
  }

  // Get homepage banners
  async getHomepageBanners() {
    try {
      const response = await bannersAPI.getHomepage();
      return response.data;
    } catch (error) {
      console.error('❌ BannerService.getHomepageBanners error:', error);
      throw this.handleError(error);
    }
  }

  // Create new banner
  async createBanner(bannerData) {
    try {
      const response = await bannersAPI.create(bannerData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update banner
  async updateBanner(id, bannerData) {
    try {
      const response = await bannersAPI.update(id, bannerData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete banner
  async deleteBanner(id) {
    try {
      const response = await bannersAPI.delete(id);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Toggle banner status
  async toggleBannerStatus(id) {
    try {
      const response = await bannersAPI.toggle(id);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    console.error('🔥 BannerService error:', error);
    
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

  // Get banner position options
  getPositionOptions() {
    return [
      { value: 'home-top', label: 'Homepage Top' },
      { value: 'home-middle', label: 'Homepage Middle' },
      { value: 'home-bottom', label: 'Homepage Bottom' },
      { value: 'category-top', label: 'Category Page Top' },
      { value: 'promo-sidebar', label: 'Promo Sidebar' }
    ];
  }
}

export default new BannerService();