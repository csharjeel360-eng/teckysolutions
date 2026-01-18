import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import { useParams, Link } from 'react-router-dom';
import useBlogs from '../../hooks/useBlogs';
import useSEO from '../../hooks/useSEO';
import { useAuth } from '../../context/AuthContext';
import BlogComments from '../../components/Blogs/BlogComments';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import { Clock, Heart, Eye, MessageCircle, Share2, ArrowLeft, Calendar, User, Home, Tag } from 'lucide-react';
import { setPageTitle } from '../../utils/slugify';

const BlogDetail = () => {
  const { slug } = useParams();
  const { getBlogBySlug, likeBlog, addComment, getRelatedBlogs } = useBlogs();
  const { user, isAuthenticated } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [actionLoading, setActionLoading] = useState(false);
  const [loadingRelated, setLoadingRelated] = useState(false);

  // Fetch blog data with optimization
  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch main blog
        const result = await getBlogBySlug(slug);
        
        if (result?.success && result.data) {
          const blogData = result.data;
          
          if (blogData.status !== 'published' || blogData.isActive === false) {
            setError('This blog post is not available');
            setBlog(null);
            return;
          }
          
          setBlog(blogData);
          setPageTitle(blogData.title);
          
          if (user && blogData.likes) {
            const userLiked = Array.isArray(blogData.likes) 
              ? blogData.likes.includes(user._id)
              : blogData.likes.some(like => like._id === user._id || like === user._id);
            setIsLiked(userLiked);
          }
          
          // Lazy load related blogs after initial render
          setTimeout(() => fetchRelatedBlogs(blogData), 500);
        } else {
          const errorMsg = result?.error || 'Blog post not found';
          setError(errorMsg);
        }
      } catch (err) {
        console.error('❌ BlogDetail: Fetch error:', err);
        setError('Failed to load blog post');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchBlogData();
    }
  }, [slug, getBlogBySlug, user]);

  const fetchRelatedBlogs = useCallback(async (blogData) => {
    try {
      setLoadingRelated(true);
      const tags = blogData.tags || [];
      if (tags.length > 0 && typeof getRelatedBlogs === 'function') {
        const result = await getRelatedBlogs(blogData._id, tags);
        if (result?.success && result.data) {
          setRelatedBlogs(result.data.slice(0, 3)); // Show max 3 related blogs
        }
      }
    } catch (err) {
      console.error('Error fetching related blogs:', err);
    } finally {
      setLoadingRelated(false);
    }
  }, [getRelatedBlogs]);

  // Generate structured data for the blog - memoized and lazy-loaded
  const structuredData = useMemo(() => {
    if (!blog) return null;

    const baseData = {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": blog.title,
      "description": blog.excerpt || blog.title,
      "image": blog.featuredImage?.url ? [blog.featuredImage.url] : [],
      "author": {
        "@type": "Person",
        "name": blog.author?.name || "Admin"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Your Store Name",
        "logo": {
          "@type": "ImageObject",
          "url": `${window.location.origin}/logo.png`,
          "width": 600,
          "height": 60
        }
      },
      "datePublished": blog.createdAt,
      "dateModified": blog.updatedAt || blog.createdAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": window.location.href
      },
      "wordCount": blog.wordCount || (blog.content?.split(/\s+/).length || 0),
      "timeRequired": `PT${blog.readTime || 5}M`,
      "articleBody": blog.content?.substring(0, 5000) || blog.excerpt,
      "url": window.location.href
    };

    if (blog.tags && blog.tags.length > 0) {
      baseData.keywords = blog.tags.join(', ');
    }

    return baseData;
  }, [blog]);

  // Generate breadcrumb structured data
  const breadcrumbStructuredData = useMemo(() => {
    return {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": window.location.origin
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": `${window.location.origin}/blogs`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": blog?.title || 'Blog Post',
          "item": window.location.href
        }
      ]
    };
  }, [blog]);

  // Inject schema into DOM only after initial render
  useEffect(() => {
    if (!structuredData) return;

    const timeoutId = setTimeout(() => {
      const existingScript = document.querySelector('[data-blog-schema="true"]');
      if (existingScript) existingScript.remove();

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-blog-schema', 'true');
      script.innerHTML = JSON.stringify(structuredData);
      document.head.appendChild(script);

      // Cleanup
      return () => {
        script.remove();
      };
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [structuredData]);

  const renderBlogContent = () => {
    if (!blog) {
      return <div className="text-red-500 p-4 border border-red-300">No blog data available</div>;
    }

    if (blog.processedContent && blog.processedContent.trim()) {
      const decodeEntities = (input) => {
        if (!input || typeof input !== 'string') return input;
        let str = input;
        let prev;
        do {
          prev = str;
          str = str.replace(/&amp;/g, '&')
                   .replace(/&lt;/g, '<')
                   .replace(/&gt;/g, '>')
                   .replace(/&quot;/g, '"')
                   .replace(/&#39;/g, "'")
                   .replace(/&nbsp;/g, ' ');
          str = str.replace(/&#(\d+);/g, (m, code) => String.fromCharCode(parseInt(code, 10)));
          str = str.replace(/&#x([0-9a-fA-F]+);/g, (m, code) => String.fromCharCode(parseInt(code, 16)));
        } while (str !== prev);
        return str;
      };

      let processedHtml = decodeEntities(blog.processedContent);
      
      // Replace color tags
      processedHtml = processedHtml.replace(
        /\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, 
        '<span style="color: $1 !important;">$2</span>'
      );
      
      // Convert h1 tags inside content to h2 to maintain proper hierarchy
      processedHtml = processedHtml.replace(/<h1[^>]*>/g, '<h2>').replace(/<\/h1>/g, '</h2>');

      return (
        <div 
          className="blog-content prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: processedHtml }} 
        />
      );
    }

    if (blog.content && blog.content.trim()) {
      return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <pre className="whitespace-pre-wrap text-gray-700 font-sans">
            {blog.content}
          </pre>
          <p className="text-sm text-gray-500 mt-4 italic">
            Note: This content is displaying in raw format. The formatted version should be available soon.
          </p>
        </div>
      );
    }

    return (
      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
        <p>No content available for this blog post.</p>
      </div>
    );
  };

  const handleLike = useCallback(async () => {
    if (!blog || !isAuthenticated) {
      showNotification('Please login to like blog posts', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      const result = await likeBlog(blog._id);
      
      if (result?.success) {
        const updatedBlog = result.data || {};
        setBlog(prev => ({
          ...prev,
          likes: updatedBlog.likes || prev.likes,
          likesCount: updatedBlog.likesCount || prev.likesCount
        }));
        
        setIsLiked(!isLiked);
        showNotification(isLiked ? 'Post unliked' : 'Post liked!', 'success');
      }
    } catch (err) {
      console.error('Error liking blog:', err);
      showNotification('Failed to like post', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [blog, isAuthenticated, isLiked, likeBlog]);

  const handleAddComment = useCallback(async (commentText) => {
    if (!blog || !isAuthenticated) {
      showNotification('Please login to add comments', 'warning');
      return;
    }

    if (!commentText.trim()) {
      showNotification('Please enter a comment', 'warning');
      return;
    }

    try {
      setActionLoading(true);
      const result = await addComment(blog._id, commentText);
      
      if (result?.success) {
        const newComment = result.data;
        
        setBlog(prev => ({
          ...prev,
          comments: [...(prev.comments || []), newComment],
          commentsCount: (prev.commentsCount || 0) + 1
        }));
        
        showNotification('Comment added successfully', 'success');
      }
    } catch (err) {
      console.error('Error adding comment:', err);
      showNotification('Failed to add comment', 'error');
    } finally {
      setActionLoading(false);
    }
  }, [blog, isAuthenticated, addComment]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.excerpt,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => {
          showNotification('Link copied to clipboard!', 'success');
        })
        .catch(console.error);
    }
  }, [blog?.title, blog?.excerpt]);

  const showNotification = useCallback((message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
  }, []);

  const getLikesCount = useCallback(() => {
    if (!blog) return 0;
    return blog.likesCount || blog.likes?.length || 0;
  }, [blog]);

  const getCommentsCount = useCallback(() => {
    if (!blog) return 0;
    return blog.commentsCount || blog.comments?.length || 0;
  }, [blog]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="large" showBrand={true} brandText="TrendyBreeze" />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="text-red-600 text-xl mb-4">{error || 'Blog post not found'}</div>
          <Link to="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Notification */}
          {notification.show && (
            <Notification
              type={notification.type}
              message={notification.message}
              onClose={() => setNotification({ ...notification, show: false })}
              duration={3000}
            />
          )}

          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li>
                <Link 
                  to="/blogs" 
                  className="hover:text-gray-900 transition-colors"
                  aria-label="Blogs"
                >
                  Blogs
                </Link>
              </li>
              <li aria-hidden="true" className="text-gray-400">/</li>
              <li 
                className="text-gray-900 font-medium truncate max-w-[200px] md:max-w-none"
                aria-current="page"
              >
                {blog.title}
              </li>
            </ol>
          </nav>

          {/* Back Button */}
          <div className="mb-6">
            <Link to="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blogs
            </Link>
          </div>

          {/* Blog Article */}
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Featured Image with SEO optimization */}
            {blog.featuredImage?.url && (
              <div className="w-full h-64 md:h-96 overflow-hidden" aria-label="Featured image">
                <img
                  src={blog.featuredImage.url}
                  alt={blog.title}
                  loading="lazy"
                  width="1200"
                  height="630"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://via.placeholder.com/1200x630/4ecdc4/ffffff?text=${encodeURIComponent(blog.title)}`;
                  }}
                />
              </div>
            )}

            <div className="p-6 md:p-8">
              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-1" aria-label="Publication date">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={blog.createdAt}>
                    {new Date(blog.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <div className="flex items-center gap-1" aria-label="Read time">
                  <Clock className="w-4 h-4" />
                  <span>{blog.readTime || 5} min read</span>
                </div>
                <div className="flex items-center gap-1" aria-label="View count">
                  <Eye className="w-4 h-4" />
                  <span>{blog.views || 0} views</span>
                </div>
                {blog.author && (
                  <div className="flex items-center gap-1" aria-label="Author">
                    <User className="w-4 h-4" />
                    <span>By {blog.author.name}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {blog.title}
              </h1>

              {/* Excerpt */}
              {blog.excerpt && (
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {blog.excerpt}
                </p>
              )}

              {/* Tags */}
              {blog.tags && blog.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6" aria-label="Tags">
                  <Tag className="w-4 h-4 text-gray-500 mt-1" />
                  {blog.tags.map((tag, index) => (
                    <Link
                      key={index}
                      to={`/blogs?tag=${encodeURIComponent(tag)}`}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition-colors"
                      aria-label={`View all posts tagged ${tag}`}
                    >
                      #{tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Blog Content */}
              <div className="mt-8">
                {renderBlogContent()}
              </div>

              {/* Social Sharing Actions */}
              <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleLike}
                  disabled={actionLoading || !isAuthenticated}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>Like ({getLikesCount()})</span>
                </button>
                
                <button 
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  aria-label="View comments"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Comment ({getCommentsCount()})</span>
                </button>
                
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Share this post"
                >
                  <Share2 className="w-5 h-5" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </article>

          {/* Comments Section */}
          <div className="mt-8">
            <BlogComments
              blogId={blog._id}
              comments={blog.comments || []}
              onCommentAdded={handleAddComment}
              currentUser={user}
              loading={actionLoading}
              isAuthenticated={isAuthenticated}
            />
          </div>

          {/* Related Articles Section - Important for Internal Linking */}
          {relatedBlogs.length > 0 && (
            <section className="mt-12" aria-labelledby="related-articles-heading">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 id="related-articles-heading" className="text-2xl font-bold text-gray-900 mb-6">
                  Related Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedBlogs.map((relatedBlog) => (
                    <article 
                      key={relatedBlog._id} 
                      className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                      {relatedBlog.featuredImage?.url && (
                        <Link 
                          to={`/blogs/${relatedBlog.slug}`}
                          aria-label={`Read ${relatedBlog.title}`}
                        >
                          <img
                            src={relatedBlog.featuredImage.url}
                            alt={relatedBlog.title}
                            loading="lazy"
                            width="400"
                            height="200"
                            className="w-full h-40 object-cover"
                          />
                        </Link>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-lg mb-2">
                          <Link 
                            to={`/blogs/${relatedBlog.slug}`}
                            className="text-gray-900 hover:text-blue-600 transition-colors"
                            aria-label={`Read: ${relatedBlog.title}`}
                          >
                            {relatedBlog.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {relatedBlog.excerpt || relatedBlog.content?.substring(0, 100) + '...'}
                        </p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{relatedBlog.readTime || 3} min read</span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Browse More Section */}
          <section className="mt-8 text-center">
            <Link
              to="/blogs"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
              aria-label="Browse all blog posts"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse All Articles
            </Link>
          </section>
        </div>

        {/* Add CSS styles for blog content */}
        <style>{`
          .blog-content {
            line-height: 1.8;
            color: #374151;
          }
          
          .blog-content h1 {
            font-size: 2.25rem;
            font-weight: bold;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            color: #111827;
            line-height: 1.2;
          }
          
          .blog-content h2 {
            font-size: 1.875rem;
            font-weight: bold;
            margin-top: 2.5rem;
            margin-bottom: 1rem;
            color: #111827;
            line-height: 1.3;
          }
          
          .blog-content h3 {
            font-size: 1.5rem;
            font-weight: bold;
            margin-top: 2rem;
            margin-bottom: 0.75rem;
            color: #111827;
            line-height: 1.4;
          }
          
          .blog-content h4 {
            font-size: 1.25rem;
            font-weight: bold;
            margin-top: 1.5rem;
            margin-bottom: 0.5rem;
            color: #374151;
            line-height: 1.4;
          }
          
          .blog-content p {
            margin-bottom: 1.5rem;
            line-height: 1.8;
            font-size: 1.125rem;
          }
          
          .blog-content ul {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
          }
          
          .blog-content ol {
            margin: 1.5rem 0;
            padding-left: 1.5rem;
          }
          
          .blog-content li {
            margin-bottom: 0.75rem;
            line-height: 1.6;
            font-size: 1.125rem;
          }
          
          .blog-content blockquote {
            border-left: 4px solid #3b82f6;
            padding-left: 1.5rem;
            margin: 1.5rem 0;
            font-style: italic;
            color: #6b7280;
            background-color: #eff6ff;
            padding: 1.5rem;
            border-radius: 0 1rem 1rem 0;
            font-size: 1.125rem;
          }
          
          .blog-content code:not(pre code) {
            background-color: #f3f4f6;
            padding: 0.25rem 0.5rem;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            border: 1px solid #e5e7eb;
            color: #1f2937;
          }
          
          .blog-content pre {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 1.5rem;
            border-radius: 0.75rem;
            overflow-x: auto;
            margin: 1.5rem 0;
            border: 1px solid #374151;
          }
          
          .blog-content pre code {
            background: none;
            padding: 0;
            color: inherit;
            border: none;
            font-size: 0.875rem;
          }
          
          .blog-content a {
            color: black;
            text-decoration: underline;
            transition: color 0.2s ease;
          }
          
          .blog-content a:hover {
            color: #1d4ed8;
          }
          
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.75rem;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
            loading: lazy;
          }
          
          .blog-content strong {
            font-weight: 700;
            color: #111827;
          }
          
          .blog-content em {
            font-style: italic;
            color: #4b5563;
          }
          
          .blog-content span[style*="color"] {
            font-weight: inherit !important;
            font-size: inherit !important;
            line-height: inherit !important;
          }
          
          .blog-image-container {
            margin: 2rem 0;
          }
          
          /* Line clamp utility for truncating text */
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
       
     </main>    
   </>
  );
};

export default BlogDetail;