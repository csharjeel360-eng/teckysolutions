import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useNotification } from '../../hooks/useNotification';
import { formatCurrency } from '../../utils/helpers';

const CartContext = createContext();

const initialState = {
  items: [],
  total: 0,
  itemCount: 0,
  isLoading: false,
};

// Load cart from localStorage
const loadCartFromStorage = () => {
  if (typeof window === 'undefined') return [];
  
  try {
    const savedCart = localStorage.getItem('temu-clone-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  } catch (error) {
    console.error('Error loading cart from storage:', error);
    return [];
  }
};

// Save cart to localStorage
const saveCartToStorage = (items) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('temu-clone-cart', JSON.stringify(items));
  } catch (error) {
    console.error('Error saving cart to storage:', error);
  }
};

function cartReducer(state, action) {
  let newItems;

  switch (action.type) {
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        total: calculateTotal(action.payload),
        itemCount: calculateItemCount(action.payload),
      };

    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item._id === action.payload._id && 
        JSON.stringify(item.selectedOptions) === JSON.stringify(action.payload.selectedOptions)
      );

      if (existingItemIndex > -1) {
        // Update quantity if item already exists
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + (action.payload.quantity || 1) }
            : item
        );
      } else {
        // Add new item
        const newItem = {
          ...action.payload,
          cartId: Date.now().toString(),
          quantity: action.payload.quantity || 1,
          addedAt: new Date().toISOString(),
          selectedOptions: action.payload.selectedOptions || {},
        };
        newItems = [...state.items, newItem];
      }

      saveCartToStorage(newItems);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };

    case 'UPDATE_QUANTITY':
      newItems = state.items.map(item =>
        item.cartId === action.payload.cartId
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0); // Remove items with quantity 0

      saveCartToStorage(newItems);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };

    case 'REMOVE_FROM_CART':
      newItems = state.items.filter(item => item.cartId !== action.payload);
      saveCartToStorage(newItems);
      return {
        ...state,
        items: newItems,
        total: calculateTotal(newItems),
        itemCount: calculateItemCount(newItems),
      };

    case 'CLEAR_CART':
      saveCartToStorage([]);
      return {
        ...state,
        items: [],
        total: 0,
        itemCount: 0,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Helper functions
const calculateTotal = (items) => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
};

const calculateItemCount = (items) => {
  return items.reduce((count, item) => count + item.quantity, 0);
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { addNotification } = useNotification();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    dispatch({ type: 'LOAD_CART', payload: savedCart });
  }, []);

  const addToCart = (product, quantity = 1, selectedOptions = {}) => {
    try {
      dispatch({
        type: 'ADD_TO_CART',
        payload: {
          ...product,
          quantity,
          selectedOptions,
        },
      });

      addNotification({
        type: 'success',
        title: 'Added to Cart',
        message: `${product.title} has been added to your cart.`,
        duration: 3000,
      });

      return { success: true };
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to add item to cart. Please try again.',
        duration: 5000,
      });
      return { success: false, error: error.message };
    }
  };

  const updateQuantity = (cartId, quantity) => {
    if (quantity < 1) {
      removeFromCart(cartId);
      return;
    }

    dispatch({
      type: 'UPDATE_QUANTITY',
      payload: { cartId, quantity },
    });
  };

  const removeFromCart = (cartId) => {
    const item = state.items.find(item => item.cartId === cartId);
    
    dispatch({ type: 'REMOVE_FROM_CART', payload: cartId });

    if (item) {
      addNotification({
        type: 'info',
        title: 'Removed from Cart',
        message: `${item.title} has been removed from your cart.`,
        duration: 3000,
      });
    }
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    addNotification({
      type: 'info',
      title: 'Cart Cleared',
      message: 'All items have been removed from your cart.',
      duration: 3000,
    });
  };

  const getCartItem = (cartId) => {
    return state.items.find(item => item.cartId === cartId);
  };

  const getItemCount = () => {
    return state.itemCount;
  };

  const getTotalPrice = () => {
    return state.total;
  };

  const getFormattedTotal = () => {
    return formatCurrency(state.total);
  };

  const getShippingCost = () => {
    return state.total >= 50 ? 0 : 9.99;
  };

  const getTaxAmount = () => {
    return state.total * 0.08; // 8% tax
  };

  const getGrandTotal = () => {
    return state.total + getShippingCost() + getTaxAmount();
  };

  const getFormattedGrandTotal = () => {
    return formatCurrency(getGrandTotal());
  };

  const isCartEmpty = () => {
    return state.items.length === 0;
  };

  const getCartSummary = () => {
    return {
      subtotal: state.total,
      shipping: getShippingCost(),
      tax: getTaxAmount(),
      total: getGrandTotal(),
      itemCount: state.itemCount,
      formattedSubtotal: formatCurrency(state.total),
      formattedShipping: getShippingCost() === 0 ? 'FREE' : formatCurrency(getShippingCost()),
      formattedTax: formatCurrency(getTaxAmount()),
      formattedTotal: getFormattedGrandTotal(),
    };
  };

  const value = {
    // State
    items: state.items,
    total: state.total,
    itemCount: state.itemCount,
    isLoading: state.isLoading,

    // Actions
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartItem,

    // Getters
    getItemCount,
    getTotalPrice,
    getFormattedTotal,
    getShippingCost,
    getTaxAmount,
    getGrandTotal,
    getFormattedGrandTotal,
    isCartEmpty,
    getCartSummary,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;