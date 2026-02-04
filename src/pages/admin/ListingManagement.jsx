/**
 * Admin ListingManagement Component
 * 
 * File: client/src/pages/admin/ListingManagement.jsx
 * Purpose: Admin panel for creating and managing listings (Products, Tools, Jobs)
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Plus, Save, X, ChevronDown, AlertCircle, CheckCircle, Loader, Upload, ArrowUp, ArrowDown } from 'lucide-react';
import { categoriesAPI } from '../../services/api';
import api from '../../services/api';

const ListingManagement = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  // Form state
  const [formData, setFormData] = useState({
    type: 'product',
    title: '',
    slug: '',
    description: '',
    category: '',
    images: [],
    price: '',
    originalPrice: '',
    stock: '',
    cartEnabled: true,
    externalLink: '',
    affiliateSource: '',
    affiliateId: '',
    platform: [],
    features: [],
    integrations: [],
    companyName: '',
    jobType: '',
    location: '',
    salary: '',
    experienceLevel: 'any',
    applicationDeadline: '',
    tags: [],
    status: 'draft',
    isFeatured: false,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    pricingType: 'paid'
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [categories, setCategories] = useState([]);
  const [currentFeature, setCurrentFeature] = useState('');
  const [currentIntegration, setCurrentIntegration] = useState('');
  const [imageUploadLoading, setImageUploadLoading] = useState(false);

  // Load categories based on listing type
  useEffect(() => {
    const loadCategories = async () => {
      try {
        // Map listing type to category type
        const categoryTypeMap = {
          product: 'product',
          tool: 'software',
          job: 'job'
        };
        const categoryType = categoryTypeMap[formData.type] || 'product';
        
        console.log('🔄 Loading categories for type:', categoryType);
        
        const response = await categoriesAPI.getAll({ type: categoryType });
        console.log('📦 Full response:', response);
        
        // Handle different response formats
        let cats = [];
        if (response.data) {
          cats = Array.isArray(response.data) ? response.data : response.data.data || [];
        } else if (Array.isArray(response)) {
          cats = response;
        }
        
        console.log('✅ Categories loaded:', cats.length, cats);
        setCategories(cats);
      } catch (err) {
        console.error('❌ Failed to load categories:', err);
        setCategories([]);
      }
    };
    loadCategories();
  }, [formData.type]);

  // Load existing listing if editing
  useEffect(() => {
    if (isEditing) {
      const loadListing = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/admin/listings/${id}`);
          const data = response.data;
          if (data.success && data.data) {
            setFormData(data.data);
          } else if (data.data) {
            setFormData(data.data);
          } else {
            setError('Failed to load listing');
          }
        } catch (err) {
          setError('Failed to load listing: ' + err.message);
          console.error(err);
        } finally {
          setLoading(false);
        }
      };
      loadListing();
    }
  }, [id, isEditing]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Reset category when type changes
    if (name === 'type') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        category: '' // Reset category when type changes
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  // Handle platform selection
  const handlePlatformChange = (platform) => {
    setFormData(prev => ({
      ...prev,
      platform: prev.platform.includes(platform)
        ? prev.platform.filter(p => p !== platform)
        : [...prev.platform, platform]
    }));
  };

  // Add feature
  const addFeature = () => {
    if (currentFeature.trim()) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, currentFeature]
      }));
      setCurrentFeature('');
    }
  };

  // Remove feature
  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // Add integration
  const addIntegration = () => {
    if (currentIntegration.trim()) {
      setFormData(prev => ({
        ...prev,
        integrations: [...prev.integrations, currentIntegration]
      }));
      setCurrentIntegration('');
    }
  };

  // Remove integration
  const removeIntegration = (index) => {
    setFormData(prev => ({
      ...prev,
      integrations: prev.integrations.filter((_, i) => i !== index)
    }));
  };

  // Handle tags
  const handleTagsChange = (e) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  // Handle image file uploads
  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setImageUploadLoading(true);
    setError('');
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);

        const response = await api.post('/uploads/image', formDataUpload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        const data = response.data;
        if (data.success && data.data && data.data.url) {
          uploadedUrls.push(data.data.url);
        } else if (data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.error('Invalid upload response:', data);
          setError('Invalid response from upload endpoint');
        }
      } catch (err) {
        console.error('Image upload failed:', err);
        if (err.response?.status === 404) {
          setError('Upload endpoint not found. Check backend server.');
        } else if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Upload requires admin authentication. Please ensure you are logged in as admin.');
        } else {
          setError(`Image upload error: ${err.message}`);
        }
      }
    }

    if (uploadedUrls.length > 0) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...uploadedUrls]
      }));
      setSuccess(`${uploadedUrls.length} image(s) uploaded successfully`);
      setTimeout(() => setSuccess(''), 3000);
    }
    setImageUploadLoading(false);
  };

  // Remove image from listing
  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  // Reorder images (move up)
  const moveImageUp = (index) => {
    if (index > 0) {
      const newImages = [...formData.images];
      [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  // Reorder images (move down)
  const moveImageDown = (index) => {
    if (index < formData.images.length - 1) {
      const newImages = [...formData.images];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      setFormData(prev => ({ ...prev, images: newImages }));
    }
  };

  // Validate form
  const validateForm = () => {
    if (!formData.title.trim()) return 'Title is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.category) return 'Category is required';

    if (formData.type === 'product') {
      if (formData.cartEnabled && !formData.price) return 'Price is required for products with cart';
      if (!formData.stock) return 'Stock is required for products';
    }

    if (formData.type === 'tool') {
      if (!formData.externalLink) return 'External link is required for tools';
      if (formData.platform.length === 0) return 'At least one platform must be selected';
    }

    if (formData.type === 'job') {
      if (!formData.externalLink) return 'Application URL is required for jobs';
      if (!formData.companyName) return 'Company name is required for jobs';
      if (!formData.jobType) return 'Job type is required for jobs';
    }

    return '';
  };

  // Save listing
  const handleSave = async (e) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const method = isEditing ? 'put' : 'post';
      const endpoint = `/admin/listings${isEditing ? `/${id}` : ''}`;
      
      // Prepare payload: clone and coerce/clean fields to avoid backend validation errors
      const payload = { ...formData };

      // Remove empty jobType so backend receives null/undefined instead of empty string
      if (payload.jobType === '') delete payload.jobType;

      // Coerce numeric fields if present, otherwise remove to avoid invalid empty strings
      if (payload.price !== undefined && payload.price !== '') {
        payload.price = Number(payload.price);
      } else {
        delete payload.price;
      }

      if (payload.stock !== undefined && payload.stock !== '') {
        payload.stock = parseInt(payload.stock, 10);
      } else {
        delete payload.stock;
      }

      const response = await api[method](endpoint, payload);
      const data = response.data;

      if (data.success) {
        setSuccess(isEditing ? 'Listing updated successfully!' : 'Listing created successfully!');
        setTimeout(() => {
          navigate('/admin/listings');
        }, 1500);
      } else {
        setError(data.error || 'Failed to save listing');
      }
    } catch (err) {
      // Log full server response for easier debugging
      console.error('Save listing error response:', err.response?.data || err);

      const serverError = err.response?.data?.error || err.response?.data?.message || JSON.stringify(err.response?.data) || err.message;
      setError('Failed to save listing: ' + serverError);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const isProduct = formData.type === 'product';
  const isTool = formData.type === 'tool';
  const isJob = formData.type === 'job';

  return (
    <div className="min-h-screen bg-gray-50 py-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Listing' : 'Create New Listing'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditing ? 'Update your listing details' : 'Add a new product, tool, or job listing'}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          {/* ============================================
              LISTING TYPE SELECTOR
              ============================================ */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900">Listing Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { value: 'product', label: 'Product', desc: 'With cart & checkout' },
                { value: 'tool', label: 'Software Tool', desc: 'Affiliate link' },
                { value: 'job', label: 'Job Opening', desc: 'Apply directly' }
              ].map(option => (
                <label key={option.value} className="flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all"
                  style={{
                    borderColor: formData.type === option.value ? '#3b82f6' : '#e5e7eb',
                    backgroundColor: formData.type === option.value ? '#eff6ff' : 'white'
                  }}>
                  <input
                    type="radio"
                    name="type"
                    value={option.value}
                    checked={formData.type === option.value}
                    onChange={handleChange}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="font-semibold text-gray-900">{option.label}</div>
                    <div className="text-sm text-gray-600">{option.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* ============================================
              IMAGE UPLOAD
              ============================================ */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Images</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Upload Images</label>
              <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="text-center">
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Click to upload or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={imageUploadLoading}
                  className="hidden"
                />
              </label>
              {imageUploadLoading && (
                <p className="text-sm text-blue-600 mt-2">Uploading images...</p>
              )}
            </div>

            {formData.images.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Uploaded Images ({formData.images.length})</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 rounded-lg transition-all flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => moveImageUp(index)}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                            title="Move up"
                          >
                            <ArrowUp className="w-4 h-4 text-gray-700" />
                          </button>
                        )}
                        {index < formData.images.length - 1 && (
                          <button
                            type="button"
                            onClick={() => moveImageDown(index)}
                            className="p-1 bg-white rounded-full hover:bg-gray-100"
                            title="Move down"
                          >
                            <ArrowDown className="w-4 h-4 text-gray-700" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          title="Delete"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      {index === 0 && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">Primary</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ============================================
              COMMON FIELDS
              ============================================ */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 'Figma Pro', 'Senior React Developer', 'Wireless Headphones'"
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.title.length}/100</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Detailed description of the listing..."
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">{formData.description.length}/2000</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">
                    {formData.type === 'product' && 'Select Product Category'}
                    {formData.type === 'tool' && 'Select Software Category'}
                    {formData.type === 'job' && 'Select Job Category'}
                  </option>
                  {categories.length > 0 ? (
                    categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>No categories available for this type</option>
                  )}
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Choose a category to organize your {formData.type}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                <input
                  type="text"
                  value={formData.tags.join(', ')}
                  onChange={handleTagsChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Separate with commas"
                />
              </div>
            </div>
          </div>

          {/* ============================================
              PRODUCT-SPECIFIC FIELDS
              ============================================ */}
          {isProduct && (
            <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Product Information</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Original Price</label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Stock *</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
                  <select
                    name="pricingType"
                    value={formData.pricingType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="free">Free</option>
                    <option value="paid">Paid</option>
                    <option value="freemium">Freemium</option>
                  </select>
                </div>
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="cartEnabled"
                  checked={formData.cartEnabled}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">Cart Enabled</span>
              </label>
            </div>
          )}

          {/* ============================================
              TOOL-SPECIFIC FIELDS
              ============================================ */}
          {isTool && (
            <div className="bg-white p-6 rounded-lg border border-green-200 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">🔧 Software Tool Fields</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">External Link (Affiliate URL) *</label>
                <input
                  type="url"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="https://example.com/?ref=..."
                />
                <p className="text-xs text-gray-600 mt-1">💡 Paste your affiliate/referral link here</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pricing Type</label>
                <select
                  name="pricingType"
                  value={formData.pricingType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                  <option value="freemium">Freemium</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
                <div className="space-y-2">
                  {['web', 'windows', 'macos', 'ios', 'android', 'linux'].map(platform => (
                    <label key={platform} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.platform.includes(platform)}
                        onChange={() => handlePlatformChange(platform)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">{platform}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Key Features</label>
                <div className="space-y-2">
                  {formData.features.map((feature, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={feature}
                        disabled
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(i)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentFeature}
                      onChange={(e) => setCurrentFeature(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 'AI-powered recommendations'"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Integrations</label>
                <div className="space-y-2">
                  {formData.integrations.map((integration, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        type="text"
                        value={integration}
                        disabled
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={() => removeIntegration(i)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={currentIntegration}
                      onChange={(e) => setCurrentIntegration(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., 'Slack', 'Zapier'"
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addIntegration())}
                    />
                    <button
                      type="button"
                      onClick={addIntegration}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate Source</label>
                  <select
                    name="affiliateSource"
                    value={formData.affiliateSource}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select Source</option>
                    <option value="producthunt">Product Hunt</option>
                    <option value="appsumo">AppSumo</option>
                    <option value="capterra">Capterra</option>
                    <option value="company_website">Company Website</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Affiliate ID</label>
                  <input
                    type="text"
                    name="affiliateId"
                    value={formData.affiliateId}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Optional tracking ID"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ============================================
              JOB-SPECIFIC FIELDS
              ============================================ */}
          {isJob && (
            <div className="bg-white p-6 rounded-lg border border-purple-200 space-y-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">💼 Job Listing Fields</h2>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">External Link (Application URL) *</label>
                <input
                  type="url"
                  name="externalLink"
                  value={formData.externalLink}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://company.careers/..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="e.g., 'Google', 'Startup Inc.'"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Job Type *</label>
                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Experience Level</label>
                  <select
                    name="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="any">Any Level</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid-level</option>
                    <option value="senior">Senior</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., 'San Francisco, CA' or 'Remote'"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Salary Range</label>
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="e.g., '$80k - $120k'"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Application Deadline</label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* ============================================
              PUBLISHING OPTIONS
              ============================================ */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Publishing</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>

              <label className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">⭐ Featured</span>
              </label>

              <label className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="w-5 h-5"
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">SEO Settings</h3>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                  <input
                    type="text"
                    name="metaTitle"
                    value={formData.metaTitle}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Page title for search engines"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.metaTitle.length}/60</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                  <textarea
                    name="metaDescription"
                    value={formData.metaDescription}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows="2"
                    placeholder="Description for search engines"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.metaDescription.length}/160</p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================
              SUBMIT BUTTONS
              ============================================ */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  {isEditing ? 'Update Listing' : 'Create Listing'}
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/listings')}
              className="flex-1 px-6 py-3 bg-gray-300 text-gray-900 rounded-lg hover:bg-gray-400 transition flex items-center justify-center gap-2"
            >
              <X className="w-5 h-5" />
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ListingManagement;
