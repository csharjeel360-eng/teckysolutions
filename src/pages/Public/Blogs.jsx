 import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import useBlogs from '../../hooks/useBlogs';
import BlogGrid from '../../components/Blogs/BlogGrid';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { Search, RefreshCw } from 'lucide-react';
import { setPageTitle } from '../../utils/slugify';

// Lazy load SearchBar to reduce initial bundle size
const SearchBar = lazy(() => import('../../components/UI/SearchBar'));

const Blogs = () => {
  const { 
    blogs = [], 
    loading, 
    error, 
    filters,
    setSearch,
    fetchBlogs 
  } = useBlogs();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [displayCount, setDisplayCount] = useState(2); // Reduced to 2 for ultra-fast initial load
  const [loadMoreRef, setLoadMoreRef] = useState(null);

  // Handle search with debounce
  useEffect(() => {
    setPageTitle('Blogs');
    
    const timeoutId = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setSearch]);

  // Reset display count when search changes
  useEffect(() => {
    setDisplayCount(10);
  }, [searchTerm]);

  // Get only published blogs for public view
  const publishedBlogs = useMemo(() => 
    blogs?.filter(blog => 
      blog?.status === 'published' && blog?.isActive !== false
    ) || []
  , [blogs]);

  // Get blogs to display (only first displayCount)
  const displayedBlogs = useMemo(() => 
    publishedBlogs.slice(0, displayCount)
  , [publishedBlogs, displayCount]);

  // Memoize schema to prevent unnecessary re-renders - Only first 5 blogs for faster generation
  const blogSchema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Our Blog",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "blogPost": publishedBlogs.slice(0, 3).map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title || '',
      "image": blog.featuredImage?.url || blog.featuredImage || "",
      "datePublished": blog.createdAt || '',
      "dateModified": blog.updatedAt || blog.createdAt || '',
      "author": {
        "@type": "Person",
        "name": blog.author?.name || "Admin"
      }
    }))
  }), [publishedBlogs]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && displayCount < publishedBlogs.length) {
          // Load 4 more blogs when user scrolls to bottom
          setDisplayCount(prev => Math.min(prev + 4, publishedBlogs.length));
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef);
    return () => observer.disconnect();
  }, [loadMoreRef, displayCount, publishedBlogs.length]);

  // Inject JSON-LD schema into document head (lazy - only when schema actually changes)
  useEffect(() => {
    if (publishedBlogs.length === 0) return; // Skip if no blogs
    
    const timeoutId = setTimeout(() => {
      const existingScript = document.querySelector('script[data-blog-schema]');
      if (existingScript) existingScript.remove();
      
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-blog-schema', 'true');
      script.innerHTML = JSON.stringify(blogSchema);
      document.head.appendChild(script);
      return () => {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script);
        }
      };
    }, 1000); // Defer to 1s to prioritize initial render
    
    return () => clearTimeout(timeoutId);
  }, [blogSchema, publishedBlogs.length]);

  // Update SEO meta tags (deferred to avoid blocking)
  useEffect(() => {
    if (publishedBlogs.length === 0) return;
    
    const timeoutId = setTimeout(() => {
      const title = filters?.search
        ? `Search "${filters.search}" | Blog`
        : 'Blog – News, Tips & Insights';
      document.title = title;
    }, 100);
    
    return () => clearTimeout(timeoutId);
  }, [filters?.search, publishedBlogs.length]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="large" showBrand={true} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto py-12">
            <div className="text-red-600 text-xl mb-4">
              Error loading blogs
            </div>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={fetchBlogs}
              className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors flex items-center mx-auto"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with banner background */}
      <section
        className="relative overflow-hidden text-white py-16 sm:py-20"
        style={{
          backgroundImage: `url('/homeherobanner/futuristic-tech-hero-banner-dark-blue-teal.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45))' }}
        />
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our Blog
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover the latest news, tips, and insights about our products and industry.
            Stay updated with expert advice and shopping guides.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <Suspense fallback={<div className="h-10 bg-gray-200 rounded-lg animate-pulse" />}>
            <SearchBar
              placeholder="Search blog posts..."
              value={searchTerm}
              onChange={setSearchTerm}
              icon={<Search className="w-5 h-5" />}
            />
          </Suspense>
        </div>

        {/* Blog Grid */}
        {publishedBlogs.length > 0 && !loading ? (
          <>
            {/* Search Results Info */}
            {filters?.search && (
              <div className="text-center mb-6">
                <p className="text-gray-600">
                  Found {publishedBlogs.length} result{publishedBlogs.length !== 1 ? 's' : ''} for "{filters.search}"
                </p>
              </div>
            )}

            <div className="mb-8">
              <BlogGrid 
                blogs={displayedBlogs}
                loading={false}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              />
            </div>

            {/* Load More Indicator */}
            {displayCount < publishedBlogs.length && (
              <div 
                ref={setLoadMoreRef}
                className="flex justify-center py-8"
              >
                <div className="text-center">
                  <div className="inline-block">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm">
                    Showing {displayCount} of {publishedBlogs.length} blogs
                  </p>
                </div>
              </div>
            )}

            {/* Reached End Message */}
            {displayCount >= publishedBlogs.length && publishedBlogs.length > 10 && (
              <div className="text-center py-8 text-gray-600">
                <p className="font-medium">You've reached the end of our blog posts</p>
              </div>
            )}
          </>
        ) : !loading && publishedBlogs.length === 0 ? (
          <EmptyState
            title={
              filters?.search 
                ? "No matching blog posts found" 
                : publishedBlogs.length === 0 
                  ? "No published blog posts" 
                  : "No blogs to display"
            }
            message={
              filters?.search 
                ? "Try adjusting your search terms or browse all our blog posts."
                : publishedBlogs.length === 0
                  ? "All blog posts are currently in draft mode. Please check back later."
                  : "There are no blog posts matching your current filters."
            }
            icon="📝"
            action={
              filters?.search ? (
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setSearch('');
                  }}
                  className="bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  View All Blogs
                </button>
              ) : null
            }
          />
        ) : null}

        {/* Newsletter Signup removed per request */}
      </div>
    </div>
  );
};

export default Blogs;