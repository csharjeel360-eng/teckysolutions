import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Star, ThumbsUp, MessageCircle, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Button from '../UI/Button';
import { formatRelativeTime } from '../../utils/helpers';

const ReviewSection = ({ 
  reviews = [], 
  averageRating = 0,
  totalReviews = 0,
  onAddReview,
  productId 
}) => {
  const { isAuthenticated, user } = useApp();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [helpfulReviews, setHelpfulReviews] = useState(new Set());

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(review => review.rating === stars).length,
    percentage: (reviews.filter(review => review.rating === stars).length / reviews.length) * 100
  }));

  const onSubmitReview = async (data) => {
    if (onAddReview) {
      await onAddReview({
        rating: parseInt(data.rating),
        comment: data.comment
      });
      reset();
      setShowReviewForm(false);
    }
  };

  const handleHelpful = (reviewId) => {
    setHelpfulReviews(prev => {
      const newSet = new Set(prev);
      if (newSet.has(reviewId)) {
        newSet.delete(reviewId);
      } else {
        newSet.add(reviewId);
      }
      return newSet;
    });
  };

  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="space-y-8">
      {/* Review Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Overall Rating */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-900 mb-2">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex justify-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-6 h-6 ${
                    i < Math.floor(averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-600">
              Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center space-x-3">
                <div className="flex items-center space-x-1 w-16">
                  <span className="text-sm text-gray-600 w-4">{stars}</span>
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-12 text-right">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review Button */}
        {isAuthenticated && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button
              onClick={() => setShowReviewForm(!showReviewForm)}
              variant="primary"
            >
              Write a Review
            </Button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
          <form onSubmit={handleSubmit(onSubmitReview)} className="space-y-4">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Rating *
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <input
                    key={star}
                    {...register('rating', { required: 'Rating is required' })}
                    type="radio"
                    value={star}
                    id={`star-${star}`}
                    className="hidden"
                  />
                ))}
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <label
                      key={star}
                      htmlFor={`star-${star}`}
                      className="cursor-pointer"
                    >
                      <Star className="w-8 h-8 text-gray-300 hover:text-yellow-400 transition-colors" />
                    </label>
                  ))}
                </div>
              </div>
              {errors.rating && (
                <p className="text-red-600 text-sm mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                {...register('comment', { 
                  required: 'Review is required',
                  minLength: { value: 10, message: 'Review must be at least 10 characters' }
                })}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-temu-red focus:border-transparent resize-none"
                placeholder="Share your experience with this product..."
              />
              {errors.comment && (
                <p className="text-red-600 text-sm mt-1">{errors.comment.message}</p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button type="submit">
                Submit Review
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowReviewForm(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {sortedReviews.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No reviews yet
            </h3>
            <p className="text-gray-600">
              Be the first to share your thoughts about this product!
            </p>
          </div>
        ) : (
          sortedReviews.map((review) => (
            <div key={review._id} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-4">
                {/* User Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-temu-blue rounded-full flex items-center justify-center text-white font-semibold">
                    {review.user?.name?.charAt(0) || <User className="w-6 h-6" />}
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-semibold text-gray-900">
                      {review.user?.name || 'Anonymous'}
                    </span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-500">
                      {formatRelativeTime(review.createdAt)}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center space-x-1 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Comment */}
                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  {/* Helpful Actions */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <button
                      onClick={() => handleHelpful(review._id)}
                      className={`flex items-center space-x-1 transition-colors ${
                        helpfulReviews.has(review._id)
                          ? 'text-temu-red'
                          : 'hover:text-gray-700'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span>Helpful ({helpfulReviews.has(review._id) ? 1 : 0})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
