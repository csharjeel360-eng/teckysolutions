// components/Products/ProductGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { createSlug } from '../../utils/slugify';
import SkeletonProductCard from '../UI/SkeletonProductCard';

const ProductGrid = ({ 
  products, 
  columns = 4, 
  layout = 'grid',
  showDescription = true,
  className = '',
  isLoading = false,
  isInitialLoad = false
}) => {
  const gridClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-2 sm:grid-cols-3',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    5: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
    6: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
  };

  // Show skeleton only on initial load; for updates, keep showing previous products
  if (isInitialLoad && products.length === 0) {
    return (
      <div className={`grid ${gridClasses[columns] || gridClasses[4]} gap-4 ${className}`}>
        {[...Array(12)].map((_, idx) => (
          <SkeletonProductCard key={idx} />
        ))}
      </div>
    );
  }

  // ✅ FIXED: Handle product click with proper navigation
  const handleProductClick = (productId, e) => {
    // Debug log removed
    // Let the Link handle navigation naturally
  };

  return (
    <div className={`grid ${gridClasses[columns] || gridClasses[4]} gap-4 ${className}`}>
      {products.map((product) => {
        // Determine destination based on type
        const type = product.type || 'product';
        let dest = `/product/${product.slug || createSlug(product._id, product.title)}`;
        if (type === 'tool') dest = `/software/${product.slug || createSlug(product._id, product.title)}`;
        if (type === 'job') dest = `/job/${product.slug || createSlug(product._id, product.title)}`;
        if (type === 'offer') dest = `/offer/${product._id}`;

        return (
          <Link
            key={product._id}
            to={dest}
            className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group block h-full flex flex-col border border-white/10"
            onClick={(e) => handleProductClick(product._id, e)}
          >
            {/* Thumbnail - Responsive height: shorter on mobile, taller on desktop */}
            <div className="h-32 sm:h-40 md:h-48 lg:h-56 bg-gray-700 overflow-hidden flex-shrink-0">
              <img
                src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title only - hide description */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-semibold text-gray-100 text-base mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {product.title}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default ProductGrid;
