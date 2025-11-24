import React, { useState } from 'react';
import { Filter, X, Star, DollarSign } from 'lucide-react';
import Button from '../UI/Button';

const ProductFilters = ({
  categories = [],
  selectedCategory,
  onCategoryChange,
  priceRange = [0, 1000],
  onPriceRangeChange,
  selectedRatings = [],
  onRatingChange,
  selectedSort = 'createdAt',
  onSortChange,
  onClearFilters,
  productCount = 0
}) => {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  const sortOptions = [
    { value: 'createdAt', label: 'Newest First' },
    { value: '-createdAt', label: 'Oldest First' },
    { value: 'price', label: 'Price: Low to High' },
    { value: '-price', label: 'Price: High to Low' },
    { value: 'title', label: 'Name: A to Z' },
    { value: '-title', label: 'Name: Z to A' },
    { value: '-averageRating', label: 'Highest Rated' },
    { value: '-buyClicks', label: 'Most Popular' }
  ];

  const ratingOptions = [
    { stars: 5, label: '5 Stars' },
    { stars: 4, label: '4 Stars & Up' },
    { stars: 3, label: '3 Stars & Up' },
    { stars: 2, label: '2 Stars & Up' },
    { stars: 1, label: '1 Star & Up' }
  ];

  const handleRatingToggle = (rating) => {
    onRatingChange(
      selectedRatings.includes(rating)
        ? selectedRatings.filter(r => r !== rating)
        : [...selectedRatings, rating]
    );
  };

  const handlePriceChange = (min, max) => {
    onPriceRangeChange([min, max]);
  };

  const hasActiveFilters = selectedCategory || selectedRatings.length > 0 || priceRange[0] > 0 || priceRange[1] < 1000;

  return (
    <>
      {/* Mobile Filter Button */}
      <div className="lg:hidden mb-4">
        <Button
          variant="outline"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="w-full flex items-center justify-center space-x-2"
        >
          <Filter className="w-4 h-4" />
          <span>Filters & Sort</span>
          {hasActiveFilters && (
            <span className="bg-temu-red text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Desktop Filters */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <FiltersContent
            categories={categories}
            selectedCategory={selectedCategory}
            onCategoryChange={onCategoryChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            selectedRatings={selectedRatings}
            onRatingToggle={handleRatingToggle}
            ratingOptions={ratingOptions}
            selectedSort={selectedSort}
            onSortChange={onSortChange}
            sortOptions={sortOptions}
            productCount={productCount}
            onClearFilters={onClearFilters}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setIsMobileFiltersOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Filters & Sort</h3>
              <button
                onClick={() => setIsMobileFiltersOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <FiltersContent
                categories={categories}
                selectedCategory={selectedCategory}
                onCategoryChange={onCategoryChange}
                priceRange={priceRange}
                onPriceChange={handlePriceChange}
                selectedRatings={selectedRatings}
                onRatingToggle={handleRatingToggle}
                ratingOptions={ratingOptions}
                selectedSort={selectedSort}
                onSortChange={onSortChange}
                sortOptions={sortOptions}
                productCount={productCount}
                onClearFilters={() => {
                  onClearFilters();
                  setIsMobileFiltersOpen(false);
                }}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Separate component for filter content to avoid duplication
const FiltersContent = ({
  categories,
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedRatings,
  onRatingToggle,
  ratingOptions,
  selectedSort,
  onSortChange,
  sortOptions,
  productCount,
  onClearFilters,
  hasActiveFilters
}) => (
  <div className="space-y-6">
    {/* Results Count */}
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium text-gray-900">
        {productCount} products
      </span>
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="text-sm text-temu-red hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      )}
    </div>

    {/* Sort Options */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort By
      </label>
      <select
        value={selectedSort}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-temu-red focus:border-transparent"
      >
        {sortOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>

    {/* Categories */}
    <div>
      <h3 className="font-medium text-gray-900 mb-3">Categories</h3>
      <div className="space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
            !selectedCategory
              ? 'bg-temu-red text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          All Categories
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`block w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === category._id
                ? 'bg-temu-red text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <div className="flex items-center space-x-2">
              <img
                src={category.image?.url || '/api/placeholder/24/24'}
                alt={category.name}
                className="w-4 h-4 object-cover rounded"
              />
              <span>{category.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>

    {/* Price Range */}
    <div>
      <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
        <DollarSign className="w-4 h-4" />
        <span>Price Range</span>
      </h3>
      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
        <div className="flex space-x-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => onPriceChange(parseInt(e.target.value) || 0, priceRange[1])}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Min"
          />
          <span className="flex items-center text-gray-500">-</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => onPriceChange(priceRange[0], parseInt(e.target.value) || 1000)}
            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            placeholder="Max"
          />
        </div>
        <input
          type="range"
          min="0"
          max="1000"
          step="10"
          value={priceRange[1]}
          onChange={(e) => onPriceChange(priceRange[0], parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        />
      </div>
    </div>

    {/* Ratings */}
    <div>
      <h3 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
        <Star className="w-4 h-4" />
        <span>Customer Rating</span>
      </h3>
      <div className="space-y-2">
        {ratingOptions.map((option) => (
          <label key={option.stars} className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedRatings.includes(option.stars)}
              onChange={() => onRatingToggle(option.stars)}
              className="w-4 h-4 text-temu-red border-gray-300 rounded focus:ring-temu-red"
            />
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className={`text-sm ${
                    i < option.stars ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-sm text-gray-600 flex-1">{option.label}</span>
          </label>
        ))}
      </div>
    </div>

    {/* Apply Filters Button (Mobile) */}
    <div className="lg:hidden">
      <Button
        onClick={onClearFilters}
        variant="primary"
        className="w-full"
      >
        Apply Filters
      </Button>
    </div>
  </div>
);

export default ProductFilters;