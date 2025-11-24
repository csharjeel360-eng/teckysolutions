import { cartAPI } from './api';

class CartService {
  // Get cart items
  async getCart() {
    try {
      const response = await cartAPI.getCart();
      // Unwrap nested `data` if server returns { success: true, data: { ...cart } }
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      // If not authenticated, return local cart
      if (error.response?.status === 401) {
        return { success: true, data: this.getLocalCart() };
      }
      console.error('CartService.getCart error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // Add item to cart
  async addToCart(productId, quantity = 1) {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      // If not authenticated, use local storage
      if (error.response?.status === 401) {
        return this.addToLocalCart(productId, quantity);
      }
      console.error('CartService.addToCart error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // Update cart item quantity
  async updateCartItem(productId, quantity) {
    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      // If not authenticated, use local storage
      if (error.response?.status === 401) {
        return this.updateLocalCartItem(productId, quantity);
      }
      console.error('CartService.updateCartItem error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // Remove item from cart
  async removeFromCart(productId) {
    try {
      const response = await cartAPI.removeFromCart(productId);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      // If not authenticated, use local storage
      if (error.response?.status === 401) {
        return this.removeFromLocalCart(productId);
      }
      console.error('CartService.removeFromCart error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // Clear cart
  async clearCart() {
    try {
      const response = await cartAPI.clearCart();
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      // If not authenticated, use local storage
      if (error.response?.status === 401) {
        return this.clearLocalCart();
      }
      console.error('CartService.clearCart error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // ✅ ADDED: Get external products from cart
  async getExternalProducts() {
    try {
      const response = await cartAPI.getExternalProducts();
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      // If not authenticated, filter local cart for external products
      if (error.response?.status === 401) {
        return this.getLocalExternalProducts();
      }
      // Error fetching external products; return handled error without logging to console
      return { success: false, error: this.handleError(error).message };
    }
  }

  // ✅ ADDED: Buy all external products
  async buyAllExternalProducts() {
    try {
      const response = await cartAPI.buyAllExternalProducts();
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.buyAllExternalProducts error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // ✅ ADDED: Buy individual external product
  async buyExternalProduct(productId) {
    try {
      const response = await cartAPI.buyExternalProduct(productId);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.buyExternalProduct error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // ✅ ADDED: Get cart analytics
  async getCartAnalytics() {
    try {
      const response = await cartAPI.getCartAnalytics();
      return { success: true, data: response.data };
    } catch (error) {
      console.error('CartService.getCartAnalytics error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // ✅ ADDED: Save for later operations
  async moveToSaveForLater(productId) {
    try {
      const response = await cartAPI.moveToSaveForLater(productId);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.moveToSaveForLater error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  async getSavedItems() {
    try {
      const response = await cartAPI.getSavedItems();
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.getSavedItems error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  async moveToCart(productId) {
    try {
      const response = await cartAPI.moveToCart(productId);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.moveToCart error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // ✅ ADDED: Cart sharing
  async shareCart(email) {
    try {
      const response = await cartAPI.shareCart(email);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async getSharedCart(shareToken) {
    try {
      const response = await cartAPI.getSharedCart(shareToken);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // ✅ ADDED: Get cart recommendations
  async getRecommendations() {
    try {
      const response = await cartAPI.getRecommendations();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Coupon operations
  async applyCoupon(couponCode) {
    try {
      const response = await cartAPI.applyCoupon(couponCode);
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.applyCoupon error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  async removeCoupon() {
    try {
      const response = await cartAPI.removeCoupon();
      const data = response.data?.data ?? response.data;
      return { success: true, data };
    } catch (error) {
      console.error('CartService.removeCoupon error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // Get cart count
  async getCartCount() {
    try {
      const response = await cartAPI.getCartCount();
      return { success: true, data: response.data };
    } catch (error) {
      // If not authenticated, get count from local cart
      if (error.response?.status === 401) {
        const localCart = this.getLocalCart();
        return {
          success: true,
          data: {
            count: localCart.items.reduce((total, item) => total + item.quantity, 0),
            externalProductsCount: this.getLocalExternalProductsCount(localCart),
            hasExternalProducts: this.getLocalExternalProductsCount(localCart) > 0
          }
        };
      }
      console.error('CartService.getCartCount error', error);
      return { success: false, error: this.handleError(error).message };
    }
  }

  // Local storage cart methods (for unauthenticated users)
  getLocalCart() {
    try {
      const cartStr = localStorage.getItem('cart');
      if (!cartStr) return { items: [], total: 0 };
      const parsed = JSON.parse(cartStr);
      // If an array was stored by a different context, normalize to object shape
      if (Array.isArray(parsed)) {
        const items = parsed;
        const total = items.reduce((sum, it) => {
          const price = Number(it.price) || 0;
          const qty = Number(it.quantity) || 1;
          return sum + price * qty;
        }, 0);
        return { items, total };
      }
      return parsed;
    } catch (error) {
      console.error('Error reading local cart:', error);
      return { items: [], total: 0 };
    }
  }

  // ✅ ADDED: Get external products from local cart
  getLocalExternalProducts() {
    try {
      const cart = this.getLocalCart();
      const externalProducts = cart.items.filter(item => item.productLink);
      
      return {
        data: {
          externalProducts: externalProducts,
          count: externalProducts.length
        }
      };
    } catch (error) {
      console.error('Error getting local external products:', error);
      return { data: { externalProducts: [], count: 0 } };
    }
  }

  // ✅ ADDED: Get external products count from local cart
  getLocalExternalProductsCount(cart = null) {
    try {
      const localCart = cart || this.getLocalCart();
      return localCart.items.filter(item => item.productLink).length;
    } catch (error) {
      console.error('Error counting local external products:', error);
      return 0;
    }
  }

  async addToLocalCart(productId, quantity = 1, productData = null) {
    try {
      const cart = this.getLocalCart();
      const existingItem = cart.items.find(item => item.product._id === productId);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        // Store minimal product info including productLink if available
        const productInfo = {
          _id: productId,
          price: productData?.price || 0,
          title: productData?.title || 'Product',
          productLink: productData?.productLink || null,
          images: productData?.images || []
        };

        cart.items.push({
          product: productInfo,
          quantity,
          productLink: productData?.productLink || null, // Store at item level too
          productTitle: productData?.title || 'Product',
          productImage: productData?.images?.[0]?.url || null
        });
      }

      this.calculateLocalCartTotal(cart);
      this.saveLocalCart(cart);
      
      return {
        success: true,
        message: 'Item added to cart successfully',
        data: cart
      };
    } catch (error) {
      throw new Error('Failed to add item to local cart');
    }
  }

  async updateLocalCartItem(productId, quantity) {
    try {
      const cart = this.getLocalCart();
      const item = cart.items.find(item => item.product._id === productId);

      if (item) {
        if (quantity <= 0) {
          cart.items = cart.items.filter(item => item.product._id !== productId);
        } else {
          item.quantity = quantity;
        }
      }

      this.calculateLocalCartTotal(cart);
      this.saveLocalCart(cart);
      
      return {
        success: true,
        message: 'Cart updated successfully',
        data: cart
      };
    } catch (error) {
      throw new Error('Failed to update local cart item');
    }
  }

  async removeFromLocalCart(productId) {
    try {
      const cart = this.getLocalCart();
      cart.items = cart.items.filter(item => item.product._id !== productId);
      
      this.calculateLocalCartTotal(cart);
      this.saveLocalCart(cart);
      
      return {
        success: true,
        message: 'Item removed from cart successfully',
        data: cart
      };
    } catch (error) {
      throw new Error('Failed to remove item from local cart');
    }
  }

  async clearLocalCart() {
    try {
      const cart = { items: [], total: 0 };
      this.saveLocalCart(cart);
      return {
        success: true,
        message: 'Cart cleared successfully',
        data: cart
      };
    } catch (error) {
      throw new Error('Failed to clear local cart');
    }
  }

  calculateLocalCartTotal(cart) {
    cart.total = cart.items.reduce((total, item) => {
      const price = item.product.price || 0;
      return total + (price * item.quantity);
    }, 0);

    // ✅ ADDED: Include external products info in local cart
    cart.externalProductsCount = this.getLocalExternalProductsCount(cart);
    cart.hasExternalProducts = cart.externalProductsCount > 0;
  }

  saveLocalCart(cart) {
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving local cart:', error);
    }
  }

  // Sync local cart with server when user logs in
  async syncLocalCartWithServer() {
    try {
      const localCart = this.getLocalCart();
      
      if (localCart.items.length > 0) {
        // Add all local cart items to server cart
        for (const item of localCart.items) {
          await cartAPI.addToCart(item.product._id, item.quantity);
        }
        
        // Clear local cart after successful sync
        this.clearLocalCart();
      }
      
      return await this.getCart();
    } catch (error) {
      console.error('Error syncing cart:', error);
      throw this.handleError(error);
    }
  }

  // ✅ ADDED: Enhanced cart analytics for both local and server carts
  calculateCartTotals(cartItems) {
    const subtotal = cartItems.reduce((total, item) => {
      return total + ((item.price || item.product?.price || 0) * item.quantity);
    }, 0);

    const shipping = subtotal > 50 ? 0 : 5.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    // ✅ ADDED: External products analytics
    const externalProducts = cartItems.filter(item => item.productLink || item.product?.productLink);
    const externalProductsTotal = externalProducts.reduce((total, item) => {
      return total + ((item.price || item.product?.price || 0) * item.quantity);
    }, 0);

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: Math.round(shipping * 100) / 100,
      tax: Math.round(tax * 100) / 100,
      total: Math.round(total * 100) / 100,
      externalProductsCount: externalProducts.length,
      externalProductsTotal: Math.round(externalProductsTotal * 100) / 100,
      hasExternalProducts: externalProducts.length > 0
    };
  }

  // ✅ ADDED: Helper method to check if product is external
  isExternalProduct(item) {
    return !!(item.productLink || item.product?.productLink);
  }

  // ✅ ADDED: Helper method to get product link
  getProductLink(item) {
    return item.productLink || item.product?.productLink || null;
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      return new Error(message);
    } else if (error.request) {
      return new Error('Network error. Please check your connection.');
    } else {
      return new Error('An unexpected error occurred.');
    }
  }
}

export default new CartService();