import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { generateSlug } from '../../utils/slugify';

const CategoryCardFullImage = ({ 
  category, 
  size = 'medium',
  showDescription = true,
  showProductCount = false,
  imageHeight = null
}) => {
  const {
    _id,
    name,
    description,
    image,
    productCount = 0
  } = category;

  const slug = generateSlug(name);

  return (
    <Link
      to={`/category/${slug}/listings`}
      className="group block h-full"
    >
      <div className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:scale-105">
        {/* Full Image Section */}
        {/* Size mapping to match listing/product card sizes */}
        {/* Defaults mirror ProductCard size classes */}
        {(() => {
          const sizeClasses = {
            small: { container: 'p-3', image: 'h-32' },
            medium: { container: 'p-4', image: 'h-40' },
            large: { container: 'p-6', image: 'h-48' }
          };
          const sizeConfig = sizeClasses[size] || sizeClasses.medium;
          const imageClass = imageHeight || sizeConfig.image;

          return (
            <div className={`relative ${imageClass} bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0`}>
              <img
                src={image?.url || '/api/placeholder/400/300'}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black transition-all duration-300 transform scale-75 group-hover:scale-100 shadow-lg">
                  <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Content Section */}
        <div className={`flex-grow flex flex-col justify-between ${(() => {
          const sizeClasses = {
            small: { container: 'p-3', image: 'h-32' },
            medium: { container: 'p-4', image: 'h-40' },
            large: { container: 'p-6', image: 'h-48' }
          };
          return (sizeClasses[size] || sizeClasses.medium).container;
        })()}`}>
          {/* Category Name */}
          <div>
              <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
              {name}
            </h3>

            {/* Description */}
            {showDescription && description && (
              <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                {description}
              </p>
            )}
          </div>

          {/* Product Count */}
          {showProductCount && (
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-blue-600">{productCount}</span>
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {productCount === 1 ? 'listing' : 'listings'}
                </span>
              </div>
              <div className="
                w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center 
                text-white transition-all duration-300 group-hover:bg-blue-700
              ">
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCardFullImage;
