import React, { useState } from 'react';
import { ZoomIn, ChevronLeft, ChevronRight } from 'lucide-react';

const ProductImages = ({ 
  images = [], 
  alt = "Product",
  showZoom = true 
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-gray-200 rounded-2xl flex items-center justify-center">
        <span className="text-gray-500">No image available</span>
      </div>
    );
  }

  // Handle both string URLs and objects with .url property
  const normalizedImages = images.map(img => typeof img === 'string' ? { url: img } : img);
  const selectedImage = normalizedImages[selectedImageIndex];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % normalizedImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + normalizedImages.length) % normalizedImages.length);
  };

  const updateZoomPosition = (clientX, clientY, rect) => {
    if (!showZoom) return;
    
    const x = ((clientX - rect.left) / rect.width) * 100;
    const y = ((clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  const handleImageHover = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    updateZoomPosition(e.clientX, e.clientY, rect);
  };

  const handleTouchMove = (e) => {
    if (!showZoom || !isMobile) return;
    
    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    updateZoomPosition(touch.clientX, touch.clientY, rect);
  };

  const handleTouchStart = (e) => {
    setIsMobile(true);
    setIsZoomed(true);
    handleTouchMove(e);
  };

  const handleTouchEnd = () => {
    setIsZoomed(false);
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div
          className="relative h-96 md:h-[500px] cursor-zoom-in touch-none select-none"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
          onMouseMove={handleImageHover}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={selectedImage.url}
            alt={alt}
            className={`w-full h-full object-contain transition-transform duration-200 pointer-events-none ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={{
              transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              WebkitUserSelect: 'none',
              userSelect: 'none'
            }}
            draggable={false}
          />
          
          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-lg transition-all backdrop-blur-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-700 p-2 rounded-full shadow-lg transition-all backdrop-blur-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Zoom Indicator */}
          {showZoom && (
            <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full backdrop-blur-sm">
              <ZoomIn className="w-4 h-4" />
            </div>
          )}

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm backdrop-blur-sm">
              {selectedImageIndex + 1} / {images.length}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {normalizedImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition-all ${
                index === selectedImageIndex
                  ? 'border-blue-500 ring-2 ring-blue-500 ring-opacity-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={image.url}
                alt={`${alt} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImages;
