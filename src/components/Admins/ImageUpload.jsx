// components/Common/ImageUpload.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { uploadService } from '../../services/uploadService';

const ImageUpload = ({ 
  images = [], 
  onImagesChange, 
  multiple = false, 
  maxFiles = 5,
  maxSizeMB = 10,
  accept = "image/*",
  label = "Upload Images",
  helpText = "",
  disabled = false
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.url && image.url.startsWith('blob:')) {
          URL.revokeObjectURL(image.url);
        }
      });
    };
  }, [images]);

  const validateFiles = (files) => {
    const errors = [];

    // Check file count
    if (multiple && images.length + files.length > maxFiles) {
      errors.push(`You can only upload up to ${maxFiles} images. Current: ${images.length}, Trying to add: ${files.length}`);
      return errors;
    }

    if (!multiple && files.length > 1) {
      errors.push('Please select only one image');
      return errors;
    }

    // Check each file
    files.forEach(file => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        errors.push(`Invalid file type: ${file.name}. Please upload JPEG, PNG, GIF, or WebP images.`);
      }

      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      if (file.size > maxSizeBytes) {
        errors.push(`File too large: ${file.name}. Maximum size is ${maxSizeMB}MB.`);
      }
    });

    return errors;
  };

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    
    if (files.length === 0) return;

    const validationErrors = validateFiles(files);
    if (validationErrors.length > 0) {
      alert(validationErrors.join('\n'));
      return;
    }

    try {
      setUploading(true);
      const newImages = [];

      // Create local previews first
      for (const file of files) {
        const localImage = {
          url: URL.createObjectURL(file),
          file: file,
          originalName: file.name,
          size: file.size,
          isLocal: true,
          uploading: true,
          uploadedAt: new Date().toISOString()
        };
        newImages.push(localImage);
      }

      // Update state with local versions
      if (multiple) {
        onImagesChange([...images, ...newImages]);
      } else {
        onImagesChange([newImages[0]]);
      }

      // Upload to server
      try {
        let serverResponse;
        if (multiple && files.length > 1) {
          serverResponse = await uploadService.uploadMultipleImages(files);
        } else {
          serverResponse = await uploadService.uploadImage(files[0]);
        }

        // Update images with server data
        const updatedImages = [...images];
        const serverData = multiple && files.length > 1 ? serverResponse.data : [serverResponse.data];

        newImages.forEach((localImage, index) => {
          const serverImage = serverData[index];
          if (serverImage) {
            const updatedImage = {
              ...localImage,
              url: serverImage.url,
              public_id: serverImage.public_id,
              isLocal: false,
              uploading: false,
              serverData: serverImage
            };
            
            if (multiple) {
              const targetIndex = images.length + index;
              if (targetIndex < updatedImages.length) {
                updatedImages[targetIndex] = updatedImage;
              } else {
                updatedImages.push(updatedImage);
              }
            } else {
              updatedImages[0] = updatedImage;
            }
          }
        });

        onImagesChange(updatedImages);

      } catch (error) {
        console.error('Upload failed:', error);
        
        // Update images with error status but don't remove them
        const updatedImages = [...images];
        newImages.forEach((localImage, index) => {
          const failedImage = {
            ...localImage,
            uploading: false,
            uploadError: error.message
          };
          
          if (multiple) {
            const targetIndex = images.length + index;
            if (targetIndex < updatedImages.length) {
              updatedImages[targetIndex] = failedImage;
            } else {
              updatedImages.push(failedImage);
            }
          } else {
            updatedImages[0] = failedImage;
          }
        });
        
        onImagesChange(updatedImages);
        
        // Show error but don't prevent user from keeping the local image
        alert(`Upload failed: ${error.message}. You can still use the image locally.`);
      }

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

    } catch (error) {
      console.error('Upload process failed:', error);
      alert('Failed to process images. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ✅ FIXED: Remove image function with better error handling
  const removeImage = async (index) => {
    const imageToRemove = images[index];
    
    // If image was uploaded in THIS session (isLocal), try to delete it from server
    // Otherwise, just remove from local state - the parent component handles deletion
    if (imageToRemove.isLocal && imageToRemove.public_id && imageToRemove.file) {
      try {
        await uploadService.deleteImage(imageToRemove.public_id);
      } catch (error) {
        console.error('❌ Failed to delete image from server:', error);
      }
    } else if (!imageToRemove.isLocal && imageToRemove.public_id) {
      // For existing images being removed from product edit, parent will track deletion
    }

    // Revoke object URL if it's a local preview
    if (imageToRemove.url && imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Remove from local state immediately for instant UI feedback
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getFileSize = (bytes) => {
    if (!bytes) return 'Unknown';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {!multiple && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className={`
        border-2 border-dashed rounded-lg p-6 text-center transition-colors
        ${disabled 
          ? 'border-gray-200 bg-gray-50 cursor-not-allowed' 
          : 'border-gray-300 hover:border-gray-400 bg-white cursor-pointer'
        }
      `}>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          multiple={multiple}
          accept={accept}
          className="hidden"
          disabled={disabled || uploading}
        />
        
        <div 
          onClick={!disabled && !uploading ? triggerFileInput : undefined}
          className="space-y-4"
        >
          {uploading ? (
            <Loader className="w-12 h-12 text-blue-500 mx-auto animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-gray-400 mx-auto" />
          )}
          
          <div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); triggerFileInput(); }}
              disabled={disabled || uploading}
              className={`
                inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${disabled || uploading
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed border-transparent'
                  : 'bg-blue-600 text-white hover:bg-blue-700 border-transparent'
                }
              `}
            >
              {uploading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                `Choose ${multiple ? 'Images' : 'Image'}`
              )}
            </button>
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <p>
                {multiple 
                  ? `PNG, JPG, GIF, WebP up to ${maxFiles} files, ${maxSizeMB}MB each` 
                  : `PNG, JPG, GIF, WebP up to ${maxSizeMB}MB`
                }
              </p>
              {helpText && (
                <p className="text-gray-400">{helpText}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-3">
            {images.length} {images.length === 1 ? 'image' : 'images'} selected
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
                <img
                  src={image.url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover"
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzljYTNhZCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEVycm9yPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
                
                {/* Upload status overlay */}
                {image.uploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Loader className="w-6 h-6 text-white animate-spin" />
                  </div>
                )}
                
                {/* Image info overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-end">
                  <div className="w-full p-2 bg-gradient-to-t from-black via-black/80 to-transparent text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="truncate">{image.originalName || 'image'}</p>
                    {image.size && (
                      <p className="text-gray-300">{getFileSize(image.size)}</p>
                    )}
                  </div>
                </div>

                {/* Status badge */}
                <div className={`absolute top-1 left-1 text-white text-xs px-1.5 py-0.5 rounded ${
                  image.uploading ? 'bg-yellow-500' : 
                  image.uploadError ? 'bg-red-500' : 
                  image.isLocal ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  {image.uploading ? 'Uploading' : 
                   image.uploadError ? 'Failed' : 
                   image.isLocal ? 'Local' : 'Server'}
                </div>

                {/* Remove button */}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
