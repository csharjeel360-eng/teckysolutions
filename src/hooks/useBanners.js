// hooks/useBanners.js
import { useState, useEffect, useCallback } from 'react';
import bannerService from '../services/bannerService';

// Global cache that persists across component mounts/unmounts
const globalBannerCache = { data: null, timestamp: 0 };
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache lifespan for banners

const useBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentBanner, setCurrentBanner] = useState(null);

  // Load all banners
  const loadBanners = useCallback(async () => {
    try {
      // Check global cache first
      if (globalBannerCache.data && Date.now() - globalBannerCache.timestamp < CACHE_TTL) {
        setBanners(globalBannerCache.data);
        return globalBannerCache.data;
      }
      
      setLoading(true);
      setError(null);
      // Loading banners from API
      const bannersData = await bannerService.getBanners();
      
      // Cache the result
      globalBannerCache.data = bannersData || [];
      globalBannerCache.timestamp = Date.now();
      
      setBanners(bannersData || []);
      return bannersData || [];
    } catch (err) {
      console.error('❌ Error loading banners:', err);
      const errorMessage = err.message || 'Failed to load banners';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Get banners by position - SIMPLIFIED VERSION
  const getBannersByPosition = useCallback((position) => {
    const filtered = banners.filter(banner => 
      banner.isActive && banner.position === position
    );
    return filtered;
  }, [banners]);

  // Get banner by ID
  const getBannerById = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      const bannerData = await bannerService.getBannerById(id);
      setCurrentBanner(bannerData);
      return bannerData;
    } catch (err) {
      const errorMessage = err.message || 'Failed to load banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Create new banner
  const createBanner = useCallback(async (bannerData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newBanner = await bannerService.createBanner(bannerData);
      setBanners(prev => [...prev, newBanner]);
      return newBanner;
    } catch (err) {
      const errorMessage = err.message || 'Failed to create banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // Update banner
  const updateBanner = useCallback(async (id, bannerData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedBanner = await bannerService.updateBanner(id, bannerData);
      
      setBanners(prev => prev.map(banner => 
        banner._id === id ? updatedBanner : banner
      ));
      
      if (currentBanner && currentBanner._id === id) {
        setCurrentBanner(updatedBanner);
      }
      
      return updatedBanner;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentBanner]);

  // Delete banner
  const deleteBanner = useCallback(async (id) => {
    try {
      setLoading(true);
      setError(null);
      await bannerService.deleteBanner(id);
      
      setBanners(prev => prev.filter(banner => banner._id !== id));
      
      if (currentBanner && currentBanner._id === id) {
        setCurrentBanner(null);
      }
      
      return true;
    } catch (err) {
      const errorMessage = err.message || 'Failed to delete banner';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [currentBanner]);

  // Get active banners
  const getActiveBanners = useCallback(() => {
    return banners.filter(banner => banner.isActive);
  }, [banners]);

  // Get homepage banners
  const getHomepageBanners = useCallback(() => {
    return banners.filter(banner => 
      banner.isActive && banner.position && banner.position.startsWith('home-')
    );
  }, [banners]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Clear current banner
  const clearCurrentBanner = useCallback(() => {
    setCurrentBanner(null);
  }, []);

  // Reset state
  const reset = useCallback(() => {
    setBanners([]);
    setLoading(false);
    setError(null);
    setCurrentBanner(null);
  }, []);

  // Refresh banners
  const refetch = useCallback(() => {
    return loadBanners();
  }, [loadBanners]);

  // Load banners on mount
  useEffect(() => {
    loadBanners();
  }, [loadBanners]);

  return {
    // State
    banners,
    loading,
    error,
    currentBanner,
    
    // CRUD Actions
    loadBanners,
    getBannerById,
    createBanner,
    updateBanner,
    deleteBanner,
    refetch,
    
    // Selectors
    getBannersByPosition,
    getActiveBanners,
    getHomepageBanners,
    
    // Utilities
    clearError,
    clearCurrentBanner,
    reset,
    
    // Computed values
    hasBanners: banners.length > 0,
    activeBannersCount: getActiveBanners().length,
    homepageBannersCount: getHomepageBanners().length,
  };
};

export default useBanners;