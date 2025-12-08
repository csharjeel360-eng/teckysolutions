import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useBlogs from '../../hooks/useBlogs';
import { useAuth } from '../../context/AuthContext';
import BlogComments from '../../components/Blogs/BlogComments';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Notification from '../../components/Common/Notification';
import { Clock, Heart, Eye, MessageCircle, Share2, ArrowLeft, Calendar, User } from 'lucide-react';
import { setPageTitle } from '../../utils/slugify';

const BlogDetail = () => {
  const { slug } = useParams();
  const { getBlogBySlug, likeBlog, addComment } = useBlogs();
  const { user, isAuthenticated } = useAuth();
  
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError('');
        const result = await getBlogBySlug(slug);
        
        if (result?.success && result.data) {
          const blogData = result.data;
          
          // Blog data received

          if (blogData.status !== 'published' || blogData.isActive === false) {
            setError('This blog post is not available');
            setBlog(null);
            return;
          }
          
          setBlog(blogData);
          // Set page title with blog title
          setPageTitle(blogData.title);
          
          if (user && blogData.likes) {
            const userLiked = Array.isArray(blogData.likes) 
              ? blogData.likes.includes(user._id)
              : blogData.likes.some(like => like._id === user._id || like === user._id);
            setIsLiked(userLiked);
          }
        } else {
          const errorMsg = result?.error || 'Blog post not found';
          console.error('❌ BlogDetail: Error:', errorMsg);
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
      fetchBlog();
    }
  }, [slug, getBlogBySlug, user]);

  // ✅ FIXED: SIMPLIFIED content renderer - ONLY use processedContent from backend
  const renderBlogContent = () => {
    if (!blog) {
      return <div className="text-red-500 p-4 border border-red-300">No blog data available</div>;
    }

    // Rendering blog content

    // ✅ PRIORITY: ALWAYS use processedContent from backend
    // This ensures consistent formatting for both created and updated blogs
    if (blog.processedContent && blog.processedContent.trim()) {
      // Decode HTML entities (handles encoded <, >, &, etc.) then process color tags
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
      processedHtml = processedHtml.replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1 !important;">$2</span>');

      return (
        <div 
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: processedHtml }} 
        />
      );
    }

    // ✅ FALLBACK: If no processedContent, show raw content with basic formatting
    if (blog.content && blog.content.trim()) {
      // No processedContent found, showing raw content with basic formatting
      
      // Simple fallback - just show the raw content in a pre tag
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

    // Fallback: No content
    return (
      <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
        <p>No content available for this blog post.</p>
      </div>
    );
  };

  const handleLike = async () => {
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
  };

  const handleAddComment = async (commentText) => {
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
  };

  const handleShare = () => {
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
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
  };

  const getLikesCount = () => {
    if (!blog) return 0;
    return blog.likesCount || blog.likes?.length || 0;
  };

  const getCommentsCount = () => {
    if (!blog) return 0;
    return blog.commentsCount || blog.comments?.length || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Debug Info removed */}

        {/* Notification */}
        {notification.show && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
            duration={3000}
          />
        )}

        {/* Back Button */}
        <div className="mb-6">
          <Link to="/blogs" className="inline-flex items-center text-blue-600 hover:text-blue-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blogs
          </Link>
        </div>

        {/* Blog Article */}
        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Featured Image */}
          {blog.featuredImage?.url && (
            <div className="w-full h-64 md:h-96 overflow-hidden">
              <img
                src={blog.featuredImage.url}
                alt={blog.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/800x400/4ecdc4/ffffff?text=${encodeURIComponent(blog.title)}`;
                }}
              />
            </div>
          )}

          <div className="p-6 md:p-8">
            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{blog.readTime || 5} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{blog.views || 0} views</span>
              </div>
              {blog.author && (
                <div className="flex items-center gap-1">
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
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Blog Content */}
            <div className="mt-8">
              {renderBlogContent()}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handleLike}
                disabled={actionLoading || !isAuthenticated}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like ({getLikesCount()})</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                <MessageCircle className="w-5 h-5" />
                <span>Comment ({getCommentsCount()})</span>
              </button>
              
              <button 
                onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
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
          color: #2563eb;
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
      `}</style>
    </div>
  );
};

export default BlogDetail;