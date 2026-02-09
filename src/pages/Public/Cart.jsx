import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { Trash2, Plus, Minus, ExternalLink, ShoppingBag, ArrowLeft } from 'lucide-react';
import { setPageTitle, createSlug } from '../../utils/slugify';

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
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="container mx-auto px-3 sm:px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-3">
            <Link 
              to="/listings" 
              className="p-2 text-gray-600 hover:text-[black] transition-colors rounded-lg hover:bg-gray-100"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          </div>
          <div className="text-sm sm:text-base text-gray-600">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:gap-6">
          {/* Cart Items - Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
              {cartItems.map((item) => {
                const isExternal = isExternalProduct(item);
                const productLink = getProductLink(item);
                
                return (
                  <div key={item._id || item.product._id} className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Product Image */}
                      <Link 
                        to={`/listings/${createSlug(item.product._id, item.product.title)}`}
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
                        <div className="flex flex-col gap-2 mb-2">
                          {/* Title */}
                          {productLink ? (
                            <a
                              href={productLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[black] line-clamp-2"
                            >
                              {item.product?.title || item.productTitle}
                            </a>
                          ) : (
                            <Link
                              to={`/listings/${createSlug(item.product?._id, item.product?.title || item.productTitle)}`}
                              className="text-lg sm:text-xl font-semibold text-gray-900 hover:text-[black] line-clamp-2"
                            >
                              {item.product?.title || item.productTitle}
                            </Link>
                          )}

                          {/* Short description */}
                          <p className="text-gray-600 text-sm mb-1 line-clamp-2">
                            {item.product?.description || item.productDescription || item.productTitle}
                          </p>

                          <div className="flex items-center gap-2">
                            {/* Open / Redirect Button */}
                            {productLink ? (
                              <a
                                href={productLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                Open
                              </a>
                            ) : (
                              <Link
                                to={`/listings/${createSlug(item.product?._id, item.product?.title || item.productTitle)}`}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors"
                              >
                                <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4" />
                                Open
                              </Link>
                            )}

                            <button
                              onClick={() => removeFromCart(item._id || item.product?._id)}
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
                      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-2 mb-1">
                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
                            <span className="text-black text-xs sm:text-sm font-medium">
                              External Store Product
                            </span>
                          </div>
                          <p className="text-black text-xs sm:text-sm">
                            Click "Buy Now" to purchase directly from the official store
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
