import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, ShoppingBag, Tag, FileText, Image, 
  RefreshCw, BarChart3, Users, Settings, Link as LinkIcon,
  Heading1, Heading2, Type 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useBlogs from '../../hooks/useBlogs';
import useBanners from '../../hooks/useBanners';

import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import ImageUpload from '../../components/Admins/ImageUpload';
import RichTextEditor from '../../components/Admins/RichTextEditor';
import { api, categoriesAPI, productsAPI, bannersAPI, blogsAPI } from '../../services/api';
import { useForm } from 'react-hook-form';
import useNotification from '../../hooks/useNotification';

const AdminDashboard = () => {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { products = [], loading: productsLoading, refetch: refetchProducts } = useProducts();
  const { categories = [], loading: categoriesLoading, refetch: refetchCategories } = useCategories();
  const { blogs = [], loading: blogsLoading, refetch: refetchBlogs } = useBlogs({ status: '' });
  const { banners = [], loading: bannersLoading, refetch: refetchBanners } = useBanners();
  const { addNotification } = useNotification();

  // Modal states
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [blogModalOpen, setBlogModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, type: '', item: null });
  // Hidden features toggles (allow removing/hiding old functionality)
  const [hiddenFeatures, setHiddenFeatures] = useState([]);

  // Form states
  const [categoryImage, setCategoryImage] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [bannerImage, setBannerImage] = useState([]);
  const [productTags, setProductTags] = useState([]);
  const [blogTags, setBlogTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Blog specific states
  const [featuredImage, setFeaturedImage] = useState([]);
  const [contentImages, setContentImages] = useState([]);
  const [blogContent, setBlogContent] = useState('');
  const [blogStatus, setBlogStatus] = useState('draft');

  // Track original images for deletion detection
  const [originalProductImages, setOriginalProductImages] = useState([]);
  const [originalFeaturedImage, setOriginalFeaturedImage] = useState([]);
  const [originalContentImages, setOriginalContentImages] = useState([]);

  // React Hook Form instances
  const { 
    register: categoryRegister, 
    handleSubmit: handleCategorySubmit, 
    reset: resetCategoryForm, 
    setValue: setCategoryValue, 
    formState: { errors: categoryErrors } 
  } = useForm();

  const { 
    register: productRegister, 
    handleSubmit: handleProductSubmit, 
    reset: resetProductForm, 
    setValue: setProductValue, 
    formState: { errors: productErrors } 
  } = useForm();

  const { 
    register: bannerRegister, 
    handleSubmit: handleBannerSubmit, 
    reset: resetBannerForm, 
    setValue: setBannerValue, 
    formState: { errors: bannerErrors } 
  } = useForm();

  const { 
    register: blogRegister, 
    handleSubmit: handleBlogSubmit, 
    reset: resetBlogForm, 
    setValue: setBlogValue,
    watch: watchBlog,
    formState: { errors: blogErrors } 
  } = useForm();

  // Check admin access
  useEffect(() => {
    if (!isAdmin) {
      navigate('/unauthorized');
    }
  }, [isAdmin, navigate]);

  // Refresh data function
  const refreshData = useCallback(async () => {
    try {
      setSubmitting(true);
      await Promise.all([
        refetchProducts?.(),
        refetchCategories?.(),
        refetchBlogs?.(),
        refetchBanners?.()
      ]);
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
  }, [refetchProducts, refetchCategories, refetchBlogs, refetchBanners, addNotification]);

  // Open modals
  const openCategoryModal = (category = null) => {
    setEditingItem(category);
    if (category) {
      setCategoryValue('name', category.name || '');
      setCategoryValue('description', category.description || '');
      if (category.image) {
        setCategoryImage([{ url: category.image.url, file: null }]);
      } else {
        setCategoryImage([]);
      }
    } else {
      resetCategoryForm({ name: '', description: '' });
      setCategoryImage([]);
    }
    setCategoryModalOpen(true);
  };

  const openProductModal = (product = null) => {
    setEditingItem(product);
    if (product) {
      setProductValue('title', product.title || '');
      setProductValue('description', product.description || '');
      setProductValue('price', product.price || '');
      setProductValue('stock', product.stock || '');
      setProductValue('category', product.category?._id || '');
      setProductValue('productLink', product.productLink || '');
      
      if (product.images && product.images.length > 0) {
        const imagesToShow = product.images.slice(0, 5).map(img => ({ 
          url: img.url, 
          file: null,
          public_id: img.public_id 
        }));
        setProductImages(imagesToShow);
        // Save original images for deletion detection
        setOriginalProductImages(imagesToShow);
      } else {
        setProductImages([]);
        setOriginalProductImages([]);
      }
      
      setProductTags(product.tags || []);
    } else {
      resetProductForm({ 
        title: '', 
        description: '', 
        price: '', 
        stock: '', 
        category: '', 
        productLink: '' 
      });
      setProductImages([]);
      setOriginalProductImages([]);
      setProductTags([]);
    }
    setProductModalOpen(true);
  };

  const openBannerModal = (banner = null) => {
    setEditingItem(banner);
    if (banner) {
      setBannerValue('title', banner.title || '');
      setBannerValue('subtitle', banner.subtitle || '');
      setBannerValue('buttonText', banner.buttonText || '');
      setBannerValue('buttonLink', banner.buttonLink || '');
      setBannerValue('position', banner.position || 'home-top');
      if (banner.image) {
        setBannerImage([{ url: banner.image.url, file: null }]);
      } else {
        setBannerImage([]);
      }
    } else {
      resetBannerForm({ title: '', subtitle: '', buttonText: '', buttonLink: '', position: 'home-top' });
      setBannerImage([]);
    }
    setBannerModalOpen(true);
  };

  // Toggle visibility of dashboard features
  const toggleFeature = (feature) => {
    setHiddenFeatures(prev => prev.includes(feature) ? prev.filter(f => f !== feature) : [...prev, feature]);
  };

  const openBlogModal = (blog = null) => {
    setEditingItem(blog);
    if (blog) {
      try {
        setBlogValue('title', blog.title || '');
        setBlogValue('excerpt', blog.excerpt || '');
        
        // Handle category safely
        const categoryId = blog.category?._id || (typeof blog.category === 'string' ? blog.category : '');
        setBlogValue('category', categoryId);
        
        setBlogTags(blog.tags || []);
        setBlogStatus(blog.status || 'draft');
        
        // Set featured image - handle both string URLs and object structures
        if (blog.featuredImage) {
          const imageUrl = typeof blog.featuredImage === 'string' 
            ? blog.featuredImage 
            : blog.featuredImage.url;
          const publicId = typeof blog.featuredImage === 'string'
            ? null
            : blog.featuredImage.public_id;
          
          const featuredImg = [{ 
            url: imageUrl, 
            file: null,
            public_id: publicId
          }];
          setFeaturedImage(featuredImg);
          setOriginalFeaturedImage(featuredImg);
        } else {
          setFeaturedImage([]);
          setOriginalFeaturedImage([]);
        }
        
        // Set content images - handle both string URLs and object structures
        if (blog.contentImages && blog.contentImages.length > 0) {
          const contentImgs = blog.contentImages.map((img, index) => {
            const imageUrl = typeof img === 'string' ? img : img.url;
            const publicId = typeof img === 'string' ? null : img.public_id;
            const altText = (typeof img === 'string' ? '' : img.alt) || `Blog content image ${index + 1}`;
            const idForEditor = publicId || `img-${Date.now()}-${index}`;
            return {
              url: imageUrl,
              file: null,
              public_id: publicId,
              alt: altText,
              id: idForEditor,
              placeholder: `![${altText}](image:${idForEditor})`,
              position: (typeof img === 'string' ? 'content' : img.position) || 'content'
            };
          });
          setContentImages(contentImgs);
          setOriginalContentImages(contentImgs);
        } else {
          setContentImages([]);
          setOriginalContentImages([]);
        }
        
        // Set blog content
        setBlogContent(blog.content || '');
        // Blog modal opened
      } catch (error) {
        console.error('Error opening blog modal:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to open blog editor: ' + error.message
        });
        return;
      }
    } else {
      resetBlogForm({ title: '', excerpt: '', category: '' });
      setFeaturedImage([]);
      setContentImages([]);
      setOriginalFeaturedImage([]);
      setOriginalContentImages([]);
      setBlogContent('');
      setBlogTags([]);
      setBlogStatus('draft');
    }
    setBlogModalOpen(true);
  };

  // Close modals
  const closeModals = () => {
    setCategoryModalOpen(false);
    setProductModalOpen(false);
    setBannerModalOpen(false);
    setBlogModalOpen(false);
    setDeleteModal({ open: false, type: '', item: null });
    setEditingItem(null);
    
    resetCategoryForm();
    resetProductForm();
    resetBannerForm();
    resetBlogForm();
    
    setCategoryImage([]);
    setProductImages([]);
    setBannerImage([]);
    setFeaturedImage([]);
    setContentImages([]);
    setProductTags([]);
    setBlogTags([]);
    setBlogContent('');
    setBlogStatus('draft');
    setTagInput('');
  };

  // Tag management
  const addTag = (type) => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag) {
      if (type === 'product' && !productTags.includes(trimmedTag)) {
        setProductTags([...productTags, trimmedTag]);
      } else if (type === 'blog' && !blogTags.includes(trimmedTag)) {
        setBlogTags([...blogTags, trimmedTag]);
      }
      setTagInput('');
    }
  };

  const removeTag = (index, type) => {
    if (type === 'product') {
      setProductTags(productTags.filter((_, i) => i !== index));
    } else if (type === 'blog') {
      setBlogTags(blogTags.filter((_, i) => i !== index));
    }
  };

  // CRUD Operations
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
      formData.append('name', data.name || '');
      formData.append('description', data.description || '');
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
        message: error.response?.data?.message || error.message || 'Operation failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Helper function to detect deleted images
  const getDeletedImages = (originalImages, currentImages) => {
    if (!editingItem) return [];
    
    const deletedPublicIds = [];
    originalImages.forEach(origImg => {
      if (origImg.public_id) {
        // Check if this image still exists in current images
        const stillExists = currentImages.some(curr => curr.public_id === origImg.public_id);
        if (!stillExists) {
          deletedPublicIds.push(origImg.public_id);
        }
      }
    });
    return deletedPublicIds;
  };

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
      
      if (productTags.length > 0) {
        formData.append('tags', productTags.join(','));
      }

      productImages.forEach((image) => {
        if (image.file) {
          formData.append('images', image.file);
        }
      });

      // Track deleted images when editing
      if (editingItem) {
        const deletedImageIds = getDeletedImages(originalProductImages, productImages);
        if (deletedImageIds.length > 0) {
          formData.append('deletedImages', JSON.stringify(deletedImageIds));
        }
      }

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

  const handleCreateBanner = async (data) => {
    if (!bannerImage[0]) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please upload a banner image' 
      });
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
      
      if (bannerImage[0].file) {
        formData.append('image', bannerImage[0].file);
      }

      let result;
      if (editingItem) {
        result = await bannersAPI.update(editingItem._id, formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Banner updated successfully' 
        });
      } else {
        result = await bannersAPI.create(formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Banner created successfully' 
        });
      }

      closeModals();
      await refreshData();
    } catch (error) {
      console.error('Banner operation error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || 'Operation failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateBlog = async (data) => {
    // Basic validation
    if (!editingItem && !featuredImage[0]) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please upload a featured image' 
      });
      return;
    }

    if (!blogContent.trim()) {
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: 'Please add blog content' 
      });
      return;
    }

    try {
      setSubmitting(true);
      
      // Don't clean content - let backend handle it
      const cleanedContent = blogContent.trim();
      
      if (!cleanedContent) {
        addNotification({ 
          type: 'error', 
          title: 'Error', 
          message: 'Blog content cannot be empty' 
        });
        setSubmitting(false);
        return;
      }

      // Blog submission data prepared

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', cleanedContent);
      formData.append('status', blogStatus);
      
      if (data.category) {
        formData.append('category', data.category);
      }
      
      if (blogTags.length > 0) {
        formData.append('tags', JSON.stringify(blogTags));
      }

      // Handle featured image
      if (featuredImage[0]?.file) {
        formData.append('featuredImage', featuredImage[0].file);
      }

      // Handle content images
      const newContentImages = contentImages.filter(img => img.file);
      if (newContentImages.length > 0) {
        const placeholders = [];
        const contentAlts = [];
        
        newContentImages.forEach((image) => {
          formData.append('contentImages', image.file);
          if (image.id) {
            placeholders.push(image.id);
            contentAlts.push(image.alt || 'Blog image');
          }
        });

        if (placeholders.length > 0) {
          formData.append('contentImagePlaceholders', JSON.stringify(placeholders));
          formData.append('contentImagesAlts', JSON.stringify(contentAlts));
        }
      }

      let result;
      if (editingItem) {
        result = await blogsAPI.update(editingItem._id, formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Blog updated successfully' 
        });
      } else {
        result = await blogsAPI.create(formData);
        addNotification({ 
          type: 'success', 
          title: 'Success', 
          message: 'Blog created successfully'
        });
      }

      closeModals();
      await refreshData();
      
    } catch (error) {
      console.error('❌ Blog operation error:', error);
      addNotification({ 
        type: 'error', 
        title: 'Error', 
        message: error.response?.data?.message || error.message || 'Operation failed' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Delete operations
  const handleDelete = async () => {
    if (!deleteModal.item) return;

    try {
      setSubmitting(true);
      let result;
      
      switch (deleteModal.type) {
        case 'category':
          result = await categoriesAPI.delete(deleteModal.item._id);
          break;
        case 'product':
          result = await productsAPI.delete(deleteModal.item._id);
          break;
        case 'banner':
          result = await bannersAPI.delete(deleteModal.item._id);
          break;
        case 'blog':
          result = await blogsAPI.delete(deleteModal.item._id);
          break;
        default:
          throw new Error('Unknown delete type');
      }

      addNotification({ 
        type: 'success', 
        title: 'Success', 
        message: `${deleteModal.type} deleted successfully` 
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

  // Handle Enter key for tags
  const handleTagKeyPress = (e, type) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(type);
    }
  };

  if (productsLoading || categoriesLoading || blogsLoading || bannersLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gradient-to-r from-blue-600 to-cyan-600 shadow-lg">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-sm text-blue-100 mt-1">
                  Welcome back, {user?.name || 'Admin'}! 
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0">
                <Button
                  onClick={refreshData}
                  disabled={submitting}
                  className="flex items-center space-x-2 bg-white text-blue-600 hover:bg-blue-50"
                >
                  <RefreshCw className={`w-4 h-4 ${submitting ? 'animate-spin' : ''}`} />
                  <span>{submitting ? 'Refreshing...' : 'Refresh Data'}</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 bg-gray-950">
          {/* Quick Actions - Responsive Grid */}
          {!hiddenFeatures.includes('blogs') && (
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-500/30 rounded-lg shadow-lg p-4 sm:p-6 mb-6 backdrop-blur-sm">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              <button 
                onClick={() => openCategoryModal()} 
                className="bg-blue-50 hover:bg-blue-100 p-3 sm:p-4 rounded-lg text-center transition-all transform hover:scale-105 border-2 border-blue-200 hover:border-blue-400 group"
              >
                <div className="text-blue-600 text-xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform">
                  <Tag className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="font-semibold text-blue-800 text-sm sm:text-base">Add Category</h3>
              </button>
              
              <button 
                onClick={() => openProductModal()} 
                className="bg-teal-50 hover:bg-teal-100 p-3 sm:p-4 rounded-lg text-center transition-all transform hover:scale-105 border-2 border-teal-200 hover:border-teal-400 group"
              >
                <div className="text-teal-600 text-xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform">
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="font-semibold text-teal-800 text-sm sm:text-base">Add Product</h3>
              </button>
              
              <button 
                onClick={() => openBlogModal()} 
                className="bg-orange-50 hover:bg-orange-100 p-3 sm:p-4 rounded-lg text-center transition-all transform hover:scale-105 border-2 border-orange-200 hover:border-orange-400 group"
              >
                <div className="text-orange-600 text-xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="font-semibold text-orange-800 text-sm sm:text-base">Write Blog</h3>
              </button>
              
              <button 
                onClick={() => openBannerModal()} 
                className="bg-fuchsia-50 hover:bg-fuchsia-100 p-3 sm:p-4 rounded-lg text-center transition-all transform hover:scale-105 border-2 border-fuchsia-200 hover:border-fuchsia-400 group"
              >
                <div className="text-fuchsia-600 text-xl sm:text-2xl mb-2 group-hover:scale-110 transition-transform">
                  <Image className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className="font-semibold text-fuchsia-800 text-sm sm:text-base">Add Banner</h3>
              </button>
              
              <button
                onClick={() => toggleFeature('banners')}
                className={`p-3 sm:p-4 rounded-lg text-center transition-all transform hover:scale-105 border-2 ${hiddenFeatures.includes('banners') ? 'bg-orange-50 border-orange-300 hover:bg-orange-100' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
              >
                <div className={`text-xl sm:text-2xl mb-2 ${hiddenFeatures.includes('banners') ? 'text-orange-600' : 'text-gray-600'}`}>
                  <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className={`font-semibold text-sm sm:text-base ${hiddenFeatures.includes('banners') ? 'text-orange-800' : 'text-gray-800'}`}>{hiddenFeatures.includes('banners') ? 'Restore Banners' : 'Hide Banners'}</h3>
              </button>
              
              <button
                onClick={() => toggleFeature('blogs')}
                className={`p-3 sm:p-4 rounded-lg text-center transition-all transform hover:scale-105 border-2 ${hiddenFeatures.includes('blogs') ? 'bg-orange-50 border-orange-300 hover:bg-orange-100' : 'bg-gray-50 border-gray-300 hover:bg-gray-100'}`}
              >
                <div className={`text-xl sm:text-2xl mb-2 ${hiddenFeatures.includes('blogs') ? 'text-orange-600' : 'text-gray-600'}`}>
                  <Trash2 className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" />
                </div>
                <h3 className={`font-semibold text-sm sm:text-base ${hiddenFeatures.includes('blogs') ? 'text-orange-800' : 'text-gray-800'}`}>{hiddenFeatures.includes('blogs') ? 'Restore Blogs' : 'Hide Blogs'}</h3>
              </button>
            </div>
          </div>
          )}

          {/* Categories Section - Responsive Grid */}
          <div className="bg-gray-900 border border-blue-500/20 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg font-semibold text-white">Categories ({categories.length})</h2>
              <div className="flex space-x-2">
                <Button onClick={() => openCategoryModal()} size="small" className="text-xs sm:text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />Add
                </Button>
                <Link to="/admin/categories">
                  <Button variant="outline" size="small" className="text-xs sm:text-sm">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.slice(0, 4).map((category) => (
                <div key={category._id} className="border border-blue-500/20 bg-gray-800 rounded-lg p-3 sm:p-4 hover:border-blue-500/40 hover:shadow-lg transition-all">
                  <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                    <img 
                      src={category.image?.url || '/images/placeholder.jpg'} 
                      alt={category.name} 
                      className="w-8 h-8 sm:w-12 sm:h-12 object-cover rounded-lg" 
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white truncate text-sm sm:text-base">{category.name}</h3>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">{category.description}</p>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={() => openCategoryModal(category)} 
                      className="flex-1 text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => setDeleteModal({ open: true, type: 'category', item: category })}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Products Section - Responsive Grid */}
          <div className="bg-gray-900 border border-cyan-500/20 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-semibold text-white">Listings ({products.length})</h2>
              <div className="flex space-x-2">
                <Button onClick={() => openProductModal()} size="small" className="text-xs sm:text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />Add
                </Button>
                  <Link to="/admin/listings">
                  <Button variant="outline" size="small" className="text-xs sm:text-sm">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />View All
                  </Button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {products.slice(0, 4).map((product) => (
                <div key={product._id} className="border border-cyan-500/20 bg-gray-800 rounded-lg p-3 sm:p-4 hover:border-cyan-500/40 hover:shadow-lg transition-all">
                  <img 
                    src={product.images?.[0]?.url || '/images/placeholder.jpg'} 
                    alt={product.title} 
                    className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3" 
                  />
                  <h3 className="font-medium text-white mb-1 truncate text-sm sm:text-base">{product.title}</h3>
                  <p className="text-base sm:text-lg font-semibold text-cyan-400 mb-1 sm:mb-2">${product.price}</p>
                  <div className="flex justify-between items-center mb-2 sm:mb-3">
                    <span className={`px-2 py-1 text-xs rounded ${
                      product.stock > 0 ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'
                    }`}>
                      Stock: {product.stock}
                    </span>
                    <span className="text-xs text-gray-400 truncate ml-2">{product.category?.name}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-xs text-gray-500">Images: {product.images?.length || 0}/5</span>
                  </div>
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button 
                      variant="outline" 
                      size="small" 
                      onClick={() => openProductModal(product)} 
                      className="flex-1 text-xs"
                    >
                      <Edit className="w-3 h-3 mr-1" />Edit
                    </Button>
                    <Button 
                      variant="danger" 
                      size="small" 
                      onClick={() => setDeleteModal({ open: true, type: 'product', item: product })}
                      className="text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banners Section - Responsive Grid */}
          {!hiddenFeatures.includes('banners') && (
            <div className="bg-gray-900 border border-fuchsia-500/20 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
                <h2 className="text-lg font-semibold text-white">Banners ({banners.length})</h2>
                <div className="flex space-x-2">
                  <Button onClick={() => openBannerModal()} size="small" className="text-xs sm:text-sm">
                    <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />Add
                  </Button>
                  <Link to="/admin/banners">
                    <Button variant="outline" size="small" className="text-xs sm:text-sm">
                      <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />View All
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {banners.slice(0, 2).map((banner) => (
                  <div key={banner._id} className="border border-fuchsia-500/20 bg-gray-800 rounded-lg p-3 sm:p-4 hover:border-fuchsia-500/40 hover:shadow-lg transition-all">
                    <img 
                      src={banner.image?.url || '/images/placeholder.jpg'} 
                      alt={banner.title} 
                      className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3" 
                    />
                    <h3 className="font-medium text-white mb-1 text-sm sm:text-base">{banner.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 line-clamp-2">{banner.subtitle}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-400 capitalize">{banner.position}</span>
                      <div className="flex space-x-1 sm:space-x-2">
                        <Button 
                          variant="outline" 
                          size="small" 
                          onClick={() => openBannerModal(banner)}
                          className="text-xs"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button 
                          variant="danger" 
                          size="small" 
                          onClick={() => setDeleteModal({ open: true, type: 'banner', item: banner })}
                          className="text-xs"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Blogs Section - Responsive Grid */}
          <div className="bg-gray-900 border border-orange-500/20 rounded-lg shadow-lg p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h2 className="text-lg font-semibold text-white">Blog Posts ({blogs.length})</h2>
              <div className="flex space-x-2">
                <Button onClick={() => openBlogModal()} size="small" className="text-xs sm:text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />Add
                </Button>
                <Link to="/admin/blogs">
                  <Button variant="outline" size="small" className="text-xs sm:text-sm">
                    <Eye className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />View All
                  </Button>
                </Link>
              </div>
            </div>
            
            {blogs.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <FileText className="w-10 h-10 sm:w-12 sm:h-12 text-gray-600 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-medium text-white mb-2">No blog posts yet</h3>
                <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">Get started by creating your first blog post.</p>
                <Button onClick={() => openBlogModal()} size="small" className="text-xs sm:text-sm">
                  <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />Create Blog Post
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {blogs.slice(0, 3).map((blog) => (
                  <div key={blog._id} className="border border-orange-500/20 bg-gray-800 rounded-lg p-3 sm:p-4 hover:border-orange-500/40 hover:shadow-lg transition-all">
                    <img 
                      src={blog.featuredImage?.url || '/images/placeholder.jpg'} 
                      alt={blog.title} 
                      className="w-full h-20 sm:h-32 object-cover rounded-lg mb-2 sm:mb-3" 
                    />
                    <h3 className="font-medium text-white mb-2 line-clamp-2 text-sm sm:text-base">{blog.title}</h3>
                    <p className="text-xs sm:text-sm text-gray-400 mb-2 sm:mb-3 line-clamp-2">{blog.excerpt}</p>
                    
                    {/* Status and Date */}
                    <div className="flex justify-between items-center mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        blog.status === 'published' ? 'bg-green-900/30 text-green-300' :
                        blog.status === 'draft' ? 'bg-yellow-900/30 text-yellow-300' :
                        'bg-gray-700 text-gray-300'
                      }`}>
                        {blog.status || 'draft'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'No date'}
                      </span>
                    </div>
                    
                    {/* Additional Info */}
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <span className="text-xs text-gray-500">
                        Images: {blog.contentImages?.length || 0}
                      </span>
                      <span className="text-xs text-gray-500">
                        Views: {blog.views || 0}
                      </span>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex space-x-1 sm:space-x-2">
                      <Button 
                        variant="outline" 
                        size="small" 
                        onClick={() => openBlogModal(blog)} 
                        className="flex-1 text-xs"
                      >
                        <Edit className="w-3 h-3 mr-1" />Edit
                      </Button>
                      <Button 
                        variant="danger" 
                        size="small" 
                        onClick={() => setDeleteModal({ open: true, type: 'blog', item: blog })}
                        className="text-xs"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>

      {/* Category Modal */}
      <Modal 
        isOpen={categoryModalOpen} 
        onClose={closeModals} 
        title={editingItem ? 'Edit Category' : 'Add Category'} 
        size="medium"
      >
        <form onSubmit={handleCategorySubmit(handleCreateCategory)} className="p-4 sm:p-6 space-y-4">
          <ImageUpload 
            images={categoryImage} 
            onImagesChange={setCategoryImage} 
            multiple={false} 
            label="Category Image" 
          />
          <Input 
            label="Name"
            dark={true}
            {...categoryRegister('name', { required: 'Category name is required' })} 
            error={categoryErrors.name} 
          />
          <Input 
            label="Description"
            dark={true}
            type="textarea" 
            {...categoryRegister('description', { required: 'Category description is required' })} 
            error={categoryErrors.description} 
          />
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

      {/* Product Modal */}
      <Modal 
        isOpen={productModalOpen} 
        onClose={closeModals} 
        title={editingItem ? 'Edit Product' : 'Add Product'} 
        size="large"
      >
        <form onSubmit={handleProductSubmit(handleCreateProduct)} className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Input 
              label="Product Name"
              dark={true}
              {...productRegister('title', { required: 'Product name is required' })} 
              error={productErrors.title} 
            />
            <Input 
              label="Price"
              dark={true}
              type="number" 
              step="0.01" 
              {...productRegister('price', { required: 'Price is required' })} 
              error={productErrors.price} 
            />
            <Input 
              label="Stock"
              dark={true}
              type="number" 
              {...productRegister('stock', { required: 'Stock is required' })} 
              error={productErrors.stock} 
            />
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Category *
              </label>
              <select 
                {...productRegister('category', { required: 'Category is required' })} 
                className="w-full bg-gray-800 border border-blue-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              >
                <option value="" className="bg-gray-800">Select Category</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id} className="bg-gray-800">
                    {cat.name}
                  </option>
                ))}
              </select>
              {productErrors.category && (
                <p className="text-red-500 text-sm mt-1">{productErrors.category.message}</p>
              )}
            </div>
            <Input 
              label="Product Link"
              dark={true}
              {...productRegister('productLink', { required: 'Product link is required' })} 
              error={productErrors.productLink} 
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
            dark={true}
            type="textarea" 
            {...productRegister('description', { required: 'Description is required' })} 
            error={productErrors.description} 
          />
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Tags</label>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-2">
              <Input 
                dark={true}
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => handleTagKeyPress(e, 'product')}
                placeholder="Add tag and press Enter" 
                className="flex-1"
              />
              <Button type="button" onClick={() => addTag('product')} className="sm:w-auto">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {productTags.map((tag, index) => (
                <span key={index} className="bg-blue-900/30 text-blue-300 px-2 py-1 rounded text-sm flex items-center">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(index, 'product')} 
                    className="ml-1 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
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

      {/* Banner Modal */}
      <Modal 
        isOpen={bannerModalOpen} 
        onClose={closeModals} 
        title={editingItem ? 'Edit Banner' : 'Add Banner'} 
        size="medium"
      >
        <form onSubmit={handleBannerSubmit(handleCreateBanner)} className="p-4 sm:p-6 space-y-4">
          <ImageUpload 
            images={bannerImage} 
            onImagesChange={setBannerImage} 
            multiple={false} 
            label="Banner Image" 
          />
          <Input 
            label="Title"
            dark={true}
            {...bannerRegister('title', { required: 'Banner title is required' })} 
            error={bannerErrors.title} 
          />
          <Input 
            label="Subtitle"
            dark={true}
            {...bannerRegister('subtitle')} 
          />
          <Input 
            label="Button Text"
            dark={true}
            {...bannerRegister('buttonText')} 
          />
          <Input 
            label="Button Link"
            dark={true}
            {...bannerRegister('buttonLink')} 
          />
          <div>
            <label className="block text-sm font-medium text-white mb-2">Position</label>
            <select 
              {...bannerRegister('position')} 
              className="w-full bg-gray-800 border border-blue-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="home-top" className="bg-gray-800">Home Top</option>
              <option value="home-middle" className="bg-gray-800">Home Middle</option>
              <option value="home-bottom" className="bg-gray-800">Home Bottom</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeModals}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || !bannerImage[0]}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Blog Modal */}
      <Modal 
        isOpen={blogModalOpen} 
        onClose={closeModals} 
        title={editingItem ? 'Edit Blog' : 'Add Blog'} 
        size="large"
      >
        <form onSubmit={handleBlogSubmit(handleCreateBlog)} className="p-4 sm:p-6 space-y-4">
          {/* Featured Image */}
          <ImageUpload 
            images={featuredImage} 
            onImagesChange={setFeaturedImage} 
            multiple={false} 
            label="Featured Image" 
            helpText="This will be the main image displayed for the blog post"
          />
          
          <Input 
            label="Title"
            dark={true}
            {...blogRegister('title', { required: 'Blog title is required' })} 
            error={blogErrors.title} 
          />
          <Input 
            label="Excerpt"
            dark={true}
            type="textarea" 
            {...blogRegister('excerpt', { required: 'Blog excerpt is required' })} 
            error={blogErrors.excerpt} 
          />
          
          {/* Status Selection */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Status
            </label>
            <select 
              value={blogStatus}
              onChange={(e) => setBlogStatus(e.target.value)}
              className="w-full bg-gray-800 border border-blue-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="draft" className="bg-gray-800">Draft</option>
              <option value="published" className="bg-gray-800">Published</option>
            </select>
          </div>
          
          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Content *
            </label>
            <RichTextEditor 
              value={blogContent}
              onChange={setBlogContent}
              contentImages={contentImages}
              onContentImagesChange={setContentImages}
              placeholder="Write your blog content here. You can use markdown syntax or the toolbar above to format your text."
            />
            <p className="text-sm text-gray-400 mt-1">
              Use the toolbar to format your text. Upload images directly using the image button.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white mb-2">Category</label>
            <select 
              {...blogRegister('category')} 
              className="w-full bg-gray-800 border border-blue-500/30 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            >
              <option value="" className="bg-gray-800">Select Category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id} className="bg-gray-800">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">Tags</label>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0 mb-2">
              <Input 
                dark={true}
                value={tagInput} 
                onChange={(e) => setTagInput(e.target.value)} 
                onKeyPress={(e) => handleTagKeyPress(e, 'blog')}
                placeholder="Add tag and press Enter"
                className="flex-1"
              />
              <Button type="button" onClick={() => addTag('blog')} className="sm:w-auto">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {blogTags.map((tag, index) => (
                <span key={index} className="bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-sm flex items-center">
                  {tag}
                  <button 
                    type="button" 
                    onClick={() => removeTag(index, 'blog')} 
                    className="ml-1 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button type="button" variant="outline" onClick={closeModals}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={submitting || (!editingItem && !featuredImage[0]) || !blogContent.trim()}
            >
              {submitting ? 'Saving...' : editingItem ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal 
        isOpen={deleteModal.open} 
        onClose={() => setDeleteModal({ open: false, type: '', item: null })} 
        title={`Delete ${deleteModal.type}`} 
        size="small"
      >
        <div className="p-4 sm:p-6">
          <p className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base">
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

export default AdminDashboard;
