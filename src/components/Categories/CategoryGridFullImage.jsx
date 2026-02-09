import React, { useState, useEffect, useRef } from 'react';
import CategoryCardFullImage from './CategoryCardFullImage';
import EmptyState from '../Common/EmptyState';
import LoadingSpinner from '../Layout/LoadingSpinner';

const CategoryGridFullImage = ({ 
  categories = [], 
  loading = false, 
  error = null,
  columns = 3,
  size = 'medium',
  showDescription = true,
  showProductCount = false,
  imageHeight = 'h-40',
  mobileSize = null,
  horizontal = false,
  autoRotate = false,
  rotationInterval = 4000
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(3);
  const [isMobile, setIsMobile] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const touchStartX = useRef(0);

  // Detect screen size and set items to show
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setItemsToShow(2); // Mobile: show 2 items
      } else {
        setItemsToShow(3); // Desktop: show 3 items
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-rotate effect (desktop carousel and mobile scroll)
  useEffect(() => {
    if (!autoRotate || categories.length === 0 || !horizontal) return;

    if (!isMobile) {
      // Desktop carousel
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const maxIndex = Math.max(0, categories.length - itemsToShow);
          return prevIndex >= maxIndex ? 0 : prevIndex + 1;
        });
      }, rotationInterval);
      return () => clearInterval(interval);
    } else {
      // Mobile auto-scroll (uses native horizontal scrolling)
      const interval = setInterval(() => {
        if (isPaused) return; // don't auto-scroll while user interacting
        if (scrollContainerRef.current) {
          const container = scrollContainerRef.current;
          // Scroll by a single card width instead of the full viewport so
          // the container remains freely scrollable and shows multiple cards.
          const scrollAmount = Math.round(container.clientWidth / itemsToShow);
          if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 1) {
            container.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
          }
        }
      }, rotationInterval);
      return () => clearInterval(interval);
    }
  }, [autoRotate, categories.length, itemsToShow, horizontal, rotationInterval, isMobile]);

  // Calculate card width percentage
  const cardWidthPercent = (100 / itemsToShow) - 2; // Account for gaps
  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        title="Error Loading Categories"
        message={error}
        actionText="Try Again"
        onAction={() => window.location.reload()}
      />
    );
  }

  if (categories.length === 0) {
    return (
      <EmptyState
        title="No Categories Found"
        message="There are no categories available at the moment."
        actionText="Go Home"
        onAction={() => window.location.href = '/'}
      />
    );
  }

  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  };

  if (horizontal) {
    // Mobile: Native scrollable container with touch support
    if (isMobile) {
      return (
        <div className="w-full">
          {/* Mobile Scrollable Container */}
          <div
            ref={scrollContainerRef}
            className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollBehavior: 'smooth' }}
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {categories.map((category) => {
              const sizeToUse = isMobile && mobileSize ? mobileSize : size;
              return (
                <div
                  key={category._id}
                  className="flex-shrink-0"
                  style={{ flex: '0 0 calc(50% - 6px)' }}
                >
                  <CategoryCardFullImage
                    category={category}
                    size={sizeToUse}
                    showDescription={showDescription}
                    showProductCount={showProductCount}
                    imageHeight={imageHeight}
                  />
                </div>
              );
            })}
          </div>
          {/* Mobile hint text */}
          <p className="text-center text-gray-400 text-xs mt-3 md:hidden">Swipe to scroll</p>
        </div>
      );
    }

    // Desktop: Carousel with controls
    const visibleCategories = categories.slice(currentIndex, currentIndex + itemsToShow);
    const canScrollNext = currentIndex < categories.length - itemsToShow;
    const canScrollPrev = currentIndex > 0;

    return (
      <div className="w-full">
        {/* Carousel Container */}
        <div 
          ref={containerRef}
          className="flex gap-6 overflow-hidden transition-all duration-500 ease-out"
        >
          {visibleCategories.map((category) => {
            const sizeToUse = isMobile && mobileSize ? mobileSize : size;
            return (
              <div 
                key={category._id} 
                className="flex-shrink-0 transition-all duration-500"
                style={{ width: `calc(${100 / itemsToShow}% - ${(itemsToShow - 1) * 24 / itemsToShow}px)` }}
              >
                <CategoryCardFullImage
                  category={category}
                  size={sizeToUse}
                  showDescription={showDescription}
                  showProductCount={showProductCount}
                  imageHeight={imageHeight}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation Buttons - Desktop Only */}
        <div className="hidden md:flex justify-center gap-4 mt-6 items-center">
          {/* Previous Button */}
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={!canScrollPrev}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:bg-gradient-to-r disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 flex items-center justify-center shadow-lg"
            title="Previous categories"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Dots Indicator */}
          <div className="flex gap-2 items-center">
            {Array.from({ length: Math.max(1, categories.length - itemsToShow + 1) }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`rounded-full transition-all duration-300 ${
                  idx === currentIndex ? 'bg-gradient-to-r from-blue-600 to-cyan-600 w-8 h-3' : 'bg-gray-400 hover:bg-gray-500 w-2 h-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => setCurrentIndex(prev => Math.min(categories.length - itemsToShow, prev + 1))}
            disabled={!canScrollNext}
            className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:bg-gradient-to-r disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white transition-all duration-300 transform hover:scale-110 disabled:hover:scale-100 flex items-center justify-center shadow-lg"
            title="Next categories"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid ${gridCols[columns] || gridCols[3]} gap-6`}>
      {categories.map((category) => (
        <CategoryCardFullImage
          key={category._id}
          category={category}
          size={size}
          showDescription={showDescription}
          showProductCount={showProductCount}
          imageHeight={imageHeight}
        />
      ))}
    </div>
  );
};

export default CategoryGridFullImage;
