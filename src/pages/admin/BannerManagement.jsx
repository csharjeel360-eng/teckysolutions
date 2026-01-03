import React, { useState, useEffect } from 'react';
import useBanners from '../../hooks/useBanners';

import DataTable from '../../components/Admins/DataTable';
import ImageUpload from '../../components/Admins/ImageUpload';
import Button from '../../components/UI/Button';
import Modal from '../../components/UI/Modal';
import Input from '../../components/UI/Input';
import Notification from '../../components/UI/Notification';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { useForm } from 'react-hook-form';
import { Edit, Trash2, Eye, Plus, Image, Search, Filter, Download, Upload, ToggleLeft, ToggleRight } from 'lucide-react';

const BannerManagement = () => {
  const { 
    banners, 
    loading, 
    error,
    createBanner, 
    updateBanner, 
    deleteBanner,
    refetch: refetchBanners
  } = useBanners();
  
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, banner: null });
  const [viewModal, setViewModal] = useState({ open: false, banner: null });
  const [editingBanner, setEditingBanner] = useState(null);
  const [bannerImage, setBannerImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  // Banner position options
  const positionOptions = [
    { value: 'home-top', label: 'Homepage Top' },
    { value: 'home-middle', label: 'Homepage Middle' },
    { value: 'home-bottom', label: 'Homepage Bottom' },
    { value: 'category-top', label: 'Category Page Top' },
    { value: 'promo-sidebar', label: 'Promo Sidebar' },
    { value: 'header', label: 'Header Banner' },
    { value: 'footer', label: 'Footer Banner' },
    { value: 'popup', label: 'Popup Banner' }
  ];

  // Initialize form when editing banner changes
  useEffect(() => {
    if (editingBanner) {
      setValue('title', editingBanner.title || '');
      setValue('subtitle', editingBanner.subtitle || '');
      setValue('buttonText', editingBanner.buttonText || '');
      setValue('buttonLink', editingBanner.buttonLink || '');
      setValue('position', editingBanner.position || 'home-top');
      setValue('isActive', editingBanner.isActive !== false);
      setValue('order', editingBanner.order || 0);
      
      // Set image for editing
      if (editingBanner.image) {
        setBannerImage([{ 
          url: editingBanner.image.url || editingBanner.image, 
          file: null,
          public_id: editingBanner.image.public_id 
        }]);
      } else {
        setBannerImage([]);
      }
    } else {
      // Reset form for new banner
      reset({
        title: '',
        subtitle: '',
        buttonText: '',
        buttonLink: '',
        position: 'home-top',
        isActive: true,
        order: 0
      });
      setBannerImage([]);
    }
  }, [editingBanner, reset, setValue]);

  // Reset form function
  const resetForm = () => {
    reset({
      title: '',
      subtitle: '',
      buttonText: '',
      buttonLink: '',
      position: 'home-top',
      isActive: true,
      order: 0
    });
    setBannerImage([]);
    setEditingBanner(null);
  };

  // Handle form submission
  const handleFormSubmit = async (data) => {
    if (bannerImage.length === 0) {
      showNotification('Please upload a banner image', 'error');
      return;
    }

    try {
      setSubmitting(true);
      
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subtitle', data.subtitle || '');
      formData.append('buttonText', data.buttonText || '');
      formData.append('buttonLink', data.buttonLink || '');
      formData.append('position', data.position);
      formData.append('isActive', data.isActive);
      formData.append('order', data.order || 0);
      
      // Add image file
      if (bannerImage[0].file) {
        formData.append('image', bannerImage[0].file);
      }

      if (editingBanner) {
        await updateBanner(editingBanner._id, formData);
        showNotification('Banner updated successfully!', 'success');
      } else {
        await createBanner(formData);
        showNotification('Banner created successfully!', 'success');
      }
      
      setShowModal(false);
      resetForm();
      refetchBanners();
    } catch (err) {
      console.error('Error submitting banner:', err);
      showNotification(err.response?.data?.message || err.message || 'Operation failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete banner
  const handleDelete = async (banner) => {
    try {
      setSubmitting(true);
      await deleteBanner(banner._id);
      showNotification('Banner deleted successfully!', 'success');
      setDeleteModal({ open: false, banner: null });
      refetchBanners();
    } catch (err) {
      console.error('Error deleting banner:', err);
      showNotification(err.response?.data?.message || err.message || 'Delete failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle banner status
  const toggleBannerStatus = async (banner) => {
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', banner.title);
      formData.append('subtitle', banner.subtitle || '');
      formData.append('buttonText', banner.buttonText || '');
      formData.append('buttonLink', banner.buttonLink || '');
      formData.append('position', banner.position);
      formData.append('isActive', !banner.isActive);
      formData.append('order', banner.order || 0);

      await updateBanner(banner._id, formData);
      showNotification(`Banner ${!banner.isActive ? 'activated' : 'deactivated'} successfully!`, 'success');
      refetchBanners();
    } catch (err) {
      showNotification(err.response?.data?.message || 'Status update failed', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  // Notification helper
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Modal handlers
  const openCreateModal = () => {
    setEditingBanner(null);
    setShowModal(true);
  };

  const openEditModal = (banner) => {
    if (!banner || !banner._id) {
      showNotification('Invalid banner data', 'error');
      return;
    }
    setEditingBanner(banner);
    setShowModal(true);
  };

  const openViewModal = (banner) => {
    setViewModal({ open: true, banner });
  };

  const openDeleteModal = (banner) => {
    setDeleteModal({ open: true, banner });
  };

  const closeModal = () => {
    setShowModal(false);
    setViewModal({ open: false, banner: null });
    setDeleteModal({ open: false, banner: null });
    resetForm();
  };

  // Filter and sort banners
  const getFilteredAndSortedBanners = () => {
    let filtered = getSafeBanners();

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(banner =>
        banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        banner.buttonText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(banner => 
        statusFilter === 'active' ? banner.isActive : !banner.isActive
      );
    }

    // Apply position filter
    if (positionFilter !== 'all') {
      filtered = filtered.filter(banner => banner.position === positionFilter);
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return filtered;
  };

  // Handle sort
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Safe data access functions
  const getSafeBannerValue = (banner, key, defaultValue = '') => {
    if (!banner || typeof banner !== 'object') return defaultValue;
    return banner[key] !== undefined ? banner[key] : defaultValue;
  };

  const getImageUrl = (banner) => {
    const image = getSafeBannerValue(banner, 'image');
    if (!image) return '/images/placeholder/banner.png';
    return typeof image === 'string' ? image : (image.url || '/images/placeholder/banner.png');
  };

  const getPositionLabel = (position) => {
    const option = positionOptions.find(opt => opt.value === position);
    return option ? option.label : position;
  };

  const getCreatedDate = (banner) => {
    const date = getSafeBannerValue(banner, 'createdAt');
    return date ? new Date(date).toLocaleDateString() : 'Unknown';
  };

  // Safe data preparation
  const getSafeBanners = () => {
    if (!Array.isArray(banners)) return [];
    
    return banners
      .filter(banner => banner && typeof banner === 'object' && banner._id)
      .map(banner => ({
        ...banner,
        title: banner.title || 'No Title',
        subtitle: banner.subtitle || '',
        buttonText: banner.buttonText || '',
        buttonLink: banner.buttonLink || '',
        position: banner.position || 'home-top',
        isActive: banner.isActive !== false,
        order: banner.order || 0,
        image: banner.image || ''
      }));
  };

  // Export banners (mock function)
  const exportBanners = () => {
    const data = getFilteredAndSortedBanners();
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Title,Subtitle,Button Text,Button Link,Position,Status,Order,Created At\n"
      + data.map(banner => 
          `"${banner.title}","${banner.subtitle}","${banner.buttonText}","${banner.buttonLink}","${getPositionLabel(banner.position)}","${banner.isActive ? 'Active' : 'Inactive'}","${banner.order}","${getCreatedDate(banner)}"`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "banners.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showNotification('Banners exported successfully!', 'success');
  };

  // Columns configuration for DataTable
  const columns = [
    {
      key: 'image',
      header: 'Image',
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        return (
          <div className="relative group">
            <img 
              src={getImageUrl(banner)} 
              alt={getSafeBannerValue(banner, 'title', 'Banner')}
              className="w-20 h-12 rounded object-cover border hover:shadow-md transition-shadow"
              onError={(e) => {
                e.target.src = '/images/placeholder/banner.png';
              }}
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded flex items-center justify-center">
              <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        );
      }
    },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        return (
          <div>
            <span className="font-medium text-gray-900 block">{getSafeBannerValue(banner, 'title', 'No Title')}</span>
            <div className="text-xs text-gray-500 mt-1">
              ID: {banner._id?.substring(0, 8)}...
            </div>
          </div>
        );
      }
    },
    {
      key: 'subtitle',
      header: 'Subtitle',
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        return (
          <span title={getSafeBannerValue(banner, 'subtitle', '')} className="text-sm text-gray-600 line-clamp-2">
            {getSafeBannerValue(banner, 'subtitle', 'No subtitle')}
          </span>
        );
      }
    },
    {
      key: 'position',
      header: 'Position',
      sortable: true,
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        const position = getSafeBannerValue(banner, 'position', 'home-top');
        return (
          <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">
            {getPositionLabel(position)}
          </span>
        );
      }
    },
    {
      key: 'buttonText',
      header: 'Button',
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        const buttonText = getSafeBannerValue(banner, 'buttonText', '');
        return buttonText ? (
          <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
            {buttonText}
          </span>
        ) : (
          <span className="text-xs text-gray-400">No button</span>
        );
      }
    },
    {
      key: 'order',
      header: 'Order',
      sortable: true,
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        return (
          <span className="text-sm bg-purple-100 text-purple-800 px-3 py-1 rounded-full font-medium">
            {getSafeBannerValue(banner, 'order', 0)}
          </span>
        );
      }
    },
    {
      key: 'isActive',
      header: 'Status',
      sortable: true,
      render: (value, item) => {
        const banner = item || value;
        if (!banner) return null;
        const isActive = getSafeBannerValue(banner, 'isActive', true);
        return (
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${
            isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {isActive ? 'Active' : 'Inactive'}
          </span>
        );
      }
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, item) => {
        // Support both (item) and (value, item) signatures
        const banner = item || value;
        if (!banner) return null;
        return (
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="small"
              onClick={() => openViewModal(banner)}
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="small"
              onClick={() => openEditModal(banner)}
              disabled={submitting}
              title="Edit Banner"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant={banner.isActive ? "outline" : "primary"}
              size="small"
              onClick={() => toggleBannerStatus(banner)}
              disabled={submitting}
              title={banner.isActive ? "Deactivate" : "Activate"}
            >
              {banner.isActive ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={() => openDeleteModal(banner)}
              disabled={submitting}
              title="Delete Banner"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        );
      }
    }
  ];

  const filteredBanners = getFilteredAndSortedBanners();

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading banners..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="mb-4 lg:mb-0">
                <h1 className="text-2xl font-bold text-gray-900">Banner Management</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Manage homepage banners, promotions, and marketing content
                </p>
              </div>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button
                  onClick={exportBanners}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Export</span>
                </Button>
                <Button
                  onClick={openCreateModal}
                  disabled={submitting || loading}
                  className="flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Banner</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* Notifications */}
          {error && (
            <div className="mb-4">
              <Notification
                type="error"
                message={error}
                onClose={() => {}}
              />
            </div>
          )}
          
          {notification.show && (
            <div className="mb-4">
              <Notification
                type={notification.type}
                message={notification.message}
                onClose={() => setNotification({ ...notification, show: false })}
              />
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
                    placeholder="Search banners by title, subtitle, or button text..."
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
                  value={positionFilter}
                  onChange={(e) => setPositionFilter(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Positions</option>
                  {positionOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Showing {filteredBanners.length} of {getSafeBanners().length} banners
              </div>
              <div className="text-sm text-gray-600">
                {getSafeBanners().filter(banner => banner.isActive).length} active, 
                {' '}{getSafeBanners().filter(banner => !banner.isActive).length} inactive
              </div>
            </div>
          </div>

          {/* Banners Table */}
          {filteredBanners.length === 0 && !loading ? (
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="text-gray-400 mb-4">
                <Image className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Banners Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || statusFilter !== 'all' || positionFilter !== 'all'
                  ? 'No banners match your search criteria.' 
                  : 'Get started by creating your first banner.'
                }
              </p>
              <Button onClick={openCreateModal}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Banner
              </Button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow">
              <DataTable
                data={filteredBanners}
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
        
        {/* Add/Edit Banner Modal */}
        <Modal
          isOpen={showModal}
          onClose={closeModal}
          title={editingBanner ? 'Edit Banner' : 'Add New Banner'}
          size="large"
        >
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Banner Title *"
                {...register('title', { 
                  required: 'Banner title is required',
                  minLength: { value: 2, message: 'Title must be at least 2 characters' }
                })}
                error={errors.title}
                placeholder="Enter banner title"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Position *
              </label>
              <select
                {...register('position', { required: 'Position is required' })}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.position ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                {positionOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <Input
              label="Subtitle"
              type="textarea"
              {...register('subtitle', {
                maxLength: { value: 200, message: 'Subtitle cannot exceed 200 characters' }
              })}
              error={errors.subtitle}
              placeholder="Enter banner subtitle (optional)"
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Button Text"
                {...register('buttonText', {
                  maxLength: { value: 20, message: 'Button text cannot exceed 20 characters' }
                })}
                error={errors.buttonText}
                placeholder="Shop Now, Learn More, etc."
              />
            </div>
            
            <div>
              <Input
                label="Button Link"
                {...register('buttonLink')}
                placeholder="/products?category=electronics"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Display Order"
                type="number"
                {...register('order', {
                  min: { value: 0, message: 'Order must be 0 or greater' }
                })}
                error={errors.order}
                placeholder="0"
                helpText="Lower numbers display first"
              />
            </div>
            
            <div className="flex items-center justify-center">
              <input
                type="checkbox"
                id="isActive"
                {...register('isActive')}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                Active Banner
              </label>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Banner Image *
            </label>
            <ImageUpload
              images={bannerImage}
              onImagesChange={setBannerImage}
              multiple={false}
              label=""
              helpText="Upload banner image (recommended size: 1200x400px, JPG/PNG/WebP, max 5MB)"
              maxSizeMB={5}
              aspectRatio="3/1"
            />
            {bannerImage.length === 0 && (
              <p className="mt-1 text-sm text-red-600">Banner image is required</p>
            )}
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || bannerImage.length === 0}
            >
              {submitting ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
            </Button>
          </div>
        </form>
        </Modal>

        {/* View Banner Modal */}
        <Modal
          isOpen={viewModal.open}
          onClose={closeModal}
          title="Banner Details"
          size="medium"
        >
        {viewModal.banner && (
          <div className="space-y-4">
            <div className="flex justify-center">
              <img 
                src={getImageUrl(viewModal.banner)} 
                alt={getSafeBannerValue(viewModal.banner, 'title', 'Banner')}
                className="w-full h-40 rounded-lg object-cover border"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <p className="mt-1 text-sm text-gray-900 font-medium">
                  {getSafeBannerValue(viewModal.banner, 'title', 'No Title')}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <p className="mt-1">
                  <span className={`px-2 py-1 text-xs rounded font-medium ${
                    getSafeBannerValue(viewModal.banner, 'isActive', true) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {getSafeBannerValue(viewModal.banner, 'isActive', true) ? 'Active' : 'Inactive'}
                  </span>
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getPositionLabel(getSafeBannerValue(viewModal.banner, 'position', 'home-top'))}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Order</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getSafeBannerValue(viewModal.banner, 'order', 0)}
                </p>
              </div>
            </div>
            
            {getSafeBannerValue(viewModal.banner, 'subtitle') && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Subtitle</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getSafeBannerValue(viewModal.banner, 'subtitle')}
                </p>
              </div>
            )}
            
            {(getSafeBannerValue(viewModal.banner, 'buttonText') || getSafeBannerValue(viewModal.banner, 'buttonLink')) && (
              <div className="grid grid-cols-2 gap-4">
                {getSafeBannerValue(viewModal.banner, 'buttonText') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button Text</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {getSafeBannerValue(viewModal.banner, 'buttonText')}
                    </p>
                  </div>
                )}
                {getSafeBannerValue(viewModal.banner, 'buttonLink') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Button Link</label>
                    <p className="mt-1 text-sm text-blue-600 truncate">
                      {getSafeBannerValue(viewModal.banner, 'buttonLink')}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  closeModal();
                  openEditModal(viewModal.banner);
                }}
              >
                Edit Banner
              </Button>
            </div>
          </div>
        )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.open}
          onClose={closeModal}
          title="Delete Banner"
          size="small"
        >
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <img 
              src={getImageUrl(deleteModal.banner)} 
              alt={getSafeBannerValue(deleteModal.banner, 'title', 'Banner')}
              className="w-16 h-10 rounded object-cover border"
            />
            <div>
              <p className="font-medium text-gray-900">
                {getSafeBannerValue(deleteModal.banner, 'title', 'Unknown Banner')}
              </p>
              <p className="text-sm text-gray-500">
                {getPositionLabel(getSafeBannerValue(deleteModal.banner, 'position', 'home-top'))}
              </p>
            </div>
          </div>
          
          <p className="text-gray-700">
            Are you sure you want to delete this banner? This action cannot be undone.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={closeModal}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => handleDelete(deleteModal.banner)}
              disabled={submitting}
            >
              {submitting ? 'Deleting...' : 'Delete Banner'}
            </Button>
          </div>
        </div>
        </Modal>
    </div>
  );
};

export default BannerManagement;
