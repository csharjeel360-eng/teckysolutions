// components/Categories/Categories.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Grid, List, Filter } from 'lucide-react';
import CategoryGrid from '../../components/Categories/CategoryGrid';
import CategorySidebar from '../../components/Categories/CategorySidebar';
import Button from '../../components/UI/Button';
import categoryService from '../../services/categoryService';
import { useApp } from '../../context/AppContext';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const Categories = () => {
  const { categories: contextCategories } = useApp();
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [showSidebar, setShowSidebar] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
  }, [searchTerm, categories]);

  const loadCategories = async () => {
    // Use context categories if available
    if (contextCategories && contextCategories.length > 0) {
      setCategories(contextCategories);
      setFilteredCategories(contextCategories);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await categoryService.getAll();
      
      if (response && response.data) {
        setCategories(response.data);
        setFilteredCategories(response.data);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      setError(error.message || 'Failed to load categories');
      
      // Set empty arrays to prevent further errors
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategorySelect = (category) => {
    // Category selected
  };

  const handleRetry = () => {
    loadCategories();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
        <LoadingSpinner size="large" showBrand={true} brandText="TrendyBreeze" />
      </div>
    );
  }

  if (error && categories.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <span className="text-red-500 text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Categories</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <Button onClick={handleRetry} variant="primary">
              Try Again
            </Button>
            <Link to="/">
              <Button variant="outline">
                Go Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover amazing products across all categories. Find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for larger screens */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <CategorySidebar
              categories={categories}
              onCategorySelect={handleCategorySelect}
              showFilters={false}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls Bar */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
                {/* Search */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* View Controls */}
                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    className="lg:hidden flex items-center space-x-2"
                    onClick={() => setShowSidebar(!showSidebar)}
                  >
                    <Filter className="w-4 h-4" />
                    <span>Filters</span>
                  </Button>

                  {/* View Mode Toggle */}
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 transition-colors ${
                        viewMode === 'grid'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 transition-colors ${
                        viewMode === 'list'
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {filteredCategories.length} of {categories.length} categories
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Clear search
                  </button>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && categories.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-yellow-600 mr-2">⚠️</span>
                  <p className="text-yellow-800 text-sm">
                    {error} Showing cached categories.
                  </p>
                </div>
              </div>
            )}

            {/* Categories Grid */}
            <CategoryGrid
              categories={filteredCategories}
              loading={false} // We handle loading at component level
              columns={viewMode === 'grid' ? 4 : 1}
              size={viewMode === 'grid' ? 'medium' : 'large'}
              showDescription={viewMode === 'list'}
              showProductCount={viewMode === 'list'}
            />

            {/* No Results */}
            {!loading && filteredCategories.length === 0 && searchTerm && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 mb-6">
                  No categories match your search for "{searchTerm}". Try different keywords.
                </p>
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="primary"
                >
                  View All Categories
                </Button>
              </div>
            )}

            {/* No Categories Available */}
            {!loading && categories.length === 0 && !searchTerm && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl text-gray-400">📁</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No Categories Available
                </h3>
                <p className="text-gray-600 mb-6">
                  There are no categories available at the moment. Please check back later.
                </p>
                <Link to="/">
                  <Button variant="primary">
                    Go to Homepage
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Modal */}
      {showSidebar && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className="absolute left-0 top-0 h-full w-80 bg-white overflow-y-auto">
            <CategorySidebar
              categories={categories}
              onCategorySelect={(category) => {
                handleCategorySelect(category);
                setShowSidebar(false);
              }}
              showFilters={true}
            />
          </div>
        </div>
      )}

      {/* CTA Section removed per request (Contact Support) */}
    </div>
  );
};

export default Categories;
