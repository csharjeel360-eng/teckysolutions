import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { Trash2, Plus, Minus, ExternalLink, ShoppingBag, ArrowLeft } from 'lucide-react';

const Cart = () => {
  const { 
    cartItems, 
    externalProducts,
    updateQuantity, 
    removeFromCart, 
    buyExternalProduct,
    buyAllExternalProducts,
    isExternalProduct,
    getProductLink,
    loading, 
    error,
    refreshCart,
    externalProductsCount,
    hasExternalProducts
  } = useCart();

  const handleBuyNow = async (item) => {
    try {
      await buyExternalProduct(item.product._id);
      const productLink = getProductLink(item);
      if (productLink) {
        window.open(productLink, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      console.error('Failed to process external product purchase:', err);
      const productLink = getProductLink(item);
      if (productLink) {
        window.open(productLink, '_blank', 'noopener,noreferrer');
      }
    }
  };

  const handleBuyAllExternal = async () => {
    try {
      await buyAllExternalProducts();
    } catch (err) {
      console.error('Failed to process bulk external purchase:', err);
      externalProducts.forEach(item => {
        const productLink = getProductLink(item);
        if (productLink) {
          window.open(productLink, '_blank', 'noopener,noreferrer');
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
            <div className="text-red-600 text-xl mb-4">Error Loading Cart</div>
            <p className="text-red-700 mb-4">{error}</p>
            <Button onClick={refreshCart} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <EmptyState
            title="Your cart is empty"
            message="Add some amazing products to your cart and they will appear here."
            icon="🛒"
            action={
              <Link to="/products">
                <Button variant="primary" size="large">
                  Start Shopping
                </Button>
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link 
              to="/products" 
              className="p-2 text-gray-600 hover:text-[#2563eb] transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <div className="text-sm sm:text-base text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Cart Items - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {cartItems.map((item) => {
                const isExternal = isExternalProduct(item);
                const productLink = getProductLink(item);
                const itemTotal = ((item.price || item.product.price || 0) * item.quantity).toFixed(2);
                
                return (
                  <div key={item._id || item.product._id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link 
                        to={`/products/${item.product._id}`}
                        className="flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <img
                          src={item.product.images?.[0]?.url || item.productImage || '/images/placeholder/product.png'}
                          alt={item.product.title || item.productTitle}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <Link
                            to={`/products/${item.product._id}`}
                            className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[#2563eb] line-clamp-2"
                          >
                            {item.product.title || item.productTitle}
                          </Link>
                          <div className="text-lg font-bold text-gray-900 sm:text-right">
                            ${itemTotal}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {item.product.description}
                        </p>
                        
                        {/* Stock Status */}
                        <div className="mb-4">
                          {item.product.stock < item.quantity && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <p className="text-red-600 text-xs sm:text-sm font-medium">
                                Only {item.product.stock} left in stock
                              </p>
                            </div>
                          )}
                          {item.product.stock > 0 && item.product.stock >= item.quantity && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <p className="text-green-600 text-xs sm:text-sm font-medium">
                                In stock
                              </p>
                            </div>
                          )}
                          {(!item.product.stock || item.product.stock === 0) && (
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              <p className="text-red-600 text-xs sm:text-sm font-medium">
                                Out of stock
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Quantity Controls and Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2 w-fit">
                            <span className="text-xs sm:text-sm font-medium text-gray-700">Qty:</span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                              >
                                <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                              <span className="w-6 sm:w-8 text-center font-semibold text-gray-900 text-sm sm:text-base">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                                disabled={item.quantity >= (item.product.stock || 0)}
                                className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-400 transition-colors"
                              >
                                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                              </button>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            {isExternal ? (
                              <button
                                onClick={() => handleBuyNow(item)}
                                className="flex items-center gap-1 sm:gap-2 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                Buy Now
                              </button>
                            ) : (
                              <button
                                className="flex items-center gap-1 sm:gap-2 bg-gray-100 text-gray-600 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium cursor-not-allowed opacity-50"
                                disabled
                              >
                                <ShoppingBag className="w-3 h-3 sm:w-4 sm:h-4" />
                                Internal
                              </button>
                            )}

                            <button
                              onClick={() => removeFromCart(item.product._id)}
                              className="flex items-center gap-1 sm:gap-2 text-red-600 hover:text-red-800 text-xs sm:text-sm transition-colors p-2 rounded-lg hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="hidden sm:inline">Remove</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* External Link Notice */}
                    {isExternal && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                          <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
                          <span className="text-blue-800 text-xs sm:text-sm font-medium">
                            External Store Product
                          </span>
                        </div>
                        <p className="text-blue-700 text-xs sm:text-sm">
                          Click "Buy Now" to purchase directly from the official store
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cart Summary - Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 sticky top-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Items:</span>
                  <span className="text-sm sm:text-base font-medium text-gray-900">{cartItems.length}</span>
                </div>
                
                {externalProductsCount > 0 && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm sm:text-base text-gray-600">External Products:</span>
                    <span className="text-sm sm:text-base font-medium text-[#2563eb]">{externalProductsCount}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold text-gray-900">Total:</span>
                  <span className="text-base sm:text-lg font-bold text-gray-900">
                    $
                    {cartItems
                      .reduce((total, item) => total + (item.price || item.product.price || 0) * item.quantity, 0)
                      .toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons - checkout and bulk external purchase removed per request */}
              <div className="space-y-3">
                <Link
                  to="/products"
                  className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 py-3 px-4 rounded-lg font-semibold text-center block transition-colors text-sm"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;