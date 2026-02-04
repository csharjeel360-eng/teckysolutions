import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, Search, Upload, X } from 'lucide-react';
import { offersAPI, categoriesAPI, uploadsAPI } from '../../services/api';
import useNotification from '../../hooks/useNotification';
import Modal from '../../components/UI/Modal';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const OffersManagement = () => {
  const { addNotification } = useNotification();
  
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [offerModalOpen, setOfferModalOpen] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false, item: null });
  const [viewModal, setViewModal] = useState({ open: false, item: null });
  const [editingOffer, setEditingOffer] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    trackingUrl: '',
    thumbnail: ''
  });

  // Load offers and categories
  useEffect(() => {
    loadOffers();
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ type: 'offer', limit: 100 });
      setCategories(response.data.data || response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await offersAPI.adminGetAll({
        search: searchTerm,
        limit: 20
      });
      setOffers(response.data.data);
    } catch (error) {
      addNotification('Failed to load offers', 'error');
      console.error('Error loading offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setTimeout(() => loadOffers(), 500);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await uploadsAPI.uploadImage(formDataUpload);
      const imageUrl = response.data.data.url || response.data.data.secure_url;
      
      setFormData(prev => ({
        ...prev,
        thumbnail: imageUrl
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      addNotification('Image uploaded successfully', 'success');
    } catch (error) {
      addNotification('Failed to upload image', 'error');
      console.error('Upload error:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.trackingUrl || !formData.category) {
      addNotification('Please fill in all required fields', 'error');
      return;
    }

    try {
      setSubmitting(true);

      if (editingOffer) {
        await offersAPI.update(editingOffer._id, formData);
        addNotification('Offer updated successfully', 'success');
      } else {
        await offersAPI.create(formData);
        addNotification('Offer created successfully', 'success');
      }

      setOfferModalOpen(false);
      setEditingOffer(null);
      resetForm();
      loadOffers();
    } catch (error) {
      addNotification(error.response?.data?.error || 'Failed to save offer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title,
      description: offer.description,
      category: offer.category?._id || offer.category || '',
      trackingUrl: offer.trackingUrl,
      thumbnail: offer.thumbnail || ''
    });
    if (offer.thumbnail) {
      setImagePreview(offer.thumbnail);
    }
    setOfferModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await offersAPI.delete(deleteModal.item._id);
      addNotification('Offer deleted successfully', 'success');
      setDeleteModal({ open: false, item: null });
      loadOffers();
    } catch (error) {
      addNotification('Failed to delete offer', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      trackingUrl: '',
      thumbnail: ''
    });
    setImagePreview(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Offers</h1>
        <Button 
          onClick={() => {
            setEditingOffer(null);
            resetForm();
            setOfferModalOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus size={20} /> New Offer
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center gap-2">
          <Search size={20} className="text-gray-400" />
          <Input
            type="text"
            placeholder="Search offers by title..."
            value={searchTerm}
            onChange={handleSearch}
            className="flex-1"
          />
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <LoadingSpinner />
        ) : offers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No offers found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {offer.thumbnail && (
                          <img
                            src={offer.thumbnail}
                            alt={offer.title}
                            className="w-10 h-10 rounded object-cover"
                          />
                        )}
                        <p className="font-medium text-gray-900 truncate max-w-xs">{offer.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-600">{offer.category?.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={offer.trackingUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 truncate max-w-xs inline-block"
                        title={offer.trackingUrl}
                      >
                        {offer.trackingUrl.length > 40 ? offer.trackingUrl.substring(0, 40) + '...' : offer.trackingUrl}
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setViewModal({ open: true, item: offer })}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="View"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => handleEdit(offer)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, item: offer })}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={offerModalOpen}
        onClose={() => {
          setOfferModalOpen(false);
          setEditingOffer(null);
          resetForm();
        }}
        title={editingOffer ? 'Edit Offer' : 'Create New Offer'}
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <Input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Offer title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Offer description"
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tracking URL *</label>
            <Input
              type="url"
              name="trackingUrl"
              value={formData.trackingUrl}
              onChange={handleInputChange}
              placeholder="https://..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail Image</label>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="flex-1">
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2 justify-center">
                    <Upload size={18} />
                    <span className="text-sm">{uploadingImage ? 'Uploading...' : 'Choose Image'}</span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
              </div>
              {imagePreview && (
                <div className="relative w-32 h-32 border border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, thumbnail: '' }));
                      setImagePreview(null);
                    }}
                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1"
            >
              {submitting ? 'Saving...' : editingOffer ? 'Update Offer' : 'Create Offer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOfferModalOpen(false);
                setEditingOffer(null);
                resetForm();
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, item: null })}
        title="Offer Details"
      >
        {viewModal.item && (
          <div className="space-y-4">
            {viewModal.item.thumbnail && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Thumbnail</p>
                <img
                  src={viewModal.item.thumbnail}
                  alt={viewModal.item.title}
                  className="max-w-xs max-h-64 rounded-lg border border-gray-200"
                />
              </div>
            )}
            <div>
              <p className="text-sm text-gray-600">Title</p>
              <p className="font-semibold text-lg">{viewModal.item.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-semibold">{viewModal.item.category?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Description</p>
              <p className="text-gray-900 whitespace-pre-wrap">{viewModal.item.description}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Tracking URL</p>
              <a 
                href={viewModal.item.trackingUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 break-all text-sm underline"
              >
                {viewModal.item.trackingUrl}
              </a>
            </div>
            {viewModal.item.thumbnail && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Thumbnail</p>
                <img 
                  src={viewModal.item.thumbnail} 
                  alt={viewModal.item.title}
                  className="max-w-xs max-h-64 rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, item: null })}
        title="Delete Offer"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Are you sure you want to delete <strong>{deleteModal.item?.title}</strong>?
          </p>
          <div className="flex gap-3">
            <Button
              onClick={handleDelete}
              disabled={submitting}
              variant="danger"
              className="flex-1"
            >
              {submitting ? 'Deleting...' : 'Delete'}
            </Button>
            <Button
              onClick={() => setDeleteModal({ open: false, item: null })}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OffersManagement;

