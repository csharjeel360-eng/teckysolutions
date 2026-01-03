import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, Eye } from 'lucide-react';
import { formatRelativeTime, generateExcerpt } from '../../utils/helpers';
import { useAuth } from '../../context/AuthContext';
import useBlogs from '../../hooks/useBlogs';
import Notification from '../UI/Notification';

const BlogCard = ({ blog, featured = false, className = '', showDrafts = false, onEdit }) => {
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
  const { likeBlog } = useBlogs();
  const [isLiked, setIsLiked] = useState(likes?.includes(user?._id) || false);
  const [likesCount, setLikesCount] = useState(likes?.length || 0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const handleLike = async (e) => {
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
  };

  const getImageUrl = () => {
    if (featuredImage?.url) return featuredImage.url;
    if (featuredImage) return featuredImage;
    const colors = ['2563eb', 'f97316', '059669', '7c3aed'];
    const color = colors[title?.length % colors.length] || '2563eb';
    return `https://via.placeholder.com/400x250/${color}/ffffff?text=${encodeURIComponent(title)}`;
  };

  if (!blog) return null;
  if (!showDrafts && (!isPublished || status === 'draft')) {
    return null;
  }

  const isDraft = status === 'draft';
  const safeSlug = slug || _id || 'unknown';

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
          bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 
          overflow-hidden border border-gray-100 group
          flex flex-col h-full
          ${featured ? 'border-2 border-black' : ''}
          ${isDraft ? 'border-black' : ''}
          ${className}
        `}
      >
        <Link to={isDraft ? '#' : `/blog/${safeSlug}`} className="block">
          {/* Blog Image */}
          <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 overflow-hidden bg-gray-100">
            <img
              src={getImageUrl()}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/800x450/2563eb/ffffff?text=${encodeURIComponent(title)}`;
              }}
            />
            
            {/* Views Counter */}
            <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>{views.toLocaleString()}</span>
            </div>

            {/* Featured Badge */}
            {featured && !isDraft && (
              <div className="absolute top-2 left-2 bg-black text-white px-2 py-1 rounded text-xs font-semibold">
                Featured
              </div>
            )}

            {/* Draft Badge */}
            {isDraft && (
              <div className="absolute top-2 left-2 bg-gray-600 text-white px-2 py-1 rounded text-xs font-semibold">
                Draft
              </div>
            )}
          </div>
        </Link>

        {/* Blog Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Meta Information */}
          <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{readTime} min</span>
            </div>
            <span>•</span>
            <span>{formatRelativeTime(createdAt)}</span>
          </div>

          {/* Title */}
          {isDraft ? (
            <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">
              {title}
            </h3>
          ) : (
            <Link to={`/blog/${safeSlug}`}>
              <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-black transition-colors duration-200">
                {title}
              </h3>
            </Link>
          )}

          {/* Excerpt */}
          <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed flex-1">
            {generateExcerpt(excerpt || `Read more about ${title}`, 80)}
          </p>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {tags.slice(0, 2).map((tag, index) => (
                <span
                  key={index}
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    isDraft 
                      ? 'bg-gray-100 text-gray-700' 
                      : 'bg-black/10 text-black'
                  }`}
                >
                  #{tag}
                </span>
              ))}
              {tags.length > 2 && (
                <span className="text-gray-400 text-xs flex items-center">
                  +{tags.length - 2}
                </span>
              )}
            </div>
          )}

          {/* Stats and Actions */}
          <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-100">
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {/* Like Button */}
              {!isDraft && (
                <button
                  onClick={handleLike}
                  disabled={loading}
                  className={`
                    flex items-center space-x-1 transition-all duration-200
                    ${isLiked 
                      ? 'text-red-500' 
                      : 'text-gray-500 hover:text-red-500'
                    }
                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <Heart 
                    className={`w-3 h-3 ${isLiked ? 'fill-current' : ''}`} 
                  />
                  <span>{likesCount}</span>
                </button>
              )}

              {/* Author */}
              {author && (
                <span className="text-gray-600">By {author.name}</span>
              )}
            </div>

            {/* Read More Link */}
            {!isDraft && (
              <Link 
                to={`/blog/${safeSlug}`}
                className="text-black hover:text-gray-700 text-xs font-medium transition-colors"
              >
                Read →
              </Link>
            )}

            {/* Edit Button for Drafts */}
            {isDraft && onEdit && (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(blog);
                }}
                className="text-gray-700 hover:text-black text-xs font-medium transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default BlogCard;
