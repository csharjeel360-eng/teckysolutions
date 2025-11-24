import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ 
  category, 
  size = 'medium',
  showDescription = true,
  showProductCount = false 
}) => {
  const {
    _id,
    name,
    description,
    image,
    productCount = 0
  } = category;

  const sizeClasses = {
    small: 'p-4',
    medium: 'p-6',
    large: 'p-8'
  };

  const imageSizes = {
    small: 'w-12 h-12',
    medium: 'w-16 h-16',
    large: 'w-20 h-20'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <Link
      to={`/category/${_id}/products`}
      className="group block"
    >
      <div className={`
        bg-white rounded-2xl shadow-sm border border-gray-200 
        hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-[#2563eb]/30
        ${sizeClasses[size]}
      `}>
        {/* Category Icon/Image */}
        <div className={`
          mx-auto mb-4 bg-gradient-to-br from-[#2563eb]/10 to-[#f97316]/10 rounded-2xl p-3 
          group-hover:from-[#2563eb]/20 group-hover:to-[#f97316]/20 transition-all duration-300
          ${imageSizes[size]}
        `}>
          <img
            src={image?.url || '/api/placeholder/64/64'}
            alt={name}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Category Name */}
        <h3 className={`
          font-semibold text-gray-900 text-center mb-2 
          group-hover:text-[#2563eb] transition-colors duration-300
          ${textSizes[size]}
        `}>
          {name}
        </h3>

        {/* Description */}
        {showDescription && description && (
          <p className="text-gray-500 text-sm text-center mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Product Count */}
        {showProductCount && (
          <div className="flex items-center justify-center space-x-1 text-xs text-gray-500 mb-3">
            <span className="font-semibold text-[#2563eb]">{productCount}</span>
            <span>products</span>
          </div>
        )}

        {/* View More Arrow */}
        <div className="flex justify-center">
          <div className="
            w-8 h-8 bg-gradient-to-r from-[#2563eb] to-[#f97316] rounded-full flex items-center justify-center 
            text-white transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg
          ">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;