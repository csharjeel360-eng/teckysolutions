import React, { useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Eye, Bookmark, Share2, MoreVertical } from 'lucide-react';
import { formatRelativeTime, generateExcerpt } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import useBlogs from '../../hooks/useBlogs';
import Notification from '../UI/Notification';

const BlogCard = ({ blog, featured = false, className = '', showDrafts = false, onEdit, onClick }) => {
  const {
    _id,
    slug,
    title = 'Untitled Blog Post',
    excerpt = '',
    featuredImage,
    author,
    readTime = 5,
    views = 0,
    likes = [],
    createdAt = new Date().toISOString(),
    tags = [],
    isPublished = true,
    status = 'published'
  } = blog || {};

  const { user, isAuthenticated } = useAuth();
  const { likeBlog, bookmarkBlog } = useBlogs();
  const [isLiked, setIsLiked] = useState(likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(likes?.length || 0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // Memoized values
  const isDraft = useMemo(() => status === 'draft', [status]);
  const safeSlug = useMemo(() => slug || _id || 'unknown', [slug, _id]);
  
  // Memoized image URL to prevent recalculation
  const imageUrl = useMemo(() => {
    if (featuredImage?.url) return featuredImage.url;
    if (featuredImage) return featuredImage;
    const colors = ['8B5CF6', '10B981', 'F59E0B', 'EF4444', '3B82F6'];
    const color = colors[title?.length % colors.length] || '8B5CF6';
    return `https://images.unsplash.com/photo-${Math.floor(15000000 + Math.random() * 9000000)}?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80&blend=${color}&blend-mode=multiply`;
  }, [featuredImage, title]);

  const handleLike = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated()) {
      setNotification({
        show: true,
        message: 'Please login to like blog posts',
        type: 'warning'
      });
      return;
    }

    try {
      setLoading(true);
      await likeBlog(_id);
      
      if (isLiked) {
        setLikesCount(prev => prev - 1);
      } else {
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to like post',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, isLiked, _id, likeBlog]);

  const handleBookmark = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsBookmarked(!isBookmarked);
    // Add your bookmark logic here
  }, [isBookmarked]);

  const handleShare = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: `${window.location.origin}/blog/${safeSlug}`,
        });
      } catch (error) {
        console.log('Sharing cancelled');
      }
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/blog/${safeSlug}`);
      setNotification({
        show: true,
        message: 'Link copied to clipboard!',
        type: 'success'
      });
    }
  }, [title, excerpt, safeSlug]);

  const getImageUrl = useCallback(() => imageUrl, [imageUrl]);

  if (!blog) return null;
  if (!showDrafts && (!isPublished || status === 'draft')) {
    return null;
  }

  return (
    <>
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
          position="top-center"
          duration={3000}
        />
      )}

      <article 
        className={`
          bg-white rounded-2xl overflow-hidden 
          border border-gray-200 shadow-lg hover:shadow-2xl 
          transition-all duration-300 ease-out
          group cursor-pointer
          flex flex-col h-full relative
          ${featured ? 'ring-2 ring-purple-500' : ''}
          ${isDraft ? 'border-dashed border-gray-400' : ''}
          ${className}
        `}
      >
        {/* Floating Action Buttons */}
        <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleBookmark}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
          >
            <Bookmark 
              className={`w-4 h-4 ${isBookmarked ? 'fill-current text-purple-600' : 'text-gray-600'}`} 
            />
          </button>
          <button
            onClick={handleShare}
            className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all hover:scale-110"
          >
            <Share2 className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <Link to={isDraft ? '#' : `/blog/${safeSlug}`} className="block flex-1">
          {/* Blog Image with Gradient Overlay */}
          <div className="relative w-full h-48 md:h-56 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-transparent to-pink-500/10 z-0"></div>
            <img
              src={imageUrl}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:rotate-1"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x450/8B5CF6/ffffff?text=${encodeURIComponent(title)}`;
              }}
            />
            
            {/* Gradient Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            {/* Views Counter */}
            <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1.5">
              <Eye className="w-3.5 h-3.5" />
              <span>{views.toLocaleString()}</span>
            </div>

            {/* Featured/Draft Badge */}
            {(featured || isDraft) && (
              <div className={`
                absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-semibold
                ${featured ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white' : ''}
                ${isDraft ? 'bg-gray-800 text-white' : ''}
              `}>
                {featured ? '✨ Featured' : '📝 Draft'}
              </div>
            )}

            {/* Tags Overlay */}
            {tags && tags.length > 0 && (
              <div className="absolute bottom-3 right-3 flex gap-2">
                {tags.slice(0, 2).map((tag, index) => (
                  <span
                    key={index}
                    className="bg-black/70 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Blog Content */}
          <div className="p-5 flex-1 flex flex-col">
            {/* Author and Time */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {author?.avatar ? (
                  <img 
                    src={author.avatar} 
                    alt={author.name}
                    className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {author?.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <span className="text-sm font-medium text-gray-900">{author?.name || 'Anonymous'}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    <span>{formatRelativeTime(createdAt)}</span>
                    <span className="mx-1">•</span>
                    <span>{readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors duration-200">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
              {generateExcerpt(excerpt || `Discover insights about ${title.toLowerCase()}`, 120)}
            </p>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-4 mt-auto border-t border-gray-100">
              <div className="flex items-center gap-4">
                {/* Like Button */}
                {!isDraft && (
                  <button
                    onClick={handleLike}
                    disabled={loading}
                    className={`
                      flex items-center gap-1.5 transition-all duration-200
                      ${isLiked 
                        ? 'text-red-500' 
                        : 'text-gray-500 hover:text-red-500 hover:scale-105'
                      }
                      ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    <Heart 
                      className={`w-5 h-5 ${isLiked ? 'fill-current animate-pulse' : ''}`} 
                    />
                    <span className="text-sm font-medium">{likesCount}</span>
                  </button>
                )}

                {/* Comment Count */}
                {!isDraft && (
                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <span>{Math.floor(views / 10)}</span>
                  </div>
                )}
              </div>

              {/* Read More / Edit Button */}
              {isDraft ? (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onEdit(blog);
                  }}
                  className="text-gray-700 hover:text-black text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Continue Editing →
                </button>
              ) : (
                <Link 
                  to={`/blog/${safeSlug}`}
                  className="text-purple-600 hover:text-purple-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-purple-50 transition-all duration-200 group/link inline-flex items-center gap-1"
                >
                  Read More
                  <svg className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        </Link>

        {/* Progress Bar for Read Time (Optional) */}
        {!isDraft && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
        )}
      </article>
    </>
  );
};

export default React.memo(BlogCard);