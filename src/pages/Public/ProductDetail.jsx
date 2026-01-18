// components/Products/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import ProductImages from '../../components/Products/ProductImages';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import LoginModal from '../../components/Auth/LoginModal';
import { Star, Edit3, User, Calendar, CheckCircle, ShoppingCart, ExternalLink, X } from 'lucide-react';
import { extractIdFromSlug, setPageTitle, createSlug } from '../../utils/slugify';
import productService from '../../services/productService';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const productId = extractIdFromSlug(slug);
  const { getProductById, recordBuyClick, recordView, addReview, loading: productsLoading } = useProducts();
  const { addToCart, cartItems } = useCart();
  const { user, isAuthenticated, login } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Action-specific loading states (don't block page)
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  
  // Login modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); // 'addToCart', 'buyNow', or 'review'
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    // Guard against invalid route
    if (!slug) {
      navigate('/products', { replace: true });
      return;
    }

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');

        // If we have an extracted id, try fetching by id first
        if (productId) {
          let result = await getProductById(productId);

          if (result && result.success && result.data) {
            setProduct(result.data);
            setPageTitle(result.data.title);

            try {
              await recordView(result.data._id || productId);
            } catch (viewError) {
              // View recording failed (ignored)
            }
            return;
          }
        }

        // Fallback: try fetching by slug via productService
        try {
          const slugResult = await productService.getBySlug(slug);
          if (slugResult && slugResult.success && slugResult.data) {
            setProduct(slugResult.data);
            setPageTitle(slugResult.data.title);
            try {
              await recordView(slugResult.data._id);
            } catch (viewError) {}
          } else {
            setError((slugResult && slugResult.error) || 'Product not found');
          }
        } catch (fallbackErr) {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to fetch product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug, getProductById, recordView]);

  // Handle authentication required actions
  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setPendingAction(action);
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Handle login success
  const handleLoginSuccess = () => {
    // Execute the pending action after successful login
    if (pendingAction === 'addToCart') {
      executeAddToCart();
    } else if (pendingAction === 'buyNow') {
      executeBuyNow();
    } else if (pendingAction === 'review') {
      setShowReviewForm(true);
    }
    
    setPendingAction(null);
    setShowLoginModal(false);
    
    setNotification({
      show: true,
      message: 'Successfully signed in!',
      type: 'success'
    });
  };

  // Add to Cart function - UPDATED
  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!requireAuth('addToCart')) {
      return;
    }
    
    executeAddToCart();
  };

  const executeAddToCart = async () => {
    try {
      setIsAddingToCart(true);
      
      // Check if product is already in cart
      const productExists = cartItems?.some(item => item.product?._id === product._id);
      if (productExists) {
        setNotification({
          show: true,
          message: 'This product is already in your cart!',
          type: 'warning'
        });
        setIsAddingToCart(false);
        return;
      }
      
      const result = await addToCart(product, quantity);
      
      // CartService returns the data directly, not a success object
      if (result && (result.success !== false)) {
        setNotification({
          show: true,
          message: 'Product added to cart successfully!',
          type: 'success'
        });
        
        try {
          await recordBuyClick(product?._id || productId);
        } catch (clickError) {
          // Buy click recording failed (ignored)
        }
      } else {
        throw new Error(result?.error || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      setNotification({
        show: true,
        message: err.message || 'Failed to add product to cart',
        type: 'error'
      });
    } finally {
      setIsAddingToCart(false);
    }
  };

  // Buy Now function - UPDATED
  const handleBuyNow = async () => {
    if (!product) return;

    // For external links, no login required
    if (hasExternalLink) {
      try {
        await recordBuyClick(product?._id || productId);
      } catch (clickError) {
        // Buy click recording failed (ignored)
      }

      window.open(product.productLink, '_blank', 'noopener,noreferrer');
      setNotification({
        show: true,
        message: 'Redirecting to external store...',
        type: 'info'
      });
      return;
    }

    // For internal purchases, require login
    if (!requireAuth('buyNow')) {
      return;
    }

    executeBuyNow();
  };

  const executeBuyNow = async () => {
    try {
      setIsBuyingNow(true);
      const result = await addToCart(product, quantity);
      
      // CartService returns the data directly, not a success object
      if (result && (result.success !== false)) {
        setNotification({
          show: true,
          message: 'Product added to cart! Redirecting to cart...',
          type: 'success'
        });
        
        try {
          await recordBuyClick(product?._id || productId);
        } catch (clickError) {
          // Buy click recording failed (ignored)
        }
        
        // Navigate to cart page after a short delay
        setTimeout(() => {
          window.location.href = '/cart';
        }, 1000);
      } else {
        throw new Error(result?.error || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Buy now error:', err);
      setNotification({
        show: true,
        message: err.message || 'Failed to add product to cart',
        type: 'error'
      });
    } finally {
      setIsBuyingNow(false);
    }
  };

  // Review form toggle - UPDATED
  const handleReviewButtonClick = () => {
    if (showReviewForm) {
      setShowReviewForm(false);
      return;
    }
    
    if (!requireAuth('review')) {
      return;
    }
    setShowReviewForm(true);
  };

  // Submit review function - UPDATED
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    // Validation
    if (reviewRating === 0) {
      setNotification({
        show: true,
        message: 'Please select a rating',
        type: 'warning'
      });
      return;
    }

    if (!reviewComment.trim() || reviewComment.trim().length < 10) {
      setNotification({
        show: true,
        message: 'Please write a review comment with at least 10 characters',
        type: 'warning'
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      const reviewData = {
        rating: Number(reviewRating),
        comment: reviewComment.trim(),
        title: reviewTitle.trim() || `My ${reviewRating}-star review`
      };

      // Submitting review data

      const result = await addReview(product?._id || productId, reviewData);
      
      if (result.success) {
        const newReview = {
          _id: result.review?._id || `temp-${Date.now()}`,
          user: {
            _id: user._id,
            name: user.name
          },
          rating: reviewRating,
          title: reviewTitle.trim() || `My ${reviewRating}-star review`,
          comment: reviewComment.trim(),
          createdAt: new Date().toISOString()
        };

        const updatedReviews = [...(product.reviews || []), newReview];
        const newAverageRating = calculateNewAverageRating(updatedReviews);

        setProduct(prev => ({
          ...prev,
          reviews: updatedReviews,
          averageRating: newAverageRating
        }));

        setNotification({
          show: true,
          message: 'Review submitted successfully! Thank you for your feedback.',
          type: 'success'
        });

        resetReviewForm();
      } else {
        throw new Error(result.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('❌ Review submission error:', err);
      
      let errorMessage = err.message || 'Failed to submit review. Please try again.';
      
      if (err.message?.includes('already reviewed') || err.message?.includes('Product already reviewed')) {
        errorMessage = 'You have already reviewed this product.';
      } else if (err.message?.includes('title') && err.message?.includes('required')) {
        errorMessage = 'Review title is required. Please add a title to your review.';
      }
      
      setNotification({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateNewAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const validReviews = reviews.filter(review => review.rating && review.rating >= 1 && review.rating <= 5);
    if (validReviews.length === 0) return 0;
    const sum = validReviews.reduce((acc, review) => acc + review.rating, 0);
    return parseFloat((sum / validReviews.length).toFixed(1));
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const hasUserReviewed = product?.reviews?.some(review => 
    review.user?._id === user?._id || review.user === user?._id
  );

  const getRatingDistribution = () => {
    if (!product?.reviews) return {};
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    product.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  const getRatingText = (rating) => {
    const ratingTexts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return ratingTexts[rating] || 'No Rating';
  };

  const resetReviewForm = () => {
    setReviewRating(0);
    setReviewTitle('');
    setReviewComment('');
    setHoverRating(0);
    setShowReviewForm(false);
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = product?.reviews?.length || 0;
  const hasExternalLink = !!product?.productLink;

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="large" showBrand={true} brandText="TrendyBreeze" />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Product not found'}</div>
          <Link
            to="/products"
            className="text-black hover:text-gray-700 font-medium"
          >
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingAction(null);
        }}
        redirectPath={`/product/${slug}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/products" className="hover:text-gray-900">Products</Link></li>
            {product.category && (
              <>
                <li><span className="mx-2">/</span></li>
                <li>
                  <Link 
                    to={`/products?category=${product.category._id || product.category}`}
                    className="hover:text-gray-900"
                  >
                    {product.category.name || 'Category'}
                  </Link>
                </li>
              </>
            )}
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{product.title}</li>
          </ol>
        </nav>

        {notification.show && (
          <div className="fixed top-4 right-4 z-50 max-w-md">
            <Notification
              type={notification.type}
              message={notification.message}
              duration={5000}
              onClose={() => setNotification({ ...notification, show: false })}
            />
          </div>
        )}

        {/* Main Product Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-6 lg:p-8">
            {/* Product Images */}
            <div>
              <ProductImages
                images={product.images || []}
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
              />
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (product.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.averageRating || '0.0'} • ({totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {hasExternalLink && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <ExternalLink className="w-5 h-5 text-black mr-2" />
                    <span className="text-black font-medium">External product available</span>
                  </div>
                  <p className="text-black text-sm mt-1">
                    Click "Buy Now" to visit the official store.
                  </p>
                  {product.productLink && (
                    <a 
                      href={product.productLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-black hover:text-gray-700 text-sm mt-2 inline-block break-all"
                    >
                      {product.productLink}
                    </a>
                  )}
                </div>
              )}

              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${(product.price || 0).toFixed(2)}
                </span>
              </div>

              <div className="flex items-center">
                {product.stock > 0 ? (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    In Stock ({product.stock} available)
                  </span>
                ) : (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Add to Cart Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center space-x-4 mb-4">
                  <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                    Quantity:
                  </label>
                  <select
                    id="quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    disabled={product.stock === 0}
                  >
                    {[...Array(Math.min(product.stock || 0, 10))].map((_, i) => (
                      <option key={i + 1} value={i + 1}>{i + 1}</option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="primary"
                    size="large"
                    onClick={handleAddToCart}
                    disabled={!product.stock || product.stock === 0 || isAddingToCart}
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {(!product.stock || product.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
                      </>
                    )}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    size="large"
                    onClick={handleBuyNow}
                    disabled={!product.stock || product.stock === 0 || isBuyingNow}
                    className={`flex-1 flex items-center justify-center gap-2 ${
                      hasExternalLink ? 'bg-green-600 hover:bg-green-700 text-white' : ''
                    }`}
                  >
                    {isBuyingNow ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : hasExternalLink ? (
                      <><ExternalLink className="w-5 h-5" />Buy on External Store</>
                    ) : (
                      'Buy Now'
                    )}
                  </Button>
                </div>

                {!isAuthenticated && (
                  <p className="text-sm text-gray-600 mt-3 text-center">
                    Please sign in to add products to cart
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description and Details Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Product Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Description */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Description</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                    {product.description}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="space-y-6">
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span 
                          key={index}
                          className="bg-gray-100 text-black px-3 py-2 rounded-lg text-sm font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Product Specifications */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Quick Info</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Category</span>
                      <span className="font-medium text-gray-900">
                        {product.category?.name || 'Uncategorized'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Stock</span>
                      <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Rating</span>
                      <span className="font-medium text-gray-900">
                        {product.averageRating || '0.0'} / 5.0
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="px-4 sm:px-6 py-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
            <p className="text-gray-600 mb-8">See what other customers are saying about this product</p>
            
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Review Stats */}
              <div className="lg:w-1/3">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {product.averageRating || '0.0'}
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= Math.floor(product.averageRating || 0)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-sm text-gray-600">
                      Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
                    </div>
                  </div>

                  {totalReviews > 0 && (
                    <div className="space-y-3">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = ratingDistribution[stars] || 0;
                        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        
                        return (
                          <div key={stars} className="flex items-center gap-3 text-sm">
                            <div className="flex items-center gap-1 w-12">
                              <span className="w-4 text-gray-600">{stars}</span>
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            </div>
                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-yellow-400 h-2 rounded-full" 
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="w-8 text-gray-600 text-right">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Review Button */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    {isAuthenticated ? (
                      hasUserReviewed ? (
                        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-3 rounded-lg border border-green-200">
                          <CheckCircle className="w-5 h-5" />
                          <div>
                            <p className="text-sm font-medium">You've reviewed this product</p>
                            <p className="text-xs text-green-500">Thank you for your feedback!</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-3">
                          <Button
                            onClick={handleReviewButtonClick}
                            variant="primary"
                            className="whitespace-nowrap flex items-center justify-center gap-2 w-full"
                          >
                            <Edit3 className="w-4 h-4" />
                            {showReviewForm ? 'Cancel Review' : 'Write a Review'}
                          </Button>
                          <p className="text-xs text-gray-500 text-center">
                            Share your experience with this product
                          </p>
                        </div>
                      )
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Button
                          onClick={() => requireAuth('review')}
                          variant="primary"
                          className="whitespace-nowrap w-full"
                        >
                          Sign in to Write Review
                        </Button>
                        <p className="text-xs text-gray-500 text-center">
                          Sign in to share your experience
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Reviews Content */}
              <div className="lg:w-2/3">
                {/* Review Form */}
                {showReviewForm && isAuthenticated && !hasUserReviewed && (
                  <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8 relative">
                    <button
                      onClick={resetReviewForm}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <Edit3 className="w-5 h-5 text-black" />
                      <h3 className="text-xl font-semibold text-gray-900">Write Your Review</h3>
                    </div>

                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      {/* Review Title */}
                      <div>
                        <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
                          Review Title *
                        </label>
                        <input
                          type="text"
                          id="reviewTitle"
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="Give your review a title (e.g., 'Great product!', 'Would recommend')"
                          required
                          disabled={isSubmittingReview}
                          maxLength={100}
                        />
                        <div className="text-right text-xs text-gray-500 mt-1">
                          {reviewTitle.length}/100 characters
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Your Rating *
                        </label>
                        <div className="flex gap-1 mb-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              className="p-1 transition-all hover:scale-110 focus:outline-none"
                              disabled={isSubmittingReview}
                            >
                              <Star
                                className={`w-8 h-8 ${
                                  star <= (hoverRating || reviewRating)
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                } ${isSubmittingReview ? 'opacity-50' : ''}`}
                              />
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {reviewRating > 0 ? getRatingText(reviewRating) : 'Select your rating'}
                          </span>
                          {reviewRating === 0 && (
                            <span className="text-red-500 text-sm">(Required)</span>
                          )}
                        </div>
                      </div>

                      <div>
                        <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-2">
                          Your Review *
                          <span className={`ml-2 text-sm ${
                            reviewComment.trim().length < 10 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            ({reviewComment.trim().length}/10+ characters)
                          </span>
                        </label>
                        <textarea
                          id="reviewComment"
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows="4"
                          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                            reviewComment.trim().length > 0 && reviewComment.trim().length < 10 
                              ? 'border-red-300 bg-red-50' 
                              : 'border-gray-300'
                          }`}
                          placeholder="Share your detailed experience... What did you like or dislike? How does it compare to similar products?"
                          required
                          disabled={isSubmittingReview}
                          maxLength={1000}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>
                            {reviewComment.trim().length > 0 && reviewComment.trim().length < 10 && (
                              <span className="text-red-500">
                                Minimum 10 characters required
                              </span>
                            )}
                          </span>
                          <span>{reviewComment.length}/1000</span>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <Button
                          type="submit"
                          disabled={isSubmittingReview || reviewRating === 0 || !reviewTitle.trim() || !reviewComment.trim() || reviewComment.trim().length < 10}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          {isSubmittingReview ? (
                            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting...</>
                          ) : (
                            'Submit Review'
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetReviewForm}
                          disabled={isSubmittingReview}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Reviews List */}
                <div className="space-y-6">
                  {product.reviews && product.reviews.length > 0 ? (
                    product.reviews.map((review, index) => (
                      <div 
                        key={review._id || `review-${index}`} 
                        className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-black" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-gray-900">
                                  {review.user?.name || 'Anonymous User'}
                                </h4>
                                {user && (review.user?._id === user._id || review.user === user._id) && (
                                  <span className="inline-flex items-center gap-1 bg-gray-100 text-black text-xs px-2 py-1 rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    You
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(review.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-4 h-4 ${
                                    star <= (review.rating || 0)
                                      ? 'fill-yellow-400 text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">
                              {getRatingText(review.rating)}
                            </span>
                          </div>
                        </div>
                        
                        {review.title && (
                          <h5 className="text-lg font-semibold text-gray-900 mb-3">
                            {review.title}
                          </h5>
                        )}
                        
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                      <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-lg font-medium text-gray-900 mb-2">No reviews yet</p>
                      <p className="text-sm mb-6 max-w-md mx-auto">
                        {isAuthenticated 
                          ? 'Be the first to share your thoughts about this product! Your review will help other customers make informed decisions.'
                          : 'Sign in to be the first to review this product and help other shoppers.'
                        }
                      </p>
                      {!isAuthenticated && (
                        <Button
                          onClick={() => requireAuth('review')}
                          variant="primary"
                          className="mt-2"
                        >
                          Sign in to Write Review
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
