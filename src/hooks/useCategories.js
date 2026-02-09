import { useState, useEffect, useCallback } from 'react';
import { categoriesAPI } from '../services/api';

// Global cache that persists across component mounts/unmounts
const globalCategoryCache = { data: null, timestamp: 0 };
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes cache lifespan for categories (rarely change)

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const fetchCategories = useCallback(async () => {
    try {
      // Check global cache first
      if (globalCategoryCache.data && Date.now() - globalCategoryCache.timestamp < CACHE_TTL) {
        setCategories(globalCategoryCache.data);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      const response = await categoriesAPI.getAll();
      const data = response.data || [];
      
      // Cache in global cache
      globalCategoryCache.data = data;
      globalCategoryCache.timestamp = Date.now();
      
      setCategories(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const getCategoryById = useCallback((categoryId) => {
    return categories.find(category => category._id === categoryId);
  }, [categories]);

  const getCategoryByName = useCallback((categoryName) => {
    return categories.find(category => 
      category.name.toLowerCase() === categoryName.toLowerCase()
    );
  }, [categories]);

  const createCategory = useCallback(async (categoryData) => {
    try {
      setLoading(true);
      const response = await categoriesAPI.create(categoryData);
      setCategories(prev => [...prev, response.data]);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create category';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (categoryId, categoryData) => {
    try {
      setLoading(true);
      const response = await categoriesAPI.update(categoryId, categoryData);
      setCategories(prev => prev.map(category => 
        category._id === categoryId ? response.data : category
      ));
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update category';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId) => {
    try {
      setLoading(true);
      await categoriesAPI.delete(categoryId);
      setCategories(prev => prev.filter(category => category._id !== categoryId));
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete category';
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const selectCategory = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  const getCategoryProductsCount = useCallback((categoryId) => {
    // This would typically come from the API
    // For now, return a mock count
    return Math.floor(Math.random() * 100) + 10;
  }, []);

  const getPopularCategories = useCallback((limit = 6) => {
    return categories
      .sort(() => Math.random() - 0.5) // Randomize for demo
      .slice(0, limit);
  }, [categories]);

  return {
    // State
    categories,
    loading,
    error,
    selectedCategory,
    
    // Actions
    fetchCategories,
    getCategoryById,
    getCategoryByName,
    createCategory,
    updateCategory,
    deleteCategory,
    selectCategory,
    clearSelectedCategory,
    getCategoryProductsCount,
    getPopularCategories,
  };
};

export default useCategories;