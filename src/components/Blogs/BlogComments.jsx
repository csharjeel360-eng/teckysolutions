import React from 'react';
import { useForm } from 'react-hook-form';
import { Send, MoreVertical } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers';
import Button from '../UI/Button';

const BlogComments = ({ 
  blogId,
  comments = [], 
  onCommentAdded,
  currentUser,
  loading,
  isAuthenticated 
}) => {
  const {
    register: registerComment,
    handleSubmit: handleSubmitComment,
    reset: resetComment,
    formState: { errors: commentErrors, isSubmitting: commentSubmitting }
  } = useForm();

  const onSubmitComment = async (data) => {
    if (onCommentAdded && data.comment.trim()) {
      await onCommentAdded(data.comment.trim());
      resetComment();
    }
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900">
          Comments ({comments.length})
        </h3>
      </div>

      {/* Add Comment Form */}
      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment(onSubmitComment)} className="mb-6 sm:mb-8">
          <div className="flex space-x-3 sm:space-x-4">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                {currentUser?.name?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="flex-1">
              <textarea
                {...registerComment('comment', { 
                  required: 'Comment is required',
                  minLength: { value: 2, message: 'Comment must be at least 2 characters' },
                  maxLength: { value: 1000, message: 'Comment must be less than 1000 characters' }
                })}
                placeholder="Share your thoughts..."
                rows="3"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-xl sm:rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm sm:text-base"
                disabled={commentSubmitting || loading}
              />
              {commentErrors.comment && (
                <p className="text-red-600 text-xs sm:text-sm mt-1">{commentErrors.comment.message}</p>
              )}
              <div className="flex justify-end mt-2 sm:mt-3">
                <Button 
                  type="submit" 
                  size="small" 
                  className="flex items-center space-x-2 text-xs sm:text-sm"
                  disabled={commentSubmitting || loading}
                >
                  <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>{commentSubmitting ? 'Posting...' : 'Post Comment'}</span>
                </Button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center mb-6 sm:mb-8">
          <p className="text-gray-700 text-sm sm:text-base mb-3">Please log in to leave a comment</p>
          <Button 
            onClick={() => window.location.href = '/login'}
            variant="primary"
            size="small"
            className="text-xs sm:text-sm"
          >
            Sign In
          </Button>
        </div>
      )}

      {/* Comments List (no replies, no likes) */}
      <div className="space-y-4 sm:space-y-6">
        {comments.length === 0 ? (
          <div className="text-center py-6 sm:py-8 text-gray-500 text-sm sm:text-base">
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id || comment.id} className="border-b border-gray-100 pb-4 sm:pb-6 last:border-b-0">
              <div className="flex space-x-3 sm:space-x-4">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base">
                    {comment.user?.name?.charAt(0) || 'U'}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1 sm:mb-2">
                    <div className="min-w-0">
                      <span className="font-semibold text-gray-900 text-sm sm:text-base truncate block">
                        {comment.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-gray-500 text-xs sm:text-sm ml-0 sm:ml-2 block sm:inline-block mt-1 sm:mt-0">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 ml-2" aria-hidden>
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base mb-2 sm:mb-3 break-words">{comment.comment}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BlogComments;
