import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, categoriesAPI, bannersAPI } from '../services/api';

const AppContext = createContext();

// Helper function to safely get cart from localStorage
const getInitialCart = () => {
  try {
    const cartData = localStorage.getItem('cart');
    if (cartData) {
      const parsedCart = JSON.parse(cartData);
      return Array.isArray(parsedCart) ? parsedCart : [];
    }
  } catch (error) {
    console.error('Error parsing cart from localStorage:', error);
  }
  return [];
};

const initialState = {
  user: null,
  categories: [],
  banners: [],
  cart: getInitialCart(),
  isLoading: false,
  isAuthenticated: false,
  showLoginPrompt: false, // New state for login prompt
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_BANNERS':
      return { ...state, banners: action.payload };
    case 'SET_CART':
      const newCart = Array.isArray(action.payload) ? action.payload : [];
      localStorage.setItem('cart', JSON.stringify(newCart));
      return { ...state, cart: newCart };
    case 'ADD_TO_CART':
      const itemToAdd = {
        ...action.payload,
        cartId: action.payload.cartId || Date.now() + Math.random(),
        quantity: action.payload.quantity || 1,
        price: Number(action.payload.price) || 0
      };
      
      const updatedCart = [...state.cart, itemToAdd];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
      return { ...state, cart: updatedCart };
    case 'REMOVE_FROM_CART':
      const filteredCart = state.cart.filter(item => item.cartId !== action.payload);
      localStorage.setItem('cart', JSON.stringify(filteredCart));
      return { ...state, cart: filteredCart };
    case 'UPDATE_CART_ITEM':
      const modifiedCart = state.cart.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, ...action.payload.updates }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(modifiedCart));
      return { ...state, cart: modifiedCart };
    case 'CLEAR_CART':
      localStorage.removeItem('cart');
      return { ...state, cart: [] };
    case 'SHOW_LOGIN_PROMPT':
      return { ...state, showLoginPrompt: true };
    case 'HIDE_LOGIN_PROMPT':
      return { ...state, showLoginPrompt: false };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    checkAuth();
    loadInitialData();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await authAPI.getProfile();
        dispatch({ type: 'SET_USER', payload: response.data });
      }
    } catch (error) {
      localStorage.removeItem('token');
    }
  };

  const loadInitialData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const [categoriesRes, bannersRes] = await Promise.all([
        categoriesAPI.getAll(),
        bannersAPI.getAll()
      ]);
      dispatch({ type: 'SET_CATEGORIES', payload: categoriesRes.data });
      dispatch({ type: 'SET_BANNERS', payload: bannersRes.data });
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      localStorage.setItem('token', response.data.token);
      dispatch({ type: 'SET_USER', payload: response.data });
      dispatch({ type: 'HIDE_LOGIN_PROMPT' }); // Hide prompt after login
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    dispatch({ type: 'SET_USER', payload: null });
    // Keep cart items for guest users
  };

  // Add to cart with login check
  const addToCart = (product) => {
    // If user is not authenticated, show login prompt instead of adding to cart
    if (!state.isAuthenticated) {
      dispatch({ type: 'SHOW_LOGIN_PROMPT' });
      return { success: false, requiresLogin: true };
    }

    // If authenticated, add to cart normally
    const cartItem = {
      ...product,
      cartId: product.cartId || Date.now() + Math.random(),
      quantity: product.quantity || 1,
      price: Number(product.price) || 0
    };
    dispatch({ type: 'ADD_TO_CART', payload: cartItem });
    return { success: true };
  };

  const removeFromCart = (cartId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });
  };

  const updateCartItemQuantity = (cartId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartId);
      return;
    }
    dispatch({ 
      type: 'UPDATE_CART_ITEM', 
      payload: { cartId, updates: { quantity } } 
    });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const showLoginPrompt = () => {
    dispatch({ type: 'SHOW_LOGIN_PROMPT' });
  };

  const hideLoginPrompt = () => {
    dispatch({ type: 'HIDE_LOGIN_PROMPT' });
  };

  // Safe cart calculations
  const getCartTotal = () => {
    const safeCart = Array.isArray(state.cart) ? state.cart : [];
    return safeCart.reduce((total, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 1;
      return total + (price * quantity);
    }, 0);
  };

  const getCartItemCount = () => {
    const safeCart = Array.isArray(state.cart) ? state.cart : [];
    return safeCart.reduce((total, item) => total + (Number(item.quantity) || 1), 0);
  };

  const value = {
    // State
    user: state.user,
    categories: state.categories,
    banners: state.banners,
    cart: Array.isArray(state.cart) ? state.cart : [],
    isLoading: state.isLoading,
    isAuthenticated: state.isAuthenticated,
    showLoginPrompt: state.showLoginPrompt,
    
    // Actions
    dispatch,
    login,
    logout,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    loadInitialData,
    openLoginPrompt: showLoginPrompt,
    closeLoginPrompt: hideLoginPrompt,
    
    // Computed values
    getCartTotal,
    getCartItemCount,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
