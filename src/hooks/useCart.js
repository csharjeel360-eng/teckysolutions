// hooks/useCart.js
import { useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import CartService from '../services/CartService';

// ✅ ADDED: Helper function to normalize cart data
const normalizeCartData = (cartData) => {
  if (!cartData) return null;
  return {
    ...cartData,
    items: (cartData.items || []).map(item => ({
      ...item,
      // Ensure product is always an object with at least an _id
      product: typeof item.product === 'object' ? item.product : { _id: item.product }
    }))
  };
};

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [externalProducts, setExternalProducts] = useState([]);

  // Fetch cart from backend
  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CartService.getCart();
      
      if (response.success) {
        // ✅ ADDED: Normalize cart items to ensure product is always an object
        const normalizedCart = normalizeCartData(response.data);
        setCart(normalizedCart);
        // Notify other parts of the app about cart changes
        try {
          const itemsCount = (normalizedCart.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemsCount } }));
        } catch (err) {
          console.warn('Failed to dispatch cartUpdated event', err);
        }
        setError(null);
        
        // ✅ ADDED: Extract external products from cart
        const externalItems = normalizedCart.items?.filter(item => 
          CartService.isExternalProduct(item)
        ) || [];
        setExternalProducts(externalItems);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cart');
      // Suppress noisy console.error here; errors are surfaced via `error` state
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ADDED: Fetch external products specifically
  const fetchExternalProducts = useCallback(async () => {
    try {
      const response = await CartService.getExternalProducts();
      if (response.success) {
        setExternalProducts(response.data.externalProducts || []);
      }
    } catch (err) {
      console.error('Fetch external products error:', err);
    }
  }, []);

  // Load cart on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchCart();
    } else {
      // If there's no auth token, use local cart to avoid triggering a backend 401 network error
      try {
        const local = CartService.getLocalCart();
        const normalized = normalizeCartData(local);
        setCart(normalized || { items: [], total: 0 });
        // Also set external products from local cart
        const externalItems = (normalized?.items || []).filter(item => CartService.isExternalProduct(item));
        setExternalProducts(externalItems);
      } catch (e) {
        // ignore local cart read errors silently
      }
    }
  }, [fetchCart]);

  const addToCart = useCallback(async (product, quantity = 1) => {
    try {
      // Don't set loading here - ProductDetail component handles with isAddingToCart state
      const response = await CartService.addToCart(product._id, quantity);
      
      if (response.success) {
        // ✅ ADDED: Normalize cart data
        const normalizedCart = normalizeCartData(response.data);
        setCart(normalizedCart);
        try {
          const itemsCount = (normalizedCart.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemsCount } }));
        } catch (err) {
          console.warn('Failed to dispatch cartUpdated event', err);
        }
        setError(null);
        
        // ✅ ADDED: Update external products if added product is external
        if (product.productLink) {
          await fetchExternalProducts();
        }
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to add to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchExternalProducts]);

  const updateQuantity = useCallback(async (productId, quantity) => {
    try {
      // Don't set loading here - keep UI responsive during quantity updates
      const response = await CartService.updateCartItem(productId, quantity);
      
      if (response.success) {
        // ✅ ADDED: Normalize cart data
        const normalizedCart = normalizeCartData(response.data);
        setCart(normalizedCart);
        try {
          const itemsCount = (normalizedCart.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemsCount } }));
        } catch (err) {
          console.warn('Failed to dispatch cartUpdated event', err);
        }
        setError(null);
        
        // ✅ ADDED: Update external products if quantity changed for external product
        const updatedItem = normalizedCart.items?.find(item => 
          item.product?._id === productId || item.product === productId
        );
        if (updatedItem && CartService.isExternalProduct(updatedItem)) {
          await fetchExternalProducts();
        }
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to update quantity';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [fetchExternalProducts]);

  const removeFromCart = useCallback(async (productId) => {
    try {
      // Don't set loading here - keep UI responsive during item removal
      
      // ✅ ADDED: Check if product is external before removal
      const itemToRemove = cart?.items?.find(item => 
        item.product?._id === productId || item.product === productId
      );
      const wasExternal = itemToRemove && CartService.isExternalProduct(itemToRemove);
      
      const response = await CartService.removeFromCart(productId);
      
      if (response.success) {
        // ✅ ADDED: Normalize cart data
        const normalizedCart = normalizeCartData(response.data);
        setCart(normalizedCart);
        try {
          const itemsCount = (normalizedCart.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemsCount } }));
        } catch (err) {
          console.warn('Failed to dispatch cartUpdated event', err);
        }
        setError(null);
        
        // ✅ ADDED: Update external products if removed product was external
        if (wasExternal) {
          await fetchExternalProducts();
        }
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove from cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [cart, fetchExternalProducts]);

  const clearCart = useCallback(async () => {
    try {
      // Don't set loading here - keep UI responsive during cart clearing
      const response = await CartService.clearCart();
      
      if (response.success) {
          setCart(response.data);
          try {
            const itemsCount = (response.data?.items || []).reduce((total, item) => total + (item.quantity || 0), 0);
            window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { itemsCount } }));
          } catch (err) {
            console.warn('Failed to dispatch cartUpdated event', err);
          }
        setExternalProducts([]);
        setError(null);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to clear cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // ✅ ADDED: Buy all external products
  const buyAllExternalProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CartService.buyAllExternalProducts();
      
      if (response.success) {
        // Refresh cart to get updated state
        await fetchCart();
      }
      return response;
    } catch (err) {
      // Don't set error for external product operations - just log it
      console.warn('Failed to record external product purchase:', err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // ✅ ADDED: Buy individual external product
  const buyExternalProduct = useCallback(async (productId) => {
    try {
      setLoading(true);
      const response = await CartService.buyExternalProduct(productId);
      
      if (response.success) {
        // Refresh cart to get updated state
        await fetchCart();
      }
      return response;
    } catch (err) {
      // Don't set error for external product operations - just log it
      console.warn('Failed to record external product purchase:', err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, [fetchCart]);

  // ✅ ADDED: Save for later functionality
  const moveToSaveForLater = useCallback(async (productId) => {
    try {
      setLoading(true);
      const response = await CartService.moveToSaveForLater(productId);
      
      if (response.success) {
        setCart(response.data);
        await fetchExternalProducts();
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to save item for later';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchExternalProducts]);

  // ✅ ADDED: Get saved items
  const getSavedItems = useCallback(async () => {
    try {
      const response = await CartService.getSavedItems();
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get saved items';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // ✅ ADDED: Move saved item back to cart
  const moveToCart = useCallback(async (productId) => {
    try {
      setLoading(true);
      const response = await CartService.moveToCart(productId);
      
      if (response.success) {
        setCart(response.data);
        await fetchExternalProducts();
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to move item to cart';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchExternalProducts]);

  // ✅ ADDED: Apply coupon
  const applyCoupon = useCallback(async (couponCode) => {
    try {
      setLoading(true);
      const response = await CartService.applyCoupon(couponCode);
      
      if (response.success) {
        setCart(response.data);
        setError(null);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to apply coupon';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ADDED: Remove coupon
  const removeCoupon = useCallback(async () => {
    try {
      setLoading(true);
      const response = await CartService.removeCoupon();
      
      if (response.success) {
        setCart(response.data);
        setError(null);
      }
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to remove coupon';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ ADDED: Get cart analytics
  const getCartAnalytics = useCallback(async () => {
    try {
      const response = await CartService.getCartAnalytics();
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get cart analytics';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // ✅ ADDED: Get cart recommendations
  const getRecommendations = useCallback(async () => {
    try {
      const response = await CartService.getRecommendations();
      return response;
    } catch (err) {
      const errorMessage = err.message || 'Failed to get recommendations';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, []);

  // Helper functions
  const getCartItemsCount = useCallback(() => {
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const getCartTotal = useCallback(() => {
    if (!cart) return { subtotal: 0, tax: 0, shipping: 0, total: 0 };
    
    return {
      subtotal: cart.subtotal || 0,
      tax: cart.tax || 0,
      shipping: cart.shipping || 0,
      total: cart.total || 0,
      // ✅ ADDED: Include external products info
      externalProductsCount: cart.externalProductsCount || externalProducts.length,
      hasExternalProducts: cart.hasExternalProducts || externalProducts.length > 0
    };
  }, [cart, externalProducts]);

  // ✅ ADDED: Check if item is external
  const isExternalProduct = useCallback((item) => {
    return CartService.isExternalProduct(item);
  }, []);

  // ✅ ADDED: Get product link
  const getProductLink = useCallback((item) => {
    return CartService.getProductLink(item);
  }, []);

  // ✅ ADDED: Calculate enhanced cart totals
  const calculateEnhancedTotals = useCallback(() => {
    if (!cart?.items) return CartService.calculateCartTotals([]);
    return CartService.calculateCartTotals(cart.items);
  }, [cart]);

  return {
    // State
    cart,
    cartItems: cart?.items || [],
    externalProducts,
    loading,
    error,
    
    // Cart totals and counts
    total: getCartTotal(),
    itemsCount: getCartItemsCount(),
    externalProductsCount: externalProducts.length,
    hasExternalProducts: externalProducts.length > 0,
    
    // Basic cart actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart: fetchCart,
    
    // ✅ ADDED: External products actions
    buyAllExternalProducts,
    buyExternalProduct,
    
    // ✅ ADDED: Enhanced cart features
    moveToSaveForLater,
    getSavedItems,
    moveToCart,
    applyCoupon,
    removeCoupon,
    getCartAnalytics,
    getRecommendations,
    
    // ✅ ADDED: Helper functions
    isExternalProduct,
    getProductLink,
    calculateEnhancedTotals,
    
    // ✅ ADDED: Refresh external products
    refreshExternalProducts: fetchExternalProducts
  };
};

export default useCart;