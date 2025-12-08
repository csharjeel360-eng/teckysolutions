import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Save, Eye, Upload, Tag, Plus, X, ArrowLeft, 
  Image as ImageIcon, FileText, Settings 
} from 'lucide-react';
import RichTextEditor from '../../components/Admins/RichTextEditor';
import ImageUpload from '../../components/Admins/ImageUpload';
import Button from '../../components/UI/Button';
import Notification from '../../components/Common/Notification';
import { blogsAPI, uploadsAPI } from '../../services/api';

const BlogEditor = ({ blog = null, onSave, categories = [] }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(!!id);
  const [previewMode, setPreviewMode] = useState(false);
  const [content, setContent] = useState(blog?.content || '');
  const [featuredImage, setFeaturedImage] = useState(blog?.featuredImage ? [{ 
    url: blog.featuredImage.url, 
    public_id: blog.featuredImage.public_id,
    file: null 
  }] : []);
  const [contentImages, setContentImages] = useState([]);
  const [tags, setTags] = useState(blog?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [submitting, setSubmitting] = useState(false);
  const [deletedContentImages, setDeletedContentImages] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      title: blog?.title || '',
      excerpt: blog?.excerpt || '',
      category: blog?.category?._id || blog?.category || '',
      metaTitle: blog?.metaTitle || '',
      metaDescription: blog?.metaDescription || '',
      status: blog?.status || 'draft',
      featured: blog?.featured || false
    }
  });

  // Load blog data when editing
  useEffect(() => {
    if (id && !blog) {
      loadBlog();
    } else if (blog) {
      initializeForm(blog);
    }
  }, [id, blog]);

  const loadBlog = async () => {
    try {
      setLoading(true);
      const response = await blogsAPI.getById(id);
      const blogData = response.data;
      initializeForm(blogData);
    } catch (error) {
      console.error('Error loading blog:', error);
      setNotification({
        show: true,
        message: 'Failed to load blog post',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const initializeForm = (blogData) => {
    reset({
      title: blogData.title || '',
      excerpt: blogData.excerpt || '',
      category: blogData.category?._id || blogData.category || '',
      metaTitle: blogData.metaTitle || '',
      metaDescription: blogData.metaDescription || '',
      status: blogData.status || 'draft',
      featured: blogData.featured || false
    });
    
    setContent(blogData.content || '');
    setTags(blogData.tags || []);
    
    // Set featured image
    if (blogData.featuredImage) {
      setFeaturedImage([{ 
        url: blogData.featuredImage.url, 
        public_id: blogData.featuredImage.public_id,
        file: null 
      }]);
    }
    
    // Set content images
    if (blogData.contentImages && blogData.contentImages.length > 0) {
      const formattedContentImages = blogData.contentImages.map((img, index) => ({
        url: img.url,
        public_id: img.public_id,
        alt: img.alt || `Blog content image ${index + 1}`,
        id: img.public_id, // Use public_id as ID for existing images
        file: null,
        position: index,
        placeholder: `![${img.alt || 'Blog image'}](image:${img.public_id})`
      }));
      setContentImages(formattedContentImages);
    }

    // Debug logs removed from form initialization
  };

  // Handle image upload for content images
  const handleImageUpload = async (file, imageId, altText) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await uploadsAPI.uploadImage(formData);
      const uploadedImage = response.data;
      
      return {
        url: uploadedImage.url,
        public_id: uploadedImage.public_id,
        alt: altText,
        id: imageId,
        placeholder: `![${altText}](image:${uploadedImage.public_id})`
      };
    } catch (error) {
      console.error('Image upload error:', error);
      throw new Error(error.response?.data?.message || 'Failed to upload image');
    }
  };

  // Handle content images change from RichTextEditor
  const handleContentImagesChange = (newImages) => {
    // Content images updated
    
    // Track deleted images when editing existing blog
    if (blog && blog.contentImages) {
      const originalIds = blog.contentImages.map(img => img.public_id);
      const currentIds = newImages.map(img => img.public_id).filter(id => id);
      const newlyDeleted = originalIds.filter(id => !currentIds.includes(id));
      
      if (newlyDeleted.length > 0) {
        setDeletedContentImages(prev => [...new Set([...prev, ...newlyDeleted])]);
      }
    }
    
    setContentImages(newImages);
  };

  // Tag management
  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    } else if (tags.length >= 10) {
      setNotification({
        show: true,
        message: 'Maximum 10 tags allowed',
        type: 'warning'
      });
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  // ✅ FIXED: Generate preview content with proper image placement
  const generatePreviewContent = () => {
    let previewContent = content;
    
    // Replace image placeholders with actual image HTML in preview
    contentImages.forEach((image) => {
      if (image && image.placeholder && image.url) {
        const imageHtml = `
          <div class="blog-image-preview my-6 text-center border border-gray-200 rounded-lg p-4 bg-white">
            <img 
              src="${image.url}" 
              alt="${image.alt || 'Blog image'}" 
              class="max-w-full h-auto rounded-lg shadow-md mx-auto"
              style="max-height: 300px; object-fit: contain;"
            />
            ${image.alt && image.alt !== 'Blog image' ? 
              `<p class="text-sm text-gray-600 mt-2 italic">${image.alt}</p>` : ''}
            <div class="mt-2 text-xs text-gray-500">
              ${image.uploading ? '⏳ Uploading...' : 
                image.uploadError ? `❌ Upload failed` : 
                image.temp ? '📱 Local preview' : '✅ Ready'}
            </div>
          </div>
        `;
        
        const escapedPlaceholder = image.placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(escapedPlaceholder, 'g');
        previewContent = previewContent.replace(regex, imageHtml);
      }
    });

    return convertMarkdownToHTML(previewContent);
  };

  // ✅ FIXED: Markdown to HTML converter for preview
  const convertMarkdownToHTML = (markdown) => {
    if (!markdown) return '<p class="text-gray-400 italic">Start writing your content...</p>';
    
    let html = markdown;

    // Color tags - must come FIRST before other formatting
    html = html.replace(/\{color:(#[0-9A-Fa-f]{6}|[a-zA-Z]+)\}(.*?)\{\/color\}/g, '<span style="color: $1;">$2</span>');

    // Headers
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-gray-900">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-6 mb-3 text-gray-900">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-5 mb-2 text-gray-900">$1</h3>');
    
    // Bold and Italic
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>');
    
    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline transition-colors" target="_blank" rel="noopener noreferrer">$1</a>');
    
    // Inline code
    html = html.replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded text-sm font-mono border border-gray-300 text-gray-800">$1</code>');
    
    // Blockquotes
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 pl-4 py-2 my-4 text-gray-600 italic bg-blue-50 rounded-r-lg">$1</blockquote>');
    
    // Lists
    const lines = html.split('\n');
    const processedLines = [];
    let inList = false;
    let emptyLineCount = 0;

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      
      if (trimmedLine.startsWith('- ')) {
        if (!inList) {
          processedLines.push('<ul class="list-disc ml-6 my-4 space-y-2">');
          inList = true;
        }
        const itemContent = trimmedLine.substring(2);
        processedLines.push(`<li class="text-gray-700">${itemContent}</li>`);
        emptyLineCount = 0;
      } else {
        if (inList) {
          processedLines.push('</ul>');
          inList = false;
        }
        
        if (trimmedLine) {
          // Don't process if it's already HTML
          if (trimmedLine.startsWith('<') || trimmedLine.includes('blog-image-preview')) {
            processedLines.push(trimmedLine);
          } else {
            processedLines.push(`<p class="my-4 leading-relaxed text-gray-700">${trimmedLine}</p>`);
          }
          emptyLineCount = 0;
        } else {
          // Add empty line spacing (but limit consecutive empty lines to 1)
          if (emptyLineCount === 0) {
            processedLines.push('<br class="my-2" />');
          }
          emptyLineCount++;
        }
      }
    });

    if (inList) {
      processedLines.push('</ul>');
    }

    return processedLines.join('\n');
  };

  // Form submission
  const onSubmit = async (data) => {
    if (!featuredImage[0]) {
      setNotification({
        show: true,
        message: 'Please upload a featured image',
        type: 'error'
      });
      return;
    }

    if (!content.trim()) {
      setNotification({
        show: true,
        message: 'Please add some content to your blog',
        type: 'error'
      });
      return;
    }

    setSubmitting(true);

    try {
      // Debug logs removed from submit

      // Prepare form data
      const formData = new FormData();
      
      // Append basic fields
      formData.append('title', data.title);
      formData.append('excerpt', data.excerpt);
      formData.append('content', content);
      formData.append('status', data.status);
      formData.append('featured', data.featured);
      
      if (data.category) {
        formData.append('category', data.category);
      }
      if (data.metaTitle) {
        formData.append('metaTitle', data.metaTitle);
      }
      if (data.metaDescription) {
        formData.append('metaDescription', data.metaDescription);
      }
      
      // Append tags as JSON array
      if (tags.length > 0) {
        formData.append('tags', JSON.stringify(tags));
      }

      // Handle featured image
      if (featuredImage[0]?.file) {
        formData.append('featuredImage', featuredImage[0].file);
      }

      // ✅ FIXED: Handle content images properly
      const newContentImages = contentImages.filter(img => img.file);
      const existingContentImages = contentImages.filter(img => img.public_id && !img.file);

      // Content images breakdown logged in dev only

      // Append new content image files
      const contentImagePlaceholders = [];
      const contentImagesAlts = [];
      
      newContentImages.forEach((image) => {
        if (image.file) {
          formData.append('contentImages', image.file);
          contentImagePlaceholders.push(image.id);
          contentImagesAlts.push(image.alt || 'Blog image');
        }
      });

      if (contentImagePlaceholders.length > 0) {
        formData.append('contentImagePlaceholders', JSON.stringify(contentImagePlaceholders));
        formData.append('contentImagesAlts', JSON.stringify(contentImagesAlts));
      }

      // Append existing content image URLs to preserve them
      if (existingContentImages.length > 0) {
        formData.append('contentImageUrls', JSON.stringify(
          existingContentImages.map(img => ({
            url: img.url,
            public_id: img.public_id,
            alt: img.alt
          }))
        ));
      }

      // Track deleted content images
      if (deletedContentImages.length > 0) {
        formData.append('deletedContentImages', JSON.stringify(deletedContentImages));
      }

      let result;
      const blogId = blog?._id || id;
      
      if (blogId) {
        result = await blogsAPI.update(blogId, formData);
      } else {
        result = await blogsAPI.create(formData);
      }

      if (result.data) {
        setNotification({
          show: true,
          message: `Blog ${data.status === 'published' ? 'published' : 'saved as draft'} successfully!`,
          type: 'success'
        });

        if (onSave) {
          onSave(result.data);
        }

        // Redirect after success
        setTimeout(() => {
          navigate('/admin/blogs');
        }, 1500);
      }

    } catch (error) {
      console.error('❌ Error saving blog:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to save blog';
      
      setNotification({
        show: true,
        message: errorMessage,
        type: 'error'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = () => {
    setValue('status', 'draft');
    handleSubmit(onSubmit)();
  };

  const handlePublish = () => {
    setValue('status', 'published');
    handleSubmit(onSubmit)();
  };

  const handlePreviewToggle = () => {
    setPreviewMode(!previewMode);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading blog editor...</p>
        </div>
      </div>
    );
  }

  const formData = watch();
  const isPublished = formData.status === 'published';

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Notification */}
        {notification.show && (
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => setNotification({ ...notification, show: false })}
            duration={5000}
          />
        )}

        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <button
              onClick={() => navigate('/admin/blogs')}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {(blog || id) ? 'Edit Blog Post' : 'Create New Blog Post'}
              </h1>
              <p className="text-gray-600 mt-1">
                {(blog || id) 
                  ? `Editing: "${formData.title || 'Untitled'}"`
                  : 'Write and publish a new blog post'
                }
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 w-full lg:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviewToggle}
              className="flex items-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Edit' : 'Preview'}</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={submitting}
              className="flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Draft</span>
            </Button>
            
            <Button
              type="button"
              onClick={handlePublish}
              loading={submitting}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700"
            >
              <Upload className="w-4 h-4" />
              <span>{(blog || id) ? 'Update & Publish' : 'Publish Blog'}</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - 3/4 width */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-3">
                Blog Title *
              </label>
              <input
                {...register('title', { 
                  required: 'Title is required',
                  minLength: { value: 5, message: 'Title must be at least 5 characters' },
                  maxLength: { value: 120, message: 'Title must be less than 120 characters' }
                })}
                type="text"
                className="w-full px-4 py-3 text-xl font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter a compelling title that captures attention..."
              />
              {errors.title && (
                <p className="text-red-600 text-sm mt-2">{errors.title.message}</p>
              )}
            </div>

            {/* Excerpt */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-3">
                Excerpt *
              </label>
              <textarea
                {...register('excerpt', { 
                  required: 'Excerpt is required',
                  minLength: { value: 50, message: 'Excerpt must be at least 50 characters' },
                  maxLength: { value: 200, message: 'Excerpt must be less than 200 characters' }
                })}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Write a brief summary that makes readers want to read more..."
              />
              {errors.excerpt && (
                <p className="text-red-600 text-sm mt-2">{errors.excerpt.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                {formData.excerpt?.length || 0}/200 characters
              </p>
            </div>

            {/* Featured Image */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Featured Image *
                <span className="text-red-500 ml-1">*</span>
              </label>
              <ImageUpload
                images={featuredImage}
                onImagesChange={setFeaturedImage}
                multiple={false}
                maxFiles={1}
                maxSizeMB={10}
                label="Upload Featured Image"
                helpText="This will be the main image displayed for your blog post. Recommended size: 1200x630px"
              />
              {!featuredImage[0] && (
                <p className="text-red-600 text-sm mt-2">Featured image is required</p>
              )}
            </div>

            {/* Content Editor */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Blog Content *
                <span className="text-red-500 ml-1">*</span>
              </label>
              
              {previewMode ? (
                <div className="border border-gray-300 rounded-lg p-6 bg-white min-h-[500px]">
                  <div 
                    className="prose prose-lg max-w-none whitespace-pre-wrap break-words"
                    dangerouslySetInnerHTML={{ __html: generatePreviewContent() }}
                  />
                  {!content.trim() && (
                    <p className="text-gray-400 italic">Preview will appear here as you type...</p>
                  )}
                </div>
              ) : (
                <RichTextEditor
                  value={content}
                  onChange={setContent}
                  placeholder="Start writing your amazing blog content... Use the toolbar above to format your text and add images."
                  contentImages={contentImages}
                  onContentImagesChange={handleContentImagesChange}
                  onImageUpload={handleImageUpload}
                />
              )}
              
              {!content.trim() && (
                <p className="text-red-600 text-sm mt-2">Blog content is required</p>
              )}
            </div>
          </div>

          {/* Sidebar - 1/4 width */}
          <div className="space-y-6">
            {/* Publish Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Settings className="w-5 h-5" />
                <span>Publish</span>
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 rounded text-sm font-medium ${
                    isPublished 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div className="flex items-center p-3 border rounded-lg bg-gray-50">
                  <input
                    {...register('featured')}
                    type="checkbox"
                    id="featured"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="ml-3 text-sm text-gray-700">
                    Feature this blog on homepage
                  </label>
                </div>

                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Button
                    type="button"
                    onClick={handleSaveDraft}
                    variant="outline"
                    loading={submitting}
                    className="w-full justify-center"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                  <Button
                    type="button"
                    onClick={handlePublish}
                    loading={submitting}
                    className="w-full justify-center bg-green-600 hover:bg-green-700"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    {(blog || id) ? 'Update & Publish' : 'Publish Blog'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Category */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category</h3>
              <select
                {...register('category')}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Tags</span>
              </h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={handleTagInputKeyPress}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Add a tag..."
                    maxLength={20}
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    size="small"
                    disabled={!tagInput.trim() || tags.length >= 10}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-200 p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                <p className="text-xs text-gray-500">
                  Press Enter or click + to add tags. Max 10 tags. {tags.length}/10 used.
                </p>
              </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO Settings</h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="metaTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Title
                  </label>
                  <input
                    {...register('metaTitle')}
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="SEO title for search engines"
                    maxLength={60}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaTitle?.length || 0}/60 characters
                  </p>
                </div>

                <div>
                  <label htmlFor="metaDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Meta Description
                  </label>
                  <textarea
                    {...register('metaDescription')}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                    placeholder="SEO description for search engines"
                    maxLength={160}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.metaDescription?.length || 0}/160 characters
                  </p>
                </div>
              </div>
            </div>

            {/* Content Images Summary */}
            {contentImages.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                  <ImageIcon className="w-5 h-5" />
                  <span>Content Images</span>
                </h3>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Total images: <strong>{contentImages.length}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    New uploads: <strong>{contentImages.filter(img => img.file).length}</strong>
                  </p>
                  <p className="text-sm text-gray-600">
                    Existing images: <strong>{contentImages.filter(img => !img.file).length}</strong>
                  </p>
                  {deletedContentImages.length > 0 && (
                    <p className="text-sm text-red-600">
                      Images to be deleted: <strong>{deletedContentImages.length}</strong>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogEditor;