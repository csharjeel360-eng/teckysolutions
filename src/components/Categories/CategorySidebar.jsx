import React from 'react';
import { Link, useParams } from 'react-router-dom';

const CategorySidebar = ({ 
  categories = [], 
  onCategorySelect
}) => {
  const { id: currentCategoryId } = useParams();

  const handleCategoryClick = (category) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sticky top-4">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
        <p className="text-sm text-gray-500 mt-1">Filter by category</p>
      </div>

      {/* Categories Section */}
      <div className="space-y-2">
        {/* All Categories Link */}
        <Link
          to="/products"
          className={`block py-2 px-3 rounded-lg transition-colors ${
            !currentCategoryId
              ? 'bg-[#2563eb] text-white font-medium'
              : 'text-gray-700 hover:bg-gray-50 hover:text-[#2563eb]'
          }`}
          onClick={() => handleCategoryClick(null)}
        >
          <div className="flex items-center justify-between">
            <span>All Categories</span>
          </div>
        </Link>

        {/* Categories List */}
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/category/${category._id}/products`}
            className={`block py-2 px-3 rounded-lg transition-colors ${
              currentCategoryId === category._id
                ? 'bg-[#2563eb] text-white font-medium'
                : 'text-gray-700 hover:bg-gray-50 hover:text-[#2563eb]'
            }`}
            onClick={() => handleCategoryClick(category)}
          >
            <div className="flex items-center space-x-3">
              <img
                src={category.image?.url || '/api/placeholder/24/24'}
                alt={category.name}
                className="w-6 h-6 object-cover rounded flex-shrink-0"
              />
              <span className="truncate">{category.name}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* No Categories Message */}
      {categories.length === 0 && (
        <div className="text-center py-6 text-gray-500">
          <p className="text-sm">No categories available</p>
        </div>
      )}
    </div>
  );
};

export default CategorySidebar;