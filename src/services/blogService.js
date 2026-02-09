// services/blogService.js
// IMPORT FROM THE NEW FILE to avoid circular dependencies
import { blogsAPI } from './apiExports';
import api from './api';

// Debug logs removed

class BlogService {
  constructor() {
    // BlogService initialized
    // Removed startup debug/test calls
  }

  async testAPI() {
    // testAPI disabled in production
    try {
      // Test skipped
    } catch (error) {
      console.error('❌ blogsAPI.getAll test FAILED:', error);
    }
  }

  // Get all blog posts
  async getBlogs(filters = {}) {
    // Fetching blogs with filters - add timeout for slow APIs
    
    // Check if blogsAPI.getAll exists
    if (!blogsAPI || typeof blogsAPI.getAll !== 'function') {
      console.error('❌ blogsAPI.getAll is not available');
      return {
        success: false,
        error: 'API not available',
        blogs: [],
        data: null
      };
    }
    
    try {
      // Create abort controller with 15 second timeout to allow slow backends
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await blogsAPI.getAll({ ...filters, signal: controller.signal });
      clearTimeout(timeoutId);
      
      // Handle different response structures
      const responseData = response.data;
      const blogs = responseData?.blogs || responseData || [];
      
      const result = {
        success: true,
        data: responseData,
        blogs: Array.isArray(blogs) ? blogs : []
      };
      
      // Returning blog service result
      return result;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('❌ BlogService.getBlogs timeout - API too slow');
        return {
          success: false,
          error: 'API request timeout - please try again',
          blogs: [],
          data: null
        };
      }
      console.error('❌ BlogService.getBlogs error:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch blogs',
        blogs: [],
        data: null
      };
    }
  }

  // Get blog post by ID
  async getBlogById(id) {
    try {
      const response = await blogsAPI.getById(id);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ BlogService.getBlogById error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Blog not found',
        data: null
      };
    }
  }

  // Get blog post by slug
  async getBlogBySlug(slug) {
    try {
      const response = await blogsAPI.getBySlug(slug);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ BlogService.getBlogBySlug error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Blog not found',
        data: null
      };
    }
  }

  // Create new blog post
  async createBlog(blogData) {
    try {
      const response = await blogsAPI.create(blogData);
      return {
        success: true,
        data: response.data,
        message: 'Blog created successfully'
      };
    } catch (error) {
      console.error('❌ BlogService.createBlog error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to create blog',
        data: null
      };
    }
  }

  // Update blog post
  async updateBlog(id, blogData) {
    try {
      const response = await blogsAPI.update(id, blogData);
      return {
        success: true,
        data: response.data,
        message: 'Blog updated successfully'
      };
    } catch (error) {
      console.error('❌ BlogService.updateBlog error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to update blog',
        data: null
      };
    }
  }

  // Delete blog post
  async deleteBlog(id) {
    try {
      const response = await blogsAPI.delete(id);
      return {
        success: true,
        data: response.data,
        message: 'Blog deleted successfully'
      };
    } catch (error) {
      console.error('❌ BlogService.deleteBlog error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to delete blog',
        data: null
      };
    }
  }

  // Like a blog post
  async likeBlog(id) {
    try {
      const response = await blogsAPI.like(id);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ BlogService.likeBlog error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to like blog',
        data: null
      };
    }
  }

  // Add comment to blog post
  async addComment(id, comment) {
    try {
      const response = await blogsAPI.addComment(id, comment);
      return {
        success: true,
        data: response.data,
        message: 'Comment added successfully'
      };
    } catch (error) {
      console.error('❌ BlogService.addComment error:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to add comment',
        data: null
      };
    }
  }

  // Get popular blog posts
  async getPopularBlogs(limit = 5) {
    try {
      const response = await blogsAPI.getPopular();
      const blogs = response.data?.blogs || response.data || [];
      return Array.isArray(blogs) ? blogs.slice(0, limit) : [];
    } catch (error) {
      console.error('❌ BlogService.getPopularBlogs error:', error);
      return [];
    }
  }

  // Get featured blog posts
  async getFeaturedBlogs(limit = 5) {
    try {
      const response = await blogsAPI.getFeatured();
      const blogs = response.data?.blogs || response.data || [];
      return Array.isArray(blogs) ? blogs.slice(0, limit) : [];
    } catch (error) {
      console.error('❌ BlogService.getFeaturedBlogs error:', error);
      return [];
    }
  }

  // Helper methods
  getLikeCount(blog) {
    if (!blog) return 0;
    if (Array.isArray(blog.likes)) return blog.likes.length;
    return blog.likesCount || 0;
  }

  getCommentCount(blog) {
    if (!blog) return 0;
    if (Array.isArray(blog.comments)) return blog.comments.length;
    return blog.commentsCount || 0;
  }

  calculateReadingTime(content) {
    if (!content) return 1;
    const wordsPerMinute = 200;
    const plainText = content.replace(/<[^>]*>/g, '');
    const wordCount = plainText.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }

  generateExcerpt(content, maxLength = 150) {
    if (!content) return '';
    const plainText = content.replace(/<[^>]*>/g, '');
    if (plainText.length <= maxLength) return plainText;
    return plainText.substring(0, maxLength).trim() + '...';
  }

  generateSlug(title) {
    if (!title) return '';
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  }
}

const blogService = new BlogService();
export default blogService;