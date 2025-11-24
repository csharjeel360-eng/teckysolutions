import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Star, ShoppingCart } from 'lucide-react';

const ProductCard = ({ 
  product, 
  layout = 'grid',
  showDescription = false,
  showActions = true,
  size = 'medium',
  onAddToCart
}) => {
  const navigate = useNavigate();
  
  const {
    _id,
    title,
    price,
    originalPrice,
    images,
    averageRating = 0,
    reviews = [],
    stock,
    isActive = true
  } = product;

  const mainImage = images?.[0]?.url || '/images/placeholder-product.jpg';
  const rating = averageRating || 0;
  const reviewCount = reviews?.length || 0;
  const hasDiscount = originalPrice && originalPrice > price;

  // Size classes
  const sizeClasses = {
    small: {
      container: 'p-3',
      image: 'h-32',
      title: 'text-sm font-medium',
      price: 'text-base font-bold',
      originalPrice: 'text-xs',
      rating: 'text-xs',
      button: 'px-2 py-1 text-xs'
    },
    medium: {
      container: 'p-4',
      image: 'h-40',
      title: 'text-base font-semibold',
      price: 'text-lg font-bold',
      originalPrice: 'text-sm',
      rating: 'text-sm',
      button: 'px-3 py-2 text-sm'
    },
    large: {
      container: 'p-6',
      image: 'h-48',
      title: 'text-lg font-semibold',
      price: 'text-xl font-bold',
      originalPrice: 'text-base',
      rating: 'text-base',
      button: 'px-4 py-2 text-base'
    }
  };

  const sizeConfig = sizeClasses[size];

  if (!_id) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
        <p className="text-red-600">Invalid product data</p>
      </div>
    );
  }

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  if (layout === 'list') {
    return (
      <Link 
        to={`/products/${_id}`}
        className="block bg-white rounded-xl shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-300 hover:border-[#2563eb]/20"
      >
        <div className="flex gap-4">
          <div className="flex-shrink-0 relative">
            <img
              src={mainImage}
              alt={title}
              className="w-24 h-24 object-cover rounded-lg"
            />
            {hasDiscount && (
              <div className="absolute top-2 left-2 bg-[#f97316] text-white px-2 py-1 rounded text-xs font-bold">
                SALE
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {title}
            </h3>
            {showDescription && product.description && (
              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                {product.description}
              </p>
            )}
            <div className="flex items-center mt-2">
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm text-gray-600 ml-1">
                  {rating.toFixed(1)}
                </span>
                <span className="text-sm text-gray-400 ml-1">
                  ({reviewCount})
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold text-[#2563eb]">
                  ${price?.toFixed(2)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-gray-400 line-through">
                    ${originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
              {showActions && (
                <button 
                  onClick={handleAddToCart}
                  className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link 
      to={`/products/${_id}`}
      className={`block bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 hover:border-[#2563eb]/20 group ${sizeConfig.container}`}
    >
      <div className="relative">
        <img
          src={mainImage}
          alt={title}
          className={`w-full object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-300 ${sizeConfig.image}`}
        />
        
        {/* Badges */}
        {!isActive && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            Out of Stock
          </div>
        )}
        {stock > 0 && stock < 10 && (
          <div className="absolute top-2 left-2 bg-[#f97316] text-white px-2 py-1 rounded text-xs font-bold">
            Low Stock
          </div>
        )}
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-[#f97316] text-white px-2 py-1 rounded text-xs font-bold">
            SALE
          </div>
        )}
      </div>

      <div className="mt-3">
        <h3 className={`text-gray-900 line-clamp-2 group-hover:text-[#2563eb] transition-colors ${sizeConfig.title}`}>
          {title}
        </h3>

        <div className="flex items-center mt-2">
          <div className="flex items-center">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className={`text-gray-600 ml-1 ${sizeConfig.rating}`}>
              {rating.toFixed(1)}
            </span>
            <span className={`text-gray-400 ml-1 ${sizeConfig.rating}`}>
              ({reviewCount})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-2">
            <span className={`text-[#2563eb] ${sizeConfig.price}`}>
              ${price?.toFixed(2)}
            </span>
            {hasDiscount && (
              <span className={`text-gray-400 line-through ${sizeConfig.originalPrice}`}>
                ${originalPrice?.toFixed(2)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      {showActions && (
        <div className="flex items-center justify-between mt-4">
          <button 
            onClick={handleAddToCart}
            className={`bg-[#f97316] hover:bg-[#ea580c] text-white rounded-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center space-x-2 ${sizeConfig.button}`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Add to Cart</span>
          </button>
          
          <button 
            className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-full hover:bg-gray-100"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              // Handle wishlist action
            }}
          >
            <Heart className="w-4 h-4" />
          </button>
        </div>
      )}
    </Link>
  );
};

export default ProductCard;