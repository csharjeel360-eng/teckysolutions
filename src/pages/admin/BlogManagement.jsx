import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Download, RefreshCw, FileText, Calendar, User, BarChart3 } from 'lucide-react';

import AdminSidebar from '../../components/Admins/AdminSidebar';
import DataTable from '../../components/Admins/DataTable';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import useNotification from '../../hooks/useNotification';
import { blogsAPI } from '../../services/api';

const BlogManagement = () => {
  const { addNotification } = useNotification();
  
  // States following AdminDashboard pattern
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states - same as AdminDashboard
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [authorFilter, setAuthorFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getAll({ status: 'all' });
      // Ensure we have a safe array of blogs
      const blogsData = response.data?.blogs || response.data || [];
      setBlogs(Array.isArray(blogsData) ? blogsData : []);
    } catch (error) {
      console.error('Error loading blogs:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load blogs'
      });
    } finally {
      setLoading(false);
    }
  };

  // Refresh data - same as AdminDashboard
  const refreshData = async () => {
    try {
      setSubmitting(true);
      await loadData();
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Data refreshed successfully',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to refresh data',
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Open modals
  const openViewModal = (blog) => {
    setViewModal({ open: true, item: blog });
  };

  const openDeleteModal = (blog) => {
    setDeleteModal({ open: true, type: 'blog', item: blog });
  };

  // Close modals
  const closeModals = () => {
    setViewModal({ open: false, item: null });
    setDeleteModal({ open: false, type: '', item: null });
  };

  // Delete operation - same pattern as AdminDashboard
  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setSubmitting(true);
      await blogsAPI.delete(deleteModal.item._id);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'Blog deleted successfully' 
      });
      
      setDeleteModal({ open: false, type: '', item: null });
      await refreshData();
    } catch (error) {
      console.error('Delete operation error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Delete failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle blog status
  const toggleBlogStatus = async (blog) => {
    try {
      setSubmitting(true);
      const newStatus = blog.status === 'published' ? 'draft' : 'published';
      
      await blogsAPI.update(blog._id, { status: newStatus });
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: `Blog ${newStatus === 'published' ? 'published' : 'unpublished'} successfully` 
      });
      
      await refreshData();
    } catch (error) {
      console.error('Status toggle error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Status update failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle sort - same as AdminDashboard
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort blogs
  const getFilteredAndSortedBlogs = () => {
    let filtered = blogs;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(blog =>
        blog.title?.toLowerCase().includes(searchLower) ||
        blog.excerpt?.toLowerCase().includes(searchLower) ||
        blog.content?.toLowerCase().includes(searchLower) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(blog => blog.status === statusFilter);
    }

    // Apply author filter
    if (authorFilter !== 'all') {
      filtered = filtered.filter(blog => {
        const author = blog.author;
        const authorName = typeof author === 'object' ? author.name : (author || 'Unknown Author');
        return authorName === authorFilter;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        // Handle nested properties
        if (sortConfig.key === 'author') {
          const authorA = a.author;
          const authorB = b.author;
          aValue = typeof authorA === 'object' ? authorA.name : (authorA || 'Unknown Author');
          bValue = typeof authorB === 'object' ? authorB.name : (authorB || 'Unknown Author');
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  // Get unique authors for filter
  const getUniqueAuthors = () => {
    const authors = new Set();
    blogs.forEach(blog => {
      const author = blog?.author;
      const authorName = (author && typeof author === 'object') ? (author.name || 'Unknown Author') : (author || 'Unknown Author');
      authors.add(authorName);
    });
    return Array.from(authors);
  };

  // Export blogs
  const exportBlogs = () => {
    const data = getFilteredAndSortedBlogs();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Title,Author,Status,Views,Tags,Created At\n"
      + data.map(blog => {
          const author = blog.author;
          const authorName = (author && typeof author === 'object') ? (author.name || 'Unknown Author') : (author || 'Unknown Author');
          const tags = Array.isArray(blog.tags) ? blog.tags.join(', ') : '';
          const createdAt = blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Unknown';
          
          return `"${blog.title || 'Untitled'}","${authorName}","${blog.status || 'draft'}","${blog.views || 0}","${tags}","${createdAt}"`;
        }).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "blogs.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Blogs exported successfully'
    });
  };

  // Helper functions
  const getAuthorName = (blog) => {
    if (!blog) return 'Unknown Author';
    const author = blog.author;
    return (author && typeof author === 'object') ? (author.name || 'Unknown Author') : (author || 'Unknown Author');
  };

  const getImageUrl = (blog) => {
    if (!blog) return '/images/placeholder/blog.png';
    const image = blog.featuredImage;
    if (!image) return '/images/placeholder/blog.png';
    return typeof image === 'string' ? image : (image.url || '/images/placeholder/blog.png');
  };

  const getTags = (blog) => {
    if (!blog) return [];
    return Array.isArray(blog.tags) ? blog.tags : [];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    return new Date(dateString).toLocaleDateString();
  };

  const formatRelativeTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  // Table columns
  const columns = [
    {
      key: 'featuredImage',
      header: 'Image',
      render: (value, blog) => {
        const item = blog || value;
        return (
          <img
            src={getImageUrl(item)}
            alt={item?.title || 'Blog Post'}
            className="w-16 h-12 object-cover rounded border"
            onError={(e) => {
              e.target.src = '/images/placeholder/blog.png';
            }}
          />
        );
      }
    },
    {
      key: 'title',
      header: 'Title & Excerpt',
      sortable: true,
      render: (value, blog) => {
        const item = blog || value || {};
        const tags = getTags(item);
        return (
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 line-clamp-1">
              {item.title || item?.title || 'Untitled Blog Post'}
            </div>
            <div className="text-sm text-gray-600 line-clamp-2 mt-1">
              {item.excerpt || 'No excerpt available'}
            </div>
            <div className="flex flex-wrap gap-1 mt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          </div>
        );
      }
    },
    {
      key: 'author',
      header: 'Author',
      sortable: true,
      render: (value, blog) => {
        const item = blog || value;
        return (
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium">{getAuthorName(item)}</span>
          </div>
        );
      }
    },
    {
      key: 'status',
      header: 'Status',
      sortable: true,
      render: (value, blog) => {
        const item = blog || value || {};
        const status = item.status || 'draft';
        const statusConfig = {
          draft: { color: 'bg-yellow-100 text-yellow-800', label: 'Draft' },
          published: { color: 'bg-green-100 text-green-800', label: 'Published' },
          archived: { color: 'bg-gray-100 text-gray-800', label: 'Archived' }
        };
        const config = statusConfig[status] || statusConfig.draft;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
            {config.label}
          </span>
        );
      }
    },
    {
      key: 'views',
      header: 'Views',
      sortable: true,
      render: (value, blog) => {
        const item = blog || value || {};
        const views = Number(item.views ?? value ?? 0) || 0;
        return (
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="font-mono text-sm">{views.toLocaleString()}</span>
          </div>
        );
      }
    },
    {
      key: 'createdAt',
      header: 'Created',
      sortable: true,
      render: (value, blog) => {
        const item = blog || value || {};
        const created = item.createdAt ?? value;
        return (
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="text-sm">
              <div className="text-gray-900">{formatDate(created)}</div>
              <div className="text-gray-500 text-xs">{formatRelativeTime(created)}</div>
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, blog) => {
        const item = blog || value;
        if (!item) return null;
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="small"
              onClick={() => openViewModal(item)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Link to={`/admin/blogs/edit/${item._id}`}>
              <Button
                variant="outline"
                size="small"
                title="Edit Blog"
              >
                <Edit className="w-4 h-4" />
              </Button>
            </Link>
            <Button
              variant={item.status === 'published' ? "outline" : "primary"}
              size="small"
              onClick={() => toggleBlogStatus(item)}
              disabled={submitting}
              title={item.status === 'published' ? "Unpublish" : "Publish"}
            >
              {item.status === 'published' ? 'Unpublish' : 'Publish'}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => openDeleteModal(item)}
              disabled={submitting}
              title="Delete Blog"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const filteredBlogs = getFilteredAndSortedBlogs();
  const uniqueAuthors = getUniqueAuthors();

  // Calculate statistics
  const stats = {
    total: blogs.length,
    published: blogs.filter(blog => blog.status === 'published').length,
    draft: blogs.filter(blog => blog.status === 'draft').length,
    archived: blogs.filter(blog => blog.status === 'archived').length,
    totalViews: blogs.reduce((sum, blog) => sum + (blog.views || 0), 0)
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" text="Loading blogs..." />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">Blog Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Create, manage, and publish your blog content
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={refreshData}
                  disabled={submitting}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  <span>{submitting ? 'Refreshing...' : 'Refresh'}</span>
                </Button>
                <Button
                  onClick={exportBlogs}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Link to="/admin/blogs/new">
                  <Button className="flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>New Blog</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Blogs</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BarChart3 className="w-8 h-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.published}</div>
                  <div className="text-sm text-gray-600">Published</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Edit className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.draft}</div>
                  <div className="text-sm text-gray-600">Drafts</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Eye className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <div className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search blogs by title, excerpt, content, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <select
                  value={authorFilter}
                  onChange={(e) => setAuthorFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Authors</option>
                  {uniqueAuthors.map(author => (
                    <option key={author} value={author}>{author}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredBlogs.length} of {blogs.length} blogs
              </div>
              <div className="text-sm text-gray-600">
                {stats.published} published, {stats.draft} draft, {stats.archived} archived
              </div>
            </div>
          </div>

          {/* Blogs Table */}
          {filteredBlogs.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Blogs Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || authorFilter !== 'all'
                  ? 'No blogs match your search criteria.' 
                  : 'Get started by creating your first blog post.'
                }
              </p>
              <Link to="/admin/blogs/new">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Blog
                </Button>
              </Link>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <DataTable
                data={filteredBlogs}
                columns={columns}
                searchable={false}
                itemsPerPage={10}
                loading={loading}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </div>
          )}
        </main>
      </div>

      {/* View Blog Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        title="Blog Details"
        size="large"
      >
        {viewModal.item && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src={getImageUrl(viewModal.item)} 
                alt={viewModal.item.title || 'Blog Post'}
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-lg font-semibold text-gray-900">
                  {viewModal.item.title || 'Untitled Blog Post'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    viewModal.item.status === 'published' ? 'bg-green-100 text-green-800' :
                    viewModal.item.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {(viewModal.item.status || 'draft').toUpperCase()}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Author</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {getAuthorName(viewModal.item)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Views</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">
                  {(viewModal.item.views || 0).toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(viewModal.item.createdAt)}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Last Updated</label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(viewModal.item.updatedAt)}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Excerpt</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {viewModal.item.excerpt || 'No excerpt available'}
              </p>
            </div>
            
            {getTags(viewModal.item).length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getTags(viewModal.item).map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setViewModal({ open: false, item: null })}
              >
                Close
              </Button>
              <Link to={`/admin/blogs/edit/${viewModal.item._id}`}>
                <Button>
                  Edit Blog
                </Button>
              </Link>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal - Same as AdminDashboard */}
      <Modal 
        isOpen={deleteModal.open} 
        onClose={() => setDeleteModal({ open: false, type: '', item: null })} 
        title={`Delete ${deleteModal.type}`} 
        size="small"
      >
        <div className="p-4 sm:p-6">
          <div className="flex items-center space-x-3 mb-4">
            <img 
              src={getImageUrl(deleteModal.item)} 
              alt={deleteModal.item?.title || 'Blog Post'}
              className="w-12 h-12 rounded object-cover border"
            />
            <div>
              <p className="font-medium text-gray-900">
                {deleteModal.item?.title || 'Unknown Blog'}
              </p>
              <p className="text-sm text-gray-500">
                by {getAuthorName(deleteModal.item)}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            Are you sure you want to delete this {deleteModal.type}? 
            This action cannot be undone.
          </p>
          <div className="flex space-x-3 justify-end">
            <Button
              variant="outline"
              onClick={() => setDeleteModal({ open: false, type: '', item: null })}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BlogManagement;