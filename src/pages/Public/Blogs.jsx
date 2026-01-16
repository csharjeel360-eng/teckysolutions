 import React, { useEffect, useState } from 'react';
import useBlogs from '../../hooks/useBlogs';
import BlogGrid from '../../components/Blogs/BlogGrid';
import SearchBar from '../../components/UI/SearchBar';
import Pagination from '../../components/UI/Pagination';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { FileText, Search, RefreshCw } from 'lucide-react';
import { setPageTitle } from '../../utils/slugify';

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
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage] = useState(9);

  // Handle search with debounce
  useEffect(() => {
    setPageTitle('Blogs');
    
    const timeoutId = setTimeout(() => {
      setSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, setSearch]);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Get only published blogs for public view
  const publishedBlogs = blogs?.filter(blog => 
    blog?.status === 'published' && blog?.isActive !== false
  ) || [];

  // Get current blogs for pagination
  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = publishedBlogs.slice(indexOfFirstBlog, indexOfLastBlog);
  const totalPages = Math.ceil(publishedBlogs.length / blogsPerPage);

  // Build JSON-LD schema for blogs
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Our Blog",
    "url": typeof window !== 'undefined' ? window.location.href : '',
    "blogPost": currentBlogs.map(blog => ({
      "@type": "BlogPosting",
      "headline": blog.title,
      "image": blog.coverImage || "",
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt || blog.createdAt,
      "author": {
        "@type": "Person",
        "name": blog.author || "Admin"
      },
      "description": blog.excerpt || blog.description
    }))
  };

  // Inject JSON-LD schema into document head
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify(blogSchema);
    document.head.appendChild(script);
    return () => script.remove();
  }, [blogSchema]);

  // Update SEO meta tags
  useEffect(() => {
    const title = filters?.search
      ? `Search "${filters.search}" | Blog`
      : 'Blog – News, Tips & Insights';
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Read the latest blog posts, product guides, expert tips, and industry insights. Stay informed with our up-to-date articles.';

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = typeof window !== 'undefined' ? window.location.href : '';

    // Update robots meta tag for search pages
    let robots = document.querySelector('meta[name="robots"]');
    if (filters?.search) {
      if (!robots) {
        robots = document.createElement('meta');
        robots.name = 'robots';
        document.head.appendChild(robots);
      }
      robots.content = 'noindex, follow';
    } else if (robots) {
      robots.remove();
    }
  }, [filters?.search]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="large" />
          </div>
        </div>
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="bg-gray-100 p-3 rounded-full">
              <FileText className="w-8 h-8 text-black" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Blog</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the latest news, tips, and insights about our products and industry.
            Stay updated with expert advice and shopping guides.
          </p>
          
          {/* Blog Stats */}
          <div className="mt-6 text-sm text-gray-500">
            Showing {publishedBlogs.length} of {blogs?.length || 0} blog post{publishedBlogs.length !== 1 ? 's' : ''}
            {publishedBlogs.length !== blogs?.length && (
              <span className="text-orange-600 ml-2">
                ({blogs?.length - publishedBlogs.length} drafts hidden)
              </span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8">
          <SearchBar
            placeholder="Search blog posts..."
            value={searchTerm}
            onChange={setSearchTerm}
            icon={<Search className="w-5 h-5" />}
          />
        </div>

        {/* Blog Grid */}
        {currentBlogs.length > 0 ? (
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
                blogs={currentBlogs}
                className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              />
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showPageNumbers={true}
                />
              </div>
            )}
          </>
        ) : (
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
        )}

        {/* Newsletter Signup removed per request */}
      </div>
    </div>
  );
};

export default Blogs;