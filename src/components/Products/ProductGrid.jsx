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
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/product/${createSlug(product._id, product.title)}`}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group block"
          onClick={(e) => handleProductClick(product._id, e)}
        >
          {/* Product Image */}
          <div className="relative aspect-square overflow-hidden">
            <img
              src={product.images?.[0]?.url || '/api/placeholder/300/300'}
              alt={product.title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Product Info */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.title}
            </h3>
            
            {showDescription && product.description && (
              <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                {product.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">
                ${product.price?.toFixed(2)}
              </span>
              
              {product.averageRating && (
                <div className="flex items-center text-xs text-gray-600">
                  <span>★</span>
                  <span className="ml-1">{product.averageRating.toFixed(1)}</span>
                </div>
              )}
            </div>
            
            {/* Stock Status */}
            {product.stock !== undefined && (
              <div className="mt-2">
                {product.stock > 0 ? (
                  <span className="text-xs text-green-600">
                    In Stock ({product.stock})
                  </span>
                ) : (
                  <span className="text-xs text-red-600">Out of Stock</span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
