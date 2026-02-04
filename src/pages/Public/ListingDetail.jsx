// pages/Public/ListingDetail.jsx
/**
 * Universal ListingDetail Component
 * Handles: Software Tools (affiliate), Job Listings, Digital/Physical Products
 * 
 * CTA Behavior:
 * - If externalLink: Show "Visit Official Website" / "Apply Now" (one primary button)
 * - If no externalLink: Show Add to Cart + Buy Now (optional)
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useCart from '../../hooks/useCart';
import { useAuth } from '../../context/AuthContext';
import ProductImages from '../../components/Products/ProductImages';
import OfferSection from '../../components/Products/OfferSection';
import Button from '../../components/UI/Button';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import LoginModal from '../../components/Auth/LoginModal';
import { Star, Edit3, User, Calendar, CheckCircle, ShoppingCart, ExternalLink, X, Info, Tag, MapPin, Building2 } from 'lucide-react';
import { extractIdFromSlug, setPageTitle, createSlug } from '../../utils/slugify';
import productService from '../../services/productService';
import trackingService from '../../services/trackingService';

const ListingDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const productId = extractIdFromSlug(slug);
  const { getProductById, recordBuyClick, recordView, addReview, loading: productsLoading } = useProducts();
  const { addToCart, cartItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  // Action-specific loading states
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  // Review states
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Listing type helpers
  const isToolListing = listing?.type === 'tool';
  const isJobListing = listing?.type === 'job';
  const isProductListing = listing?.type === 'product' || !listing?.type;
  const hasExternalLink = !!listing?.externalLink;
  const isFreeApp = listing?.pricingType === 'free';
  const isPaid = listing?.pricingType === 'paid';
  const isFreemium = listing?.pricingType === 'freemium';
  const cartEnabled = listing?.cartEnabled !== false && isProductListing && !hasExternalLink;

  // Fetch listing data
  useEffect(() => {
    if (!slug) {
      navigate('/listings', { replace: true });
      return;
    }

    const fetchListing = async () => {
      try {
        setLoading(true);
        setError('');

        if (productId) {
          const result = await getProductById(productId);
          if (result?.success && result.data) {
            setListing(result.data);
            setPageTitle(result.data.title);
            try {
              await recordView(result.data._id || productId);
            } catch (viewError) {
              // View recording failed (ignored)
            }
            return;
          }
        }

        // Fallback: fetch by slug
        try {
          const slugResult = await productService.getBySlug(slug);
          if (slugResult?.success && slugResult.data) {
            setListing(slugResult.data);
            setPageTitle(slugResult.data.title);
            try {
              await recordView(slugResult.data._id);
            } catch (viewError) {}
          } else {
            setError((slugResult?.error) || 'Listing not found');
          }
        } catch (fallbackErr) {
          setError('Listing not found');
        }
      } catch (err) {
        setError('Failed to fetch listing');
        console.error('Error fetching listing:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [slug, getProductById, recordView]);

  const requireAuth = (action) => {
    if (!isAuthenticated) {
      setPendingAction(action);
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Track external link click (affiliate tracking)
  const handleExternalLinkClick = async () => {
    try {
      // Record both old method (recordBuyClick) and new tracking service
      await recordBuyClick(listing?._id || productId);
      
      // Record with new tracking service
      const clickType = isJobListing ? 'apply' : 'visit_link';
      await trackingService.recordClick(
        listing?._id || productId,
        listing?.type || 'product',
        clickType
      );
    } catch (err) {
      console.warn('Failed to record click:', err);
    }

    if (isJobListing) {
      setNotification({
        show: true,
        message: 'Redirecting to job application...',
        type: 'info'
      });
    } else {
      setNotification({
        show: true,
        message: 'Opening listing in new tab...',
        type: 'info'
      });
    }

    window.open(listing.externalLink, '_blank', 'noopener,noreferrer');
  };

  // Add to Cart
  const handleAddToCart = async () => {
    if (!listing) return;
    
    if (!requireAuth('addToCart')) {
      return;
    }
    
    try {
      setIsProcessing(true);
      const productExists = cartItems?.some(item => item.product?._id === listing._id);
      if (productExists) {
        setNotification({
          show: true,
          message: 'This product is already in your cart!',
          type: 'warning'
        });
        setIsProcessing(false);
        return;
      }
      
      const result = await addToCart(listing, quantity);
      
      if (result && (result.success !== false)) {
        setNotification({
          show: true,
          message: 'Product added to cart successfully!',
          type: 'success'
        });
        
        try {
          await recordBuyClick(listing?._id || productId);
          // Also record with new tracking service
          await trackingService.recordClick(
            listing?._id || productId,
            'product',
            'add_to_cart'
          );
        } catch (clickError) {}
      } else {
        throw new Error(result?.error || 'Failed to add to cart');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
      setNotification({
        show: true,
        message: err.message || 'Failed to add to cart',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Buy Now
  const handleBuyNow = async () => {
    if (!listing) return;

    if (!requireAuth('buyNow')) {
      return;
    }

    try {
      setIsProcessing(true);
      const result = await addToCart(listing, quantity);
      
      if (result && (result.success !== false)) {
        setNotification({
          show: true,
          message: 'Product added to cart! Redirecting...',
          type: 'success'
        });
        
        try {
          await recordBuyClick(listing?._id || productId);
          // Also record with new tracking service
          await trackingService.recordClick(
            listing?._id || productId,
            'product',
            'buy_now'
          );
        } catch (clickError) {}
        
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
        message: err.message || 'Failed to complete action',
        type: 'error'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Review handlers
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();

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
        message: 'Please write a review with at least 10 characters',
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

      const result = await addReview(listing?._id || productId, reviewData);
      
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

        const updatedReviews = [...(listing.reviews || []), newReview];
        const newAverageRating = calculateNewAverageRating(updatedReviews);

        setListing(prev => ({
          ...prev,
          reviews: updatedReviews,
          averageRating: newAverageRating
        }));

        setNotification({
          show: true,
          message: 'Review submitted successfully!',
          type: 'success'
        });

        resetReviewForm();
      } else {
        throw new Error(result.error || 'Failed to submit review');
      }
    } catch (err) {
      console.error('Review error:', err);
      setNotification({
        show: true,
        message: err.message || 'Failed to submit review',
        type: 'error'
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const calculateNewAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const validReviews = reviews.filter(r => r.rating >= 1 && r.rating <= 5);
    if (validReviews.length === 0) return 0;
    const sum = validReviews.reduce((acc, r) => acc + r.rating, 0);
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

  const hasUserReviewed = listing?.reviews?.some(review => 
    review.user?._id === user?._id || review.user === user?._id
  );

  const getRatingDistribution = () => {
    if (!listing?.reviews) return {};
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    listing.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        distribution[review.rating]++;
      }
    });
    return distribution;
  };

  const getRatingText = (rating) => {
    const texts = { 1: 'Poor', 2: 'Fair', 3: 'Good', 4: 'Very Good', 5: 'Excellent' };
    return texts[rating] || 'No Rating';
  };

  const resetReviewForm = () => {
    setReviewRating(0);
    setReviewTitle('');
    setReviewComment('');
    setHoverRating(0);
    setShowReviewForm(false);
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = listing?.reviews?.length || 0;

  // ========== LOADING & ERROR STATES ==========
  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="large" showBrand={true} brandText="TrendyBreeze" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Listing not found'}</div>
          <Link to="/listings" className="text-black hover:text-gray-700 font-medium">
            Back to Listings
          </Link>
        </div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => {
          setShowLoginModal(false);
          setPendingAction(null);
        }}
        redirectPath={`/listings/${slug}`}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ========== BREADCRUMB ========== */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-gray-900">Home</Link></li>
            <li><span className="mx-2">/</span></li>
            <li><Link to="/listings" className="hover:text-gray-900">
              {isJobListing ? 'Jobs' : isToolListing ? 'Tools' : 'Listings'}
            </Link></li>
            {listing.category && (
              <>
                <li><span className="mx-2">/</span></li>
                <li>
                  <Link 
                    to={`/listings?category=${listing.category._id || listing.category}`}
                    className="hover:text-gray-900"
                  >
                    {listing.category.name || 'Category'}
                  </Link>
                </li>
              </>
            )}
            <li><span className="mx-2">/</span></li>
            <li className="text-gray-900 font-medium truncate max-w-xs">{listing.title}</li>
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

        {/* ========== LISTING OVERVIEW (HEADER) ========== */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-4 sm:p-6 lg:p-8">
            {/* Images */}
            <div>
              {listing.images && listing.images.length > 0 ? (
                <ProductImages
                  images={listing.images}
                  selectedImage={selectedImage}
                  onImageSelect={setSelectedImage}
                />
              ) : (
                <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            {/* Listing Info */}
            <div className="space-y-6">
              {/* Title & Rating */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
                
                {/* Listing Type Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    <Tag className="w-3 h-3" />
                    {isJobListing ? 'Job Opening' : isToolListing ? 'Software Tool' : 'Product'}
                  </span>
                  {listing.isFeatured && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⭐ Featured
                    </span>
                  )}
                </div>

                {/* Rating (hide for jobs) */}
                {!isJobListing && (
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-5 h-5 ${
                          star <= (listing.averageRating || 0)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {listing.averageRating || '0.0'} • ({totalReviews} reviews)
                    </span>
                  </div>
                )}
              </div>

              {/* EXTERNAL LINK ALERT */}
              {hasExternalLink && (
                <div className={`border-2 rounded-lg p-4 ${
                  isJobListing 
                    ? 'bg-blue-50 border-blue-200' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-start gap-3">
                    <ExternalLink className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                      isJobListing ? 'text-blue-600' : 'text-green-600'
                    }`} />
                    <div>
                      <p className={`font-medium ${isJobListing ? 'text-blue-900' : 'text-green-900'}`}>
                        {isJobListing ? 'Apply on company website' : 'Visit official website'}
                      </p>
                      <p className={`text-sm mt-1 ${isJobListing ? 'text-blue-700' : 'text-green-700'}`}>
                        {isJobListing 
                          ? 'Click below to apply directly through the company\'s career page.'
                          : 'This is an affiliate link. We may earn a commission at no extra cost to you.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* QUICK INFO - Replaces Price + Stock */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Quick Info
                </h3>
                <div className="space-y-3">
                  {/* Pricing Type */}
                  {(isToolListing || isProductListing) && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Pricing</span>
                      <span className="font-medium text-gray-900 capitalize">
                        {listing.pricingType ? listing.pricingType.replace('Freemium', 'Free + Paid') : 'Not specified'}
                      </span>
                    </div>
                  )}

                  {/* Platform (for tools) */}
                  {isToolListing && listing.platform && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Platform</span>
                      <span className="font-medium text-gray-900">
                        {listing.platform.join(', ')}
                      </span>
                    </div>
                  )}

                  {/* Company (for jobs) */}
                  {isJobListing && listing.companyName && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Company</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1">
                        <Building2 className="w-4 h-4" />
                        {listing.companyName}
                      </span>
                    </div>
                  )}

                  {/* Stock (for products) */}
                  {isProductListing && !hasExternalLink && (
                    <div className="flex justify-between py-2 border-b border-gray-200">
                      <span className="text-gray-600">Stock</span>
                      <span className={`font-medium ${listing.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {listing.stock > 0 ? `${listing.stock} available` : 'Out of Stock'}
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex justify-between py-2">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium text-gray-900">
                      {listing.category?.name || 'Uncategorized'}
                    </span>
                  </div>
                </div>
              </div>

              {/* PRICE SECTION (Products only, if no external link) */}
              {isProductListing && !hasExternalLink && (
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                    ${(listing.price || 0).toFixed(2)}
                  </span>
                </div>
              )}

              {/* CTA SECTION */}
              <div className="border-t border-gray-200 pt-6">
                {/* EXTERNAL LINK MODE: Single Primary CTA */}
                {hasExternalLink ? (
                  <div className="space-y-3">
                    <Button
                      variant="primary"
                      size="large"
                      onClick={handleExternalLinkClick}
                      className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <ExternalLink className="w-5 h-5" />
                      {isJobListing ? 'Apply Now' : 'Visit Official Website'}
                    </Button>
                    
                    {/* Affiliate Disclosure */}
                    {isToolListing && !isJobListing && (
                      <p className="text-xs text-gray-600 text-center">
                        💡 We may earn a commission at no extra cost to you. Thank you for supporting!
                      </p>
                    )}
                  </div>
                ) : (
                  /* PRODUCT MODE: Add to Cart + Buy Now */
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <label htmlFor="quantity" className="text-sm font-medium text-gray-700">
                        Quantity:
                      </label>
                      <select
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                        disabled={listing.stock === 0}
                      >
                        {[...Array(Math.min(listing.stock || 0, 10))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button
                        variant="primary"
                        size="large"
                        onClick={handleAddToCart}
                        disabled={!listing.stock || listing.stock === 0 || isProcessing}
                        className="flex-1 flex items-center justify-center gap-2"
                      >
                        {isProcessing ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-5 h-5" />
                            {(!listing.stock || listing.stock === 0) ? 'Out of Stock' : 'Add to Cart'}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        variant="secondary"
                        size="large"
                        onClick={handleBuyNow}
                        disabled={!listing.stock || listing.stock === 0 || isProcessing}
                        className="flex-1"
                      >
                        {isProcessing ? 'Processing...' : 'Buy Now'}
                      </Button>
                    </div>

                    {!isAuthenticated && (
                      <p className="text-sm text-gray-600 text-center">
                        Please sign in to add products to cart
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========== LISTING DETAILS SECTION ========== */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-200">
              Listing Details
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Description */}
              <div className="lg:col-span-2">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {isJobListing ? 'About This Role' : isToolListing ? 'Features & Overview' : 'Description'}
                </h3>
                <div className="prose max-w-none">
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line text-lg">
                    {listing.description}
                  </p>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="space-y-6">
                {/* Tags */}
                {listing.tags && listing.tags.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">
                      {isJobListing ? 'Required Skills' : 'Tags'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.tags.map((tag, index) => (
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

                {/* Job-specific Info */}
                {isJobListing && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-3">Job Details</h4>
                    <div className="space-y-2 text-sm text-blue-800">
                      {listing.jobType && <p>📋 <strong>Type:</strong> {listing.jobType}</p>}
                      {listing.location && <p><MapPin className="inline w-4 h-4 mr-1" /><strong>Location:</strong> {listing.location}</p>}
                      {listing.salary && <p>💰 <strong>Salary:</strong> {listing.salary}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ========== REVIEWS SECTION (Skip for jobs) ========== */}
        {!isJobListing && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="px-4 sm:px-6 py-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Customer Reviews</h2>
              <p className="text-gray-600 mb-8">See what others think about this {isToolListing ? 'tool' : 'product'}</p>
              
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Review Stats */}
                <div className="lg:w-1/3">
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="text-center mb-6">
                      <div className="text-5xl font-bold text-gray-900 mb-2">
                        {listing.averageRating || '0.0'}
                      </div>
                      <div className="flex items-center justify-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-5 h-5 ${
                              star <= Math.floor(listing.averageRating || 0)
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
                              <p className="text-sm font-medium">You've reviewed this</p>
                              <p className="text-xs text-green-500">Thank you for feedback!</p>
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
                              {showReviewForm ? 'Cancel' : 'Write Review'}
                            </Button>
                            <p className="text-xs text-gray-500 text-center">
                              Share your experience
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
                            Sign in to Review
                          </Button>
                          <p className="text-xs text-gray-500 text-center">
                            Sign in to share feedback
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="lg:w-2/3">
                  {/* Review Form */}
                  {showReviewForm && isAuthenticated && !hasUserReviewed && (
                    <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 mb-8 relative">
                      <button
                        onClick={resetReviewForm}
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      
                      <div className="flex items-center gap-2 mb-4">
                        <Edit3 className="w-5 h-5 text-black" />
                        <h3 className="text-xl font-semibold text-gray-900">Write Your Review</h3>
                      </div>

                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div>
                          <label htmlFor="reviewTitle" className="block text-sm font-medium text-gray-700 mb-2">
                            Review Title *
                          </label>
                          <input
                            type="text"
                            id="reviewTitle"
                            value={reviewTitle}
                            onChange={(e) => setReviewTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                            placeholder="Summarize your experience"
                            required
                            disabled={isSubmittingReview}
                            maxLength={100}
                          />
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
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">
                            {reviewRating > 0 ? getRatingText(reviewRating) : 'Select rating'}
                          </span>
                        </div>

                        <div>
                          <label htmlFor="reviewComment" className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review *
                            <span className={`ml-2 text-sm ${
                              reviewComment.trim().length < 10 ? 'text-red-500' : 'text-green-500'
                            }`}>
                              ({reviewComment.trim().length}/10+)
                            </span>
                          </label>
                          <textarea
                            id="reviewComment"
                            value={reviewComment}
                            onChange={(e) => setReviewComment(e.target.value)}
                            rows="4"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                            placeholder="Share your experience..."
                            required
                            disabled={isSubmittingReview}
                            maxLength={1000}
                          />
                        </div>

                        <div className="flex gap-3 pt-2">
                          <Button
                            type="submit"
                            disabled={isSubmittingReview || reviewRating === 0 || !reviewComment.trim() || reviewComment.trim().length < 10}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {isSubmittingReview ? 'Submitting...' : 'Submit Review'}
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
                    {listing.reviews && listing.reviews.length > 0 ? (
                      listing.reviews.map((review, index) => (
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
                                <h4 className="font-semibold text-gray-900">
                                  {review.user?.name || 'Anonymous'}
                                </h4>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <Calendar className="w-4 h-4" />
                                  <span>{formatDate(review.createdAt)}</span>
                                </div>
                              </div>
                            </div>
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
                          </div>
                          
                          {review.title && (
                            <h5 className="text-lg font-semibold text-gray-900 mb-3">
                              {review.title}
                            </h5>
                          )}
                          
                          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                            {review.comment}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <Star className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-lg font-medium text-gray-900 mb-2">No reviews yet</p>
                        <p className="text-sm max-w-md mx-auto">
                          Be the first to share your thoughts!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========== OFFERS SECTION ========== */}
        <OfferSection categoryId={listing?.category?._id || listing?.category} listingId={listing?._id} />
      </div>
    </div>
  );
};

export default ListingDetail;
