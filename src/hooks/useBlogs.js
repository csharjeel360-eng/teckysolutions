import { useState, useEffect, useCallback } from 'react';
import BlogService from '../services/blogService';

const useBlogs = (initialFilters = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    tag: '',
    status: 'published',
    ...initialFilters
  });

  // DATA VALIDATION AND NORMALIZATION
  const normalizeBlogData = useCallback((blogData) => {
    if (!blogData) return null;
    
    return {
      ...blogData,
      _id: blogData._id || blogData.id,
      title: blogData.title || 'Untitled',
      content: blogData.content || '',
      processedContent: blogData.processedContent || '',
      excerpt: blogData.excerpt || '',
      featuredImage: blogData.featuredImage || null,
      contentImages: Array.isArray(blogData.contentImages) ? blogData.contentImages : [],
      tags: Array.isArray(blogData.tags) ? blogData.tags : [],
      comments: Array.isArray(blogData.comments) ? blogData.comments : [],
      likes: Array.isArray(blogData.likes) ? blogData.likes : [],
      likesCount: blogData.likesCount || blogData.likes?.length || 0,
      commentsCount: blogData.commentsCount || blogData.comments?.length || 0,
      views: blogData.views || 0,
      status: blogData.status || 'draft',
      isActive: blogData.isActive !== false, // default to true
      createdAt: blogData.createdAt || new Date().toISOString(),
      updatedAt: blogData.updatedAt || new Date().toISOString(),
      author: blogData.author || { name: 'Unknown Author' }
    };
  }, []);

  const fetchBlogs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetching blogs with filters
      const result = await BlogService.getBlogs(filters);
      
      if (result.success) {
        const blogsData = result.blogs || result.data || [];
        const normalizedBlogs = blogsData.map(normalizeBlogData).filter(blog => blog !== null);
        setBlogs(normalizedBlogs);
      } else {
        setError(result.error);
        setBlogs([]);
      }
    } catch (err) {
      console.error('❌ useBlogs: Fetch error:', err);
      setError('Failed to fetch blogs');
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  }, [filters, normalizeBlogData]);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const setSearch = useCallback((searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  }, []);

  const setCategory = useCallback((category) => {
    setFilters(prev => ({ ...prev, category }));
  }, []);

  const setTag = useCallback((tag) => {
    setFilters(prev => ({ ...prev, tag }));
  }, []);

  const setStatus = useCallback((status) => {
    setFilters(prev => ({ ...prev, status }));
  }, []);

  // FIXED: getBlogBySlug with proper data normalization
  const getBlogBySlug = useCallback(async (slug) => {
    try {
      // Getting blog by slug
      const result = await BlogService.getBlogBySlug(slug);
      
      if (result.success && result.data) {
        const normalizedBlog = normalizeBlogData(result.data);
        return {
          success: true,
          data: normalizedBlog,
          error: null
        };
      } else {
        return {
          success: false,
          data: null,
          error: result.error || 'Blog not found'
        };
      }
    } catch (err) {
      console.error('❌ useBlogs: Get blog by slug error:', err);
      return {
        success: false,
        data: null,
        error: err.response?.data?.message || err.message || 'Failed to fetch blog'
      };
    }
  }, [normalizeBlogData]);

  const likeBlog = useCallback(async (blogId) => {
    try {
      // Liking blog
      const result = await BlogService.likeBlog(blogId);
      
      if (result.success) {
        // Update the local state for blogs array
        setBlogs(prev => prev.map(blog => 
          blog._id === blogId 
            ? { 
                ...blog, 
                likes: result.data?.likes || blog.likes,
                likesCount: result.data?.likesCount || blog.likesCount 
              }
            : blog
        ));
        
        return result;
      }
      return result;
    } catch (err) {
      console.error('❌ useBlogs: Like error:', err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Failed to like blog'
      };
    }
  }, []);

  const addComment = useCallback(async (blogId, comment) => {
    try {
      // Adding comment to blog
      const result = await BlogService.addComment(blogId, comment);
      
      if (result.success) {
        // Update the local state for blogs array
        setBlogs(prev => prev.map(blog => 
          blog._id === blogId 
            ? { 
                ...blog, 
                comments: [...(blog.comments || []), result.data],
                commentsCount: (blog.commentsCount || 0) + 1
              }
            : blog
        ));
        
        return result;
      }
      return result;
    } catch (err) {
      console.error('❌ useBlogs: Add comment error:', err);
      return {
        success: false,
        error: err.response?.data?.message || err.message || 'Failed to add comment'
      };
    }
  }, []);

  const getPopularBlogs = useCallback(() => {
    return blogs
      .filter(blog => blog.status === 'published')
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6);
  }, [blogs]);

  const getFeaturedBlogs = useCallback(() => {
    return blogs
      .filter(blog => blog.status === 'published' && blog.isFeatured)
      .slice(0, 3);
  }, [blogs]);

  return {
    blogs,
    loading,
    error,
    filters,
    fetchBlogs,
    setSearch,
    setCategory,
    setTag,
    setStatus,
    getBlogBySlug,
    likeBlog,
    addComment,
    getPopularBlogs,
    getFeaturedBlogs
  };
};

export default useBlogs;