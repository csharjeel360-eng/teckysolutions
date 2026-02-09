// hooks/useProducts.js
import { useState, useEffect, useCallback, useRef } from 'react';
import productService from '../services/productService';
import { debounce } from '../utils/helpers';

// Global cache that persists across component mounts/unmounts
const globalProductCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes cache lifespan

export const useProducts = (initialFilters = {}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true); // Track first load
  const previousDataRef = useRef([]); // Keep previous data to prevent flickering
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 12,
    search: '',
    category: '',
    sort: 'createdAt',
    minPrice: 0,
    maxPrice: 1000,
    rating: 0,
    featured: false,
    ...initialFilters
  });
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0,
    hasNext: false,
    hasPrev: false
  });

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchTerm) => {
      setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }));
    }, 500),
    []
  );

  const fetchProducts = useCallback(async (customFilters = {}) => {
    try {
      const mergedFilters = { ...filters, ...customFilters };
      const cacheKey = JSON.stringify(mergedFilters);
      
      // Check global cache first
      const cached = globalProductCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL && !customFilters.page) {
        // Use cache if fresh and not doing pagination
        setProducts(cached.products);
        setPagination(cached.pagination);
        setLoading(false);
        if (isInitialLoad) {
          setIsInitialLoad(false);
        }
        return;
      }
      
      // Only show loading spinner on initial load; for updates, keep showing previous data
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      
      const params = {
        pageNumber: mergedFilters.page,
        pageSize: mergedFilters.pageSize,
        keyword: mergedFilters.search,
        category: mergedFilters.category,
        sort: mergedFilters.sort,
        minPrice: mergedFilters.minPrice,
        maxPrice: mergedFilters.maxPrice,
        rating: mergedFilters.rating,
        featured: mergedFilters.featured,
      };

      // Remove empty values
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      let result;
      if (mergedFilters.category) {
        const categoryParams = { ...params };
        // Remove category from query params when using category-specific endpoint
        delete categoryParams.category;
        result = await productService.getByCategory(mergedFilters.category, categoryParams);
      } else {
        result = await productService.getAll(params);
      }
      
      if (result.success) {
        const paginationData = {
          page: result.pagination.page || result.pagination.currentPage || 1,
          pages: result.pagination.pages || result.pagination.totalPages || 1,
          total: result.pagination.total || result.pagination.totalCount || result.products.length,
          hasNext: (result.pagination.page || 1) < (result.pagination.pages || 1),
          hasPrev: (result.pagination.page || 1) > 1
        };
        
        setProducts(result.products);
        previousDataRef.current = result.products; // Save for flickering prevention
        setPagination(paginationData);
        
        // Cache the result in global cache
        globalProductCache.set(cacheKey, {
          products: result.products,
          pagination: paginationData,
          timestamp: Date.now()
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      // Keep showing previous data on error instead of clearing
      if (previousDataRef.current.length === 0) {
        setProducts([]);
      }
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  }, [filters, isInitialLoad]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const updateFilters = useCallback((newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const setSearch = useCallback((searchTerm) => {
    debouncedSearch(searchTerm);
  }, [debouncedSearch]);

  const setCategory = useCallback((categoryId) => {
    setFilters(prev => ({ ...prev, category: categoryId, page: 1 }));
  }, []);

  const setSort = useCallback((sortBy) => {
    setFilters(prev => ({ ...prev, sort: sortBy, page: 1 }));
  }, []);

  const setPriceRange = useCallback(([minPrice, maxPrice]) => {
    setFilters(prev => ({ ...prev, minPrice, maxPrice, page: 1 }));
  }, []);

  const setRating = useCallback((rating) => {
    setFilters(prev => ({ ...prev, rating, page: 1 }));
  }, []);

  const setFeatured = useCallback((featured) => {
    setFilters(prev => ({ ...prev, featured, page: 1 }));
  }, []);

  const goToPage = useCallback((page) => {
    setFilters(prev => ({ ...prev, page }));
  }, []);

  const nextPage = useCallback(() => {
    if (pagination.hasNext) {
      setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }
  }, [pagination.hasNext]);

  const prevPage = useCallback(() => {
    if (pagination.hasPrev) {
      setFilters(prev => ({ ...prev, page: prev.page - 1 }));
    }
  }, [pagination.hasPrev]);

  const clearFilters = useCallback(() => {
    setFilters({
      page: 1,
      pageSize: 12,
      search: '',
      category: '',
      sort: 'createdAt',
      minPrice: 0,
      maxPrice: 1000,
      rating: 0,
      featured: false,
      ...initialFilters
    });
  }, [initialFilters]);

  const getProductById = useCallback(async (productId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await productService.getById(productId);
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to fetch product';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const recordBuyClick = useCallback(async (productId) => {
    try {
      const result = await productService.recordBuyClick(productId);
      return result;
    } catch (error) {
      console.error('Failed to record buy click:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const recordView = useCallback(async (productId) => {
    try {
      const result = await productService.recordView(productId);
      return result;
    } catch (error) {
      console.error('Failed to record view:', error);
      return { success: false, error: error.message };
    }
  }, []);

  const addReview = useCallback(async (productId, reviewData) => {
    try {
      // Don't set loading here - ProductDetail component handles with isSubmittingReview state
      const result = await productService.addReview(productId, reviewData);
      
      if (result.success) {
        // Update local state if the reviewed product is in the current list
        setProducts(prev => prev.map(product => 
          product._id === productId 
            ? { 
                ...product, 
                reviews: [...(product.reviews || []), result.review],
                averageRating: result.data.averageRating || calculateNewRating(product.reviews || [], reviewData.rating)
              }
            : product
        ));
      }
      
      return result;
    } catch (error) {
      const errorMessage = error.message || 'Failed to add review';
      console.error('Error adding review:', error);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Helper function to calculate new average rating
  const calculateNewRating = (reviews, newRating) => {
    if (!reviews || reviews.length === 0) return newRating;
    const allRatings = [...reviews.map(r => r.rating), newRating];
    const average = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
    return Math.round(average * 10) / 10;
  };

  // CRUD Actions
  const createProduct = useCallback(async (formData) => {
    try {
      setLoading(true);
      const result = await productService.create(formData);
      if (result.success) {
        setProducts(prev => [result.data, ...prev]);
      }
      return result;
    } catch (error) {
      const msg = error.message || 'Failed to create product';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id, formData) => {
    try {
      setLoading(true);
      const result = await productService.update(id, formData);
      if (result.success) {
        setProducts(prev => prev.map(p => p._id === id ? result.data : p));
      }
      return result;
    } catch (error) {
      const msg = error.message || 'Failed to update product';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id) => {
    try {
      setLoading(true);
      const result = await productService.delete(id);
      if (result.success) {
        setProducts(prev => prev.filter(p => p._id !== id));
      }
      return result;
    } catch (error) {
      const msg = error.message || 'Failed to delete product';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    products,
    loading,
    isInitialLoad,
    error,
    filters,
    pagination,
    
    // Actions
    fetchProducts,
    updateFilters,
    setSearch,
    setCategory,
    setSort,
    setPriceRange,
    setRating,
    setFeatured,
    goToPage,
    nextPage,
    prevPage,
    clearFilters,
    getProductById,
    recordBuyClick,
    recordView,
    addReview,
    
    // CRUD Actions
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;