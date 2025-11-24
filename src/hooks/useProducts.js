// hooks/useProducts.js
import { useState, useEffect, useCallback } from 'react';
import productService from '../services/productService';
import { debounce } from '../utils/helpers';

export const useProducts = (initialFilters = {}) => {
    // CRUD actions
    const createProduct = async (formData) => {
      setLoading(true);
      try {
        const result = await productService.create(formData);
        return result;
      } catch (error) {
        setError(error.message || 'Failed to create product');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    };

    const updateProduct = async (id, formData) => {
      setLoading(true);
      try {
        const result = await productService.update(id, formData);
        return result;
      } catch (error) {
        setError(error.message || 'Failed to update product');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    };

    const deleteProduct = async (id) => {
      setLoading(true);
      try {
        const result = await productService.delete(id);
        return result;
      } catch (error) {
        setError(error.message || 'Failed to delete product');
        return { success: false, error: error.message };
      } finally {
        setLoading(false);
      }
    };
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...customFilters };
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

      const result = await productService.getAll(params);
      
      if (result.success) {
        setProducts(result.products);
        
        setPagination({
          page: result.pagination.page || result.pagination.currentPage || 1,
          pages: result.pagination.pages || result.pagination.totalPages || 1,
          total: result.pagination.total || result.pagination.totalCount || result.products.length,
          hasNext: (result.pagination.page || 1) < (result.pagination.pages || 1),
          hasPrev: (result.pagination.page || 1) > 1
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

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
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, []);

  // Helper function to calculate new average rating
  const calculateNewRating = (reviews, newRating) => {
    if (!reviews || reviews.length === 0) return newRating;
    const allRatings = [...reviews.map(r => r.rating), newRating];
    const average = allRatings.reduce((sum, rating) => sum + rating, 0) / allRatings.length;
    return Math.round(average * 10) / 10;
  };

  return {
    // State
    products,
    loading,
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
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export default useProducts;