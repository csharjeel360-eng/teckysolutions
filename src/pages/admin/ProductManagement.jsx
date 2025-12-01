import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, Eye, Search, Download, Package, DollarSign, BarChart3, RefreshCw } from 'lucide-react';
import { useForm } from 'react-hook-form';


import DataTable from '../../components/Admins/DataTable';
import ImageUpload from '../../components/Admins/ImageUpload';
import RichTextEditor from '../../components/Admins/RichTextEditor';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import useNotification from '../../hooks/useNotification';
import { productsAPI, categoriesAPI } from '../../services/api';

const ProductManagement = () => {
  const { addNotification } = useNotification();
  
  // States from AdminDashboard pattern
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states - same as AdminDashboard
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  
  // Form states - same as AdminDashboard
  const [productImages, setProductImages] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  
  // Filter and sort states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  // React Hook Form - same as AdminDashboard
  const { 
    register, 
    handleSubmit, 
    reset, 
    setValue, 
    watch,
    formState: { errors } 
  } = useForm();

  // Load data on component mount - same pattern as AdminDashboard
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsResponse, categoriesResponse] = await Promise.all([
        productsAPI.getAll(),
        categoriesAPI.getAll()
      ]);
      
      // Handle different response structures
      const productsList = Array.isArray(productsResponse.data) 
        ? productsResponse.data 
        : (productsResponse.data?.products || productsResponse.data?.data || []);
      
      const categoriesList = Array.isArray(categoriesResponse.data)
        ? categoriesResponse.data
        : (categoriesResponse.data?.categories || categoriesResponse.data?.data || []);
      
      setProducts(Array.isArray(productsList) ? productsList : []);
      setCategories(Array.isArray(categoriesList) ? categoriesList : []);
    } catch (error) {
      console.error('Error loading data:', error);
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to load data'
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
  const openProductModal = (product = null) => {
    setEditingItem(product);
    if (product) {
      // Set form values for editing
      setValue('title', product.title || '');
      setValue('description', product.description || '');
      setValue('price', product.price || '');
      setValue('stock', product.stock || '');
      setValue('category', product.category?._id || product.category || '');
      setValue('productLink', product.productLink || '');
      setValue('sku', product.sku || '');
      setValue('isActive', product.isActive !== false);
      
      // Set images
      if (product.images && product.images.length > 0) {
        const imagesToShow = product.images.map(img => ({ 
          url: img.url, 
          file: null,
          public_id: img.public_id 
        }));
        setProductImages(imagesToShow);
      } else {
        setProductImages([]);
      }
      
      // Set tags
      setProductTags(product.tags || []);
    } else {
      // Reset form for new product
      reset({
        title: '',
        description: '',
        price: '',
        stock: '',
        category: '',
        productLink: '',
        sku: '',
        isActive: true
      });
      setProductImages([]);
      setProductTags([]);
    }
    setProductModalOpen(true);
  };

  const openViewModal = (product) => {
    setViewModal({ open: true, item: product });
  };

  const openDeleteModal = (product) => {
    setDeleteModal({ open: true, type: 'product', item: product });
  };

  // Close modals - same as AdminDashboard
  const closeModals = () => {
    setProductModalOpen(false);
    setViewModal({ open: false, item: null });
    setDeleteModal({ open: false, type: '', item: null });
    setEditingItem(null);
    
    reset({
      title: '',
      description: '',
      price: '',
      stock: '',
      category: '',
      productLink: '',
      sku: '',
      isActive: true
    });
    
    setProductImages([]);
    setProductTags([]);
    setTagInput('');
  };

  // Tag management - same as AdminDashboard
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !productTags.includes(trimmedTag)) {
      setProductTags([...productTags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (index) => {
    setProductTags(productTags.filter((_, i) => i !== index));
  };

  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // Form submission - same pattern as AdminDashboard
  const handleCreateProduct = async (data) => {
    if (productImages.length === 0) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please upload at least one product image' 
      });
      return;
    }

    if (!data.productLink) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Product link is required' 
      });
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('description', data.description);
      formData.append('price', data.price);
      formData.append('stock', data.stock);
      formData.append('category', data.category);
      formData.append('productLink', data.productLink);
      formData.append('isActive', data.isActive);
      
      if (data.sku) {
        formData.append('sku', data.sku);
      }
      
      if (productTags.length > 0) {
        formData.append('tags', productTags.join(','));
      }

      // Add images - same pattern as AdminDashboard
      productImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      let result;
      if (editingItem) {
        result = await productsAPI.update(editingItem._id, formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Product updated successfully' 
        });
      } else {
        result = await productsAPI.create(formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Product created successfully' 
        });
      }

      closeModals();
      await refreshData();
    } catch (error) {
      console.error('Product operation error:', error);
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
      await productsAPI.delete(deleteModal.item._id);
      
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'Product deleted successfully' 
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

  // Toggle product status
  const toggleProductStatus = async (product) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', product.title);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('stock', product.stock);
      formData.append('category', product.category?._id || product.category);
      formData.append('productLink', product.productLink || '');
      formData.append('isActive', !product.isActive);

      if (product.tags && product.tags.length > 0) {
        formData.append('tags', product.tags.join(','));
      }

      await productsAPI.update(product._id, formData);
      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: `Product ${!product.isActive ? 'activated' : 'deactivated'} successfully` 
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

  // Handle sort - same as your pattern
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filter and sort products
  const getFilteredAndSortedProducts = () => {
    let filtered = products;

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower)) ||
        product.category?.name?.toLowerCase().includes(searchLower)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => 
        statusFilter === 'active' ? product.isActive : !product.isActive
      );
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => 
        product.category?._id === categoryFilter || product.category === categoryFilter
      );
    }

    // Apply stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(product => {
        if (stockFilter === 'in-stock') return product.stock > 0;
        if (stockFilter === 'low-stock') return product.stock > 0 && product.stock <= 10;
        if (stockFilter === 'out-of-stock') return product.stock === 0;
        return true;
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];

        if (sortConfig.key === 'category') {
          aValue = a.category?.name;
          bValue = b.category?.name;
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

  // Export products
  const exportProducts = () => {
    const data = getFilteredAndSortedProducts();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Name,SKU,Category,Price,Stock,Status,Tags\n"
      + data.map(product => 
          `"${product.title}","${product.sku || 'N/A'}","${product.category?.name || 'Uncategorized'}","${product.price}","${product.stock}","${product.isActive ? 'Active' : 'Inactive'}","${(product.tags || []).join(', ')}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "products.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addNotification({
      type: 'success',
      title: 'Success',
      message: 'Products exported successfully'
    });
  };

  // Table columns
  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (value, item) => {
        const product = item || value;
        if (!product) return null;
        return (
          <img
            src={product.images?.[0]?.url || '/images/placeholder/product.png'}
            alt={product.title}
            className="w-10 h-10 object-cover rounded"
          />
        );
      }
    },
    {
      key: 'title',
      header: 'Product Name',
      sortable: true,
      render: (value, product) => (
        <div>
          <div className="font-medium text-gray-900">{product?.title || value || 'Untitled'}</div>
          {(product?.sku) && (
            <div className="text-sm text-gray-500">SKU: {product.sku}</div>
          )}
        </div>
      )
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      render: (value, product) => (
        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
          {product?.category?.name || (value && (typeof value === 'string' ? value : value.name)) || 'Uncategorized'}
        </span>
      )
    },
    {
      key: 'price',
      header: 'Price',
      sortable: true,
      render: (value, product) => {
        const price = product?.price ?? value ?? 0;
        const priceNum = typeof price === 'number' ? price : Number(price) || 0;
        return (
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4 text-green-600" />
            <span className="font-semibold text-green-700">
              ${priceNum.toLocaleString()}
            </span>
          </div>
        );
      }
    },
    {
      key: 'stock',
      header: 'Stock',
      sortable: true,
      render: (value, product) => {
        const stock = Number(product?.stock ?? value ?? 0) || 0;
        const stockConfig = {
          high: { color: 'bg-green-100 text-green-800', label: 'In Stock' },
          low: { color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' },
          out: { color: 'bg-red-100 text-red-800', label: 'Out of Stock' }
        };
        
        let config = stockConfig.out;
        if (stock > 10) config = stockConfig.high;
        else if (stock > 0) config = stockConfig.low;

        return (
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className={`px-2 py-1 rounded text-xs font-medium ${config.color}`}>
              {stock} {config.label}
            </span>
          </div>
        );
      }
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (value, item) => {
        const product = item || value;
        if (!product) return null;
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {product.isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, item) => {
        const product = item || value;
        if (!product) return null;
        return (
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="small"
              onClick={() => openViewModal(product)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => openProductModal(product)}
              disabled={submitting}
              title="Edit Product"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant={product.isActive ? "outline" : "primary"}
              size="small"
              onClick={() => toggleProductStatus(product)}
              disabled={submitting}
              title={product.isActive ? "Deactivate" : "Activate"}
            >
              {product.isActive ? 'Deactivate' : 'Activate'}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => openDeleteModal(product)}
              disabled={submitting}
              title="Delete Product"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const filteredProducts = getFilteredAndSortedProducts();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading products..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage your product catalog and inventory
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
                  onClick={exportProducts}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Button
                  onClick={() => openProductModal()}
                  disabled={submitting || categories.length === 0}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Product</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Warning if no categories */}
          {categories.length === 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <Package className="w-5 h-5 text-yellow-600 mr-2" />
                <div>
                  <h3 className="text-yellow-800 font-semibold">No Categories Available</h3>
                  <p className="text-yellow-700 text-sm">
                    You need to create categories before adding products.
                  </p>
                </div>
                <Link to="/admin/categories" className="ml-auto">
                  <Button variant="primary" size="small">
                    Go to Categories
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search products by name, SKU, description, or tags..."
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
              <div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <select
                  value={stockFilter}
                  onChange={(e) => setStockFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Stock Status</option>
                  <option value="in-stock">In Stock</option>
                  <option value="low-stock">Low Stock (≤10)</option>
                  <option value="out-of-stock">Out of Stock</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </div>
              <div className="text-sm text-gray-600">
                {products.filter(product => product.isActive).length} active, 
                {' '}{products.filter(product => !product.isActive).length} inactive
              </div>
            </div>
          </div>

          {/* Products Table */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Products Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || stockFilter !== 'all'
                  ? 'No products match your search criteria.' 
                  : categories.length === 0 
                    ? 'Create categories first to add products.'
                    : 'Get started by creating your first product.'
                }
              </p>
              {categories.length > 0 ? (
                <Button onClick={() => openProductModal()}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create First Product
                </Button>
              ) : (
                <Link to="/admin/categories">
                  <Button>Go to Categories</Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <DataTable
                data={filteredProducts}
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

      {/* Product Modal - Same structure as AdminDashboard */}
      <Modal 
        isOpen={productModalOpen} 
        onClose={closeModals} 
        title={editingItem ? 'Edit Product' : 'Add Product'} 
        size="large"
      >
        <form onSubmit={handleSubmit(handleCreateProduct)} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Input 
              label="Product Name" 
              {...register('title', { required: 'Product name is required' })} 
              error={errors.title} 
            />
            <Input 
              label="SKU" 
              {...register('sku')} 
              placeholder="Optional stock keeping unit"
            />
            <Input 
              label="Price" 
              type="number" 
              step="0.01" 
              {...register('price', { required: 'Price is required' })} 
              error={errors.price} 
            />
            <Input 
              label="Stock" 
              type="number" 
              {...register('stock', { required: 'Stock is required' })} 
              error={errors.stock} 
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select 
                {...register('category', { required: 'Category is required' })} 
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>
              )}
            </div>
            <Input 
              label="Product Link" 
              {...register('productLink', { required: 'Product link is required' })} 
              error={errors.productLink} 
              placeholder="https://example.com/product" 
            />
          </div>
          
          <ImageUpload 
            images={productImages} 
            onImagesChange={setProductImages} 
            multiple={true} 
            label="Product Images" 
            maxImages={5}
            helpText="Upload up to 5 product images. First image will be used as main display."
          />
          
          <Input 
            label="Description" 
            type="textarea" 
            {...register('description', { required: 'Description is required' })} 
            error={errors.description} 
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-2">
              <Input 
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => handleTagKeyPress(e)}
                placeholder="Add tag and press Enter" 
                className="flex-1"
              />
              <Button type="button" onClick={addTag} className="sm:w-auto">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productTags.map((tag, index) => (
                <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm flex items-center">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(index)} 
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              {...register('isActive')}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
              Active Product
            </label>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeModals}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || productImages.length === 0}
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
        title="Product Details"
        size="large"
      >
        {viewModal.item && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src={viewModal.item.images?.[0]?.url || '/images/placeholder/product.png'} 
                  alt={viewModal.item.title}
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {viewModal.item.images?.slice(1).map((image, index) => (
                    <img 
                      key={index}
                      src={image.url} 
                      alt={`Product ${index + 2}`}
                      className="w-full h-16 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Product Name</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {viewModal.item.title}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <p className="mt-1 text-xl font-bold text-green-700">
                      ${viewModal.item.price?.toLocaleString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Stock</label>
                    <p className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        viewModal.item.stock > 10 ? 'bg-green-100 text-green-800' :
                        viewModal.item.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {viewModal.item.stock} units
                      </span>
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {viewModal.item.category?.name || 'Uncategorized'}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <p className="mt-1">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        viewModal.item.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {viewModal.item.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </p>
                  </div>
                </div>
                
                {viewModal.item.sku && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SKU</label>
                    <p className="mt-1 text-sm text-gray-900 font-mono">
                      {viewModal.item.sku}
                    </p>
                  </div>
                )}
              </div>
            </div>
            
            {viewModal.item.tags && viewModal.item.tags.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Tags</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {viewModal.item.tags.map((tag, index) => (
                    <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <div 
                className="mt-1 text-sm text-gray-900 prose max-w-none"
                dangerouslySetInnerHTML={{ __html: viewModal.item.description }}
              />
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
                  openProductModal(viewModal.item);
                }}
              >
                Edit Product
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

export default ProductManagement;