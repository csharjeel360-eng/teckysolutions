 import React from 'react';
import BlogCard from './BlogCard';
import EmptyState from '../Common/EmptyState';
import LoadingSpinner from '../Layout/LoadingSpinner';
import  useBlogs  from '../../hooks/useBlogs';

const BlogGrid = ({ 
  blogs = [], 
  loading = false, 
  error = null,
  columns = 3,
  featuredFirst = false,
  showFeaturedSection = true,
  className = '',
  emptyStateProps = {},
  onBlogClick
}) => {
  const { getPopularBlogs } = useBlogs();

  // Show loading state
  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <LoadingSpinner size="large" text="Loading blogs..." />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <EmptyState
        title="Error Loading Blogs"
        message={typeof error === 'string' ? error : 'Failed to load blog posts. Please try again.'}
        icon="❌"
        actionText="Try Again"
        onAction={() => window.location.reload()}
        {...emptyStateProps}
      />
    );
  }

  // Show empty state
  if (!blogs || blogs.length === 0) {
    return (
      <EmptyState
        title="No Blog Posts Yet"
        message="We're working on creating amazing content for you. Check back soon for new blog posts!"
        icon="📝"
        actionText="Browse Listings"
        onAction={() => window.location.href = '/listings'}
        {...emptyStateProps}
      />
    );
  }

  // Separate featured and regular blogs
  const featuredBlogs = featuredFirst ? blogs.filter(blog => blog?.isFeatured) : [];
  const regularBlogs = featuredFirst 
    ? blogs.filter(blog => !blog?.isFeatured)
    : blogs;

  // Get popular blogs for featured section
  const popularBlogs = showFeaturedSection ? getPopularBlogs() : [];

  // Grid column configurations
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
    6: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6'
  };

  // Handle blog click
  const handleBlogClick = (blog) => {
    if (onBlogClick) {
      onBlogClick(blog);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Featured Blogs Section */}
      {showFeaturedSection && featuredBlogs.length > 0 && (
        <section className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Stories</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our most popular and insightful blog posts
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredBlogs.slice(0, 2).map((blog, index) => (
              <BlogCard 
                key={blog?._id || index} 
                blog={blog} 
                featured={true}
                className={index === 0 ? 'lg:col-span-2' : ''}
                onClick={() => handleBlogClick(blog)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Removed Trending Now / Popular Blogs section as requested */}

      {/* Main Blogs Grid */}
      <section className="space-y-6">
        {showFeaturedSection && (
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {featuredFirst && featuredBlogs.length > 0 ? 'More Articles' : 'Latest Blog Posts'}
            </h2>
            <span className="text-gray-500 text-sm">
              {regularBlogs.length} {regularBlogs.length === 1 ? 'article' : 'articles'}
            </span>
          </div>
        )}
        
        <div className={`grid ${gridCols[columns]} gap-6`}>
          {regularBlogs.map((blog, index) => (
            <BlogCard 
              key={blog?._id || index} 
              blog={blog} 
              onClick={() => handleBlogClick(blog)}
            />
          ))}
        </div>
      </section>

      {/* Load More Section (if needed) */}
      {blogs.length > 12 && (
        <div className="text-center pt-8 border-t border-gray-200">
          <button className="bg-white text-gray-700 border border-gray-300 hover:border-gray-400 px-8 py-3 rounded-lg font-medium transition-colors">
            Load More Articles
          </button>
          <p className="text-sm text-gray-500 mt-2">
            Showing {blogs.length} of many amazing articles
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(BlogGrid);
