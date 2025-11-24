import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Eye, Plus, Tag, Search, Download, RefreshCw } from 'lucide-react';

import AdminSidebar from '../../components/Admins/AdminSidebar';
import DataTable from '../../components/Admins/DataTable';
import ImageUpload from '../../components/Admins/ImageUpload';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import useNotification from '../../hooks/useNotification';
import { categoriesAPI, productsAPI } from '../../services/api';

const CategoryManagement = () => {
  const { addNotification } = useNotification();
  
  // States following AdminDashboard pattern
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states - same as AdminDashboard
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  
  // Form states - same as AdminDashboard
  const [categoryImage, setCategoryImage] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // React Hook Form - same as AdminDashboard
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue,
    formState: { errors } 
  } = useForm();

  // Load data on component mount - same pattern as AdminDashboard
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const response = await categoriesAPI.getAll();
      let cats = response.data || [];

      // Try to get product counts per category from backend helper endpoint
      try {
        const countsResp = await productsAPI.getCategoriesWithCounts();
        const countsData = countsResp.data || [];
        // countsData expected format: [{ category: categoryId, count: number }, ...]
        const countsMap = {};
        if (Array.isArray(countsData)) {
          countsData.forEach(c => {
            countsMap[c.category] = c.count;
          });
        }

        cats = cats.map(cat => ({ ...cat, productCount: countsMap[cat._id] || 0 }));
      } catch (err) {
        // Fallback: fetch all products and compute counts client-side
        try {
          const productsResp = await productsAPI.getAll({ fields: 'category', limit: 10000 });
          const productsList = productsResp.data?.products || productsResp.data || [];
          const countsMap = {};
          productsList.forEach(p => {
            const catId = p.category?._id || p.category || null;
            if (!catId) return;
            countsMap[catId] = (countsMap[catId] || 0) + 1;
          });
          cats = cats.map(cat => ({ ...cat, productCount: countsMap[cat._id] || 0 }));
        } catch (err2) {
          // If all fails, leave productCount undefined (UI will show 0)
          console.warn('Failed to fetch product counts, continuing without counts', err2);
        }
      }

      setCategories(cats);
    } catch (error) {
      console.error('Error loading categories:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load categories'
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

  // Open modals - same pattern as AdminDashboard
  const openCategoryModal = (category = null) => {
    setEditingItem(category);
    if (category) {
      setValue('name', category.name || '');
      setValue('description', category.description || '');
      setValue('isActive', category.isActive !== false);
      
      if (category.image) {
        setCategoryImage([{ 
          url: category.image.url || category.image, 
          file: null,
          public_id: category.image.public_id 
        }]);
      } else {
        setCategoryImage([]);
      }
    } else {
      reset({
        name: '',
        description: '',
        isActive: true
      });
      setCategoryImage([]);
    }
    setCategoryModalOpen(true);
  };

  const openViewModal = (category) => {
    setViewModal({ open: true, item: category });
  };

  const openDeleteModal = (category) => {
    setDeleteModal({ open: true, type: 'category', item: category });
  };

  // Close modals - same as AdminDashboard
  const closeModals = () => {
    setCategoryModalOpen(false);
    setViewModal({ open: false, item: null });
    setDeleteModal({ open: false, type: '', item: null });
    setEditingItem(null);
    
    reset({
      name: '',
      description: '',
      isActive: true
    });
    
    setCategoryImage([]);
  };

  // Form submission - same pattern as AdminDashboard
  const handleCreateCategory = async (data) => {
    if (!categoryImage[0]) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please upload a category image' 
      });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('description', data.description || '');
      formData.append('isActive', data.isActive);
      
      if (categoryImage[0].file) {
        formData.append('image', categoryImage[0].file);
      }

      let result;
      if (editingItem) {
        result = await categoriesAPI.update(editingItem._id, formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Category updated successfully' 
        });
      } else {
        result = await categoriesAPI.create(formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Category created successfully' 
        });
      }

      closeModals();
      await refreshData();
    } catch (error) {
      console.error('Category operation error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Operation failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete operation - same pattern as AdminDashboard
  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setSubmitting(true);
      await categoriesAPI.delete(deleteModal.item._id);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'Category deleted successfully' 
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

  // Toggle category status
  const toggleCategoryStatus = async (category) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('name', category.name);
      formData.append('description', category.description || '');
      formData.append('isActive', !category.isActive);
      
      if (category.image) {
        // For existing images, we might need to handle differently
        // This is a simplified approach
        formData.append('image', category.image);
      }

      await categoriesAPI.update(category._id, formData);
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: `Category ${!category.isActive ? 'activated' : 'deactivated'} successfully` 
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

  // Filter and sort categories
  const getFilteredAndSortedCategories = () => {
    let filtered = categories;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(category =>
        category.name?.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => 
        statusFilter === 'active' ? category.isActive : !category.isActive
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

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

  // Export categories
  const exportCategories = () => {
    const data = getFilteredAndSortedCategories();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,Description,Products,Status,Created\n"
      + data.map(category => 
          `"${category.name}","${category.description || ''}",${category.productCount || category.products?.length || 0},"${category.isActive ? 'Active' : 'Inactive'}","${category.createdAt ? new Date(category.createdAt).toLocaleDateString() : 'Unknown'}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "categories.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Categories exported successfully'
    });
  };

  // Table columns
  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (value, item) => {
        const category = item || value;
        if (!category) return null;
        return (
          <img
            src={category.image?.url || category.image || '/images/placeholder/category.png'}
            alt={category.name}
            className="w-10 h-10 object-cover rounded"
            onError={(e) => {
              e.target.src = '/images/placeholder/category.png';
            }}
          />
        );
      }
    },
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (value, item) => {
        const category = item || value;
        if (!category) return null;
        return (
          <div>
            <div className="font-medium text-gray-900">{category.name}</div>
            <div className="text-xs text-gray-500 mt-1">
              ID: {category._id?.substring(0, 8)}...
            </div>
          </div>
        );
      }
    },
    {
      key: 'description',
      header: 'Description',
      render: (value, item) => {
        const category = item || value;
        if (!category) return null;
        return (
          <span className="text-sm text-gray-600 line-clamp-2">
            {category.description || 'No description'}
          </span>
        );
      }
    },
    {
      key: 'productCount',
      header: 'Products',
      sortable: true,
      render: (value, item) => {
        const category = item || value;
        if (!category) return null;
        return (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
            {category.productCount || category.products?.length || 0}
          </span>
        );
      }
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (value, item) => {
        const category = item || value;
        if (!category) return null;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {category.isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, item) => {
        const category = item || value;
        if (!category) return null;
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="small"
              onClick={() => openViewModal(category)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => openCategoryModal(category)}
              disabled={submitting}
              title="Edit Category"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant={category.isActive ? "outline" : "primary"}
              size="small"
              onClick={() => toggleCategoryStatus(category)}
              disabled={submitting}
              title={category.isActive ? "Deactivate" : "Activate"}
            >
              {category.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => openDeleteModal(category)}
              disabled={submitting}
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const filteredCategories = getFilteredAndSortedCategories();

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="large" text="Loading categories..." />
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
                <h1 className="text-2xl font-bold text-gray-900">Category Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage and organize your product categories
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
                  onClick={exportCategories}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Button
                  onClick={() => openCategoryModal()}
                  disabled={submitting}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search categories by name or description..."
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
                  <option value="active">Active Only</option>
                  <option value="inactive">Inactive Only</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredCategories.length} of {categories.length} categories
              </div>
              <div className="text-sm text-gray-600">
                {categories.filter(cat => cat.isActive).length} active, 
                {' '}{categories.filter(cat => !cat.isActive).length} inactive
              </div>
            </div>
          </div>

          {/* Categories Table */}
          {filteredCategories.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Categories Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No categories match your search criteria.' 
                  : 'Get started by creating your first category.'
                }
              </p>
              <Button onClick={() => openCategoryModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Category
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <DataTable
                data={filteredCategories}
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

      {/* Category Modal - Same structure as AdminDashboard */}
      <Modal 
        isOpen={categoryModalOpen} 
        onClose={closeModals} 
        title={editingItem ? 'Edit Category' : 'Add Category'} 
        size="medium"
      >
        <form onSubmit={handleSubmit(handleCreateCategory)} className="p-4 sm:p-6 space-y-4">
          <ImageUpload 
            images={categoryImage} 
            onImagesChange={setCategoryImage} 
            multiple={false} 
            label="Category Image" 
          />
          <Input 
            label="Name" 
            {...register('name', { required: 'Category name is required' })} 
            error={errors.name} 
          />
          <Input 
            label="Description" 
            type="textarea" 
            {...register('description')} 
            error={errors.description} 
          />
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active Category
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeModals}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !categoryImage[0]}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        title="Category Details"
        size="medium"
      >
        {viewModal.item && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src={viewModal.item.image?.url || viewModal.item.image || '/images/placeholder/category.png'} 
                alt={viewModal.item.name}
                className="w-32 h-32 rounded-lg object-cover border"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{viewModal.item.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    viewModal.item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {viewModal.item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Products</label>
                <p className="mt-1 text-sm text-gray-900">
                  {viewModal.item.productCount || viewModal.item.products?.length || 0}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Created</label>
                <p className="mt-1 text-sm text-gray-900">
                  {viewModal.item.createdAt ? new Date(viewModal.item.createdAt).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <p className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                {viewModal.item.description || 'No description'}
              </p>
            </div>
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setViewModal({ open: false, item: null })}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setViewModal({ open: false, item: null });
                  openCategoryModal(viewModal.item);
                }}
              >
                Edit Category
              </Button>
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
          <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base">
            Are you sure you want to delete this {deleteModal.type} "{deleteModal.item?.name}"? 
            This action cannot be undone.
            {deleteModal.item?.productCount && (
              <span className="block mt-2 text-red-600">
                This will affect {deleteModal.item.productCount} products.
              </span>
            )}
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

export default CategoryManagement;