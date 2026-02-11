import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';
import useSEO from '../../hooks/useSEO';
import { cartPageConfig } from '../../config/pageSchemas';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { Trash2, Plus, Minus, ExternalLink, ShoppingBag, ArrowLeft, AlertCircle } from 'lucide-react';
import { setPageTitle, createSlug } from '../../utils/slugify';

const Cart = () => {
  const { isDark } = useTheme();
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

  // Call useSEO at the top level of the component (before useEffect)
  useSEO({
    title: cartPageConfig.title,
    description: cartPageConfig.description,
    url: cartPageConfig.url,
    image: cartPageConfig.image,
    schema: cartPageConfig.schema
  });

  // Set page title
  useEffect(() => {
    setPageTitle('Shopping Cart');
  }, []);

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
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4 text-center">
          <div className={`${isDark ? 'bg-red-950 border-red-800' : 'bg-red-50 border-red-200'} border rounded-lg p-6 max-w-md mx-auto`}>
            <div className={`${isDark ? 'text-red-400' : 'text-red-600'} text-xl mb-4 flex items-center justify-center gap-2`}>
              <AlertCircle className="w-6 h-6" />
              Error Loading Cart
            </div>
            <p className={`${isDark ? 'text-red-300' : 'text-red-700'} mb-4`}>{error}</p>
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
      <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-8`}>
        <div className="container mx-auto px-4">
          <EmptyState
            title="Your cart is empty"
            message="Add some amazing products to your cart and they will appear here."
            icon="🛒"
            action={
              <Link to="/listings">
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
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} py-4 sm:py-8 transition-colors duration-200`}>
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link 
              to="/listings" 
              className={`p-2 rounded-lg transition-all duration-200 ${
                isDark 
                  ? 'text-gray-300 hover:text-white hover:bg-gray-800' 
                  : 'text-gray-600 hover:text-black hover:bg-gray-100'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className={`text-2xl sm:text-3xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Shopping Cart
            </h1>
          </div>
          <div className={`text-sm sm:text-base ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Cart Items - Main Content */}
          <div className="lg:col-span-2">
            <div className={`rounded-lg shadow-sm border transition-colors duration-200 ${
              isDark
                ? 'bg-gray-800 border-gray-700 divide-gray-700'
                : 'bg-white border-gray-200 divide-gray-200'
            } divide-y`}>
              {cartItems.map((item) => {
                const isExternal = isExternalProduct(item);
                const productLink = getProductLink(item);
                
                return (
                  <div key={item._id || item.product._id} className={`p-4 sm:p-6 transition-colors duration-200`}>
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link 
                        to={`/listings/${createSlug(item.product._id, item.product.title)}`}
                        className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden transition-colors duration-200 ${
                          isDark ? 'bg-gray-700' : 'bg-gray-100'
                        }`}
                      >
                        <img
                          src={item.product.images?.[0]?.url || item.productImage || '/images/placeholder/product.png'}
                          alt={item.product.title || item.productTitle}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                        />
                      </Link>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col gap-2 mb-2">
                          {/* Title */}
                          {productLink ? (
                            <a
                              href={productLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={`text-lg sm:text-xl font-semibold line-clamp-2 transition-colors duration-200 ${
                                isDark 
                                  ? 'text-white hover:text-blue-400' 
                                  : 'text-gray-900 hover:text-blue-600'
                              }`}
                            >
                              {item.product?.title || item.productTitle}
                            </a>
                          ) : (
                            <Link
                              to={`/listings/${createSlug(item.product?._id, item.product?.title || item.productTitle)}`}
                              className={`text-lg sm:text-xl font-semibold line-clamp-2 transition-colors duration-200 ${
                                isDark 
                                  ? 'text-white hover:text-blue-400' 
                                  : 'text-gray-900 hover:text-blue-600'
                              }`}
                            >
                              {item.product?.title || item.productTitle}
                            </Link>
                          )}

                          {/* Short description */}
                          <p className={`text-sm mb-1 line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                            {item.product?.description || item.productDescription || item.productTitle}
                          </p>

                          <div className="flex items-center gap-2">
                            {/* Open / Redirect Button */}
                            {productLink ? (
                              <a
                                href={productLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                  isDark
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                Open
                              </a>
                            ) : (
                              <Link
                                to={`/listings/${createSlug(item.product?._id, item.product?.title || item.productTitle)}`}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                  isDark
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                Open
                              </Link>
                            )}

                            <button
                              onClick={() => removeFromCart(item._id || item.product?._id)}
                              className={`flex items-center gap-1 sm:gap-2 text-xs sm:text-sm transition-all duration-200 p-2 rounded-lg ${
                                isDark
                                  ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
                                  : 'text-red-600 hover:text-red-800 hover:bg-red-50'
                              }`}
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
                      <div className={`mt-4 p-3 rounded-lg border transition-colors duration-200 ${
                        isDark
                          ? 'bg-blue-900/30 border-blue-700'
                          : 'bg-blue-50 border-blue-200'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <ExternalLink className={`w-3 h-3 sm:w-4 sm:h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
                          <span className={`text-xs sm:text-sm font-medium ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                            External Store Product
                          </span>
                        </div>
                        <p className={`text-xs sm:text-sm ${isDark ? 'text-blue-300' : 'text-blue-700'}`}>
                          Click "Open" to visit the product page on the official store
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sidebar removed per request (Order Summary hidden) */}
        </div>
      </div>
    </div>
  );
};

export default Cart;
