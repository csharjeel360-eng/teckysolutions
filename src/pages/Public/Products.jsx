// components/Products/Products.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import ProductGrid from '../../components/Products/ProductGrid';
import CategorySidebar from '../../components/Categories/CategorySidebar';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { X, Search, Filter } from 'lucide-react';
import { setPageTitle } from '../../utils/slugify';

const Products = () => {
  const { id: categoryId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const { 
    products, 
    loading, 
    error, 
    setCategory,
    setSearch 
  } = useProducts();
  
  const { categories, loading: categoriesLoading } = useCategories();
  
  const [localFilters, setLocalFilters] = useState({
    sortBy: 'newest',
    search: searchParams.get('search') || ''
  });

  const selectedCategory = categories?.find(cat => cat._id === categoryId);
  const searchTerm = searchParams.get('search') || '';

  // Initialize when categoryId or search params change
  useEffect(() => {
    // Set page title
    if (categoryId && categories.length > 0) {
      const category = categories.find(c => c._id === categoryId);
      setPageTitle(category?.name || 'Products');
    } else if (searchTerm) {
      setPageTitle(`Search: ${searchTerm}`);
    } else {
      setPageTitle('Products');
    }

    if (categoryId) {
      setCategory(categoryId);
    }

    if (searchTerm) {
      setSearch(searchTerm);
      setLocalFilters(prev => ({ ...prev, search: searchTerm }));
    } else {
      setSearch('');
      setLocalFilters(prev => ({ ...prev, search: '' }));
    }
  }, [categoryId, searchTerm, setCategory, setSearch, categories]);

  // Filter products by category and search
  const filteredProducts = React.useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Filter by category
    if (categoryId) {
      filtered = filtered.filter(product => 
        product.category?._id === categoryId || 
        product.category === categoryId
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower)
      );
    }

    // Sort products
    switch (localFilters.sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.title?.localeCompare(b.title));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, localFilters, categoryId, searchTerm]);

  const handleCategorySelect = (category) => {
    if (category) {
      navigate(`/category/${category._id}/products`);
    } else {
      navigate('/products');
    }
  };

  const handleSortChange = (sortBy) => {
    setLocalFilters(prev => ({ ...prev, sortBy }));
  };

  const handleClearAllFilters = () => {
    // Clear category
    setCategory('');
    
    // Clear search from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    setSearchParams(newSearchParams);
    
    // Clear local filters
    setLocalFilters({ sortBy: 'newest', search: '' });
    
    // Navigate to base products page
    navigate('/products');
  };

  const handleClearSearch = () => {
    // Clear search from URL
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    setSearchParams(newSearchParams);
    
    // Clear search state
    setSearch('');
    setLocalFilters(prev => ({ ...prev, search: '' }));
  };

  const handleClearCategory = () => {
    navigate('/products');
  };

  // Check if any filters are active
  const hasActiveFilters = categoryId || searchTerm;
  const hasSearchResults = searchTerm && filteredProducts.length === 0;

  if (loading || categoriesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center text-red-600 bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-2">Error loading products</h3>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {selectedCategory ? selectedCategory.name : 'All Products'}
          </h1>
          <p className="text-lg text-gray-600">
            {selectedCategory 
              ? selectedCategory.description || `Browse all products in ${selectedCategory.name}`
              : 'Discover our wide range of amazing products'
            }
          </p>
          
          {/* Active Filters Display */}
          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-sm text-gray-500 font-medium">Active filters:</span>
              
              {/* Search Filter Badge */}
              {searchTerm && (
                <div className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                  <Search className="w-3 h-3" />
                  <span>Search: "{searchTerm}"</span>
                  <button
                    onClick={handleClearSearch}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Category Filter Badge */}
              {categoryId && selectedCategory && (
                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                  <Filter className="w-3 h-3" />
                  <span>Category: {selectedCategory.name}</span>
                  <button
                    onClick={handleClearCategory}
                    className="text-green-600 hover:text-green-800"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              
              {/* Clear All Button */}
              <button
                onClick={handleClearAllFilters}
                className="text-sm text-[#f97316] hover:text-[#ea580c] font-medium px-3 py-1 border border-[#f97316] rounded-lg hover:bg-orange-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Category Sidebar */}
          <div className="lg:w-1/4">
            <CategorySidebar
              categories={categories || []}
              onCategorySelect={handleCategorySelect}
              productCounts={{}}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-gray-600">
                  Showing {filteredProducts.length} of {products.length} products
                  {categoryId && selectedCategory && ` in ${selectedCategory.name}`}
                  {searchTerm && ` for "${searchTerm}"`}
                </p>
                
                {/* No Results Message */}
                {hasSearchResults && (
                  <p className="text-sm text-[#f97316] font-medium">
                    No products found for "{searchTerm}". Try different keywords or browse all products.
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4 flex-wrap">
                {/* Sort Dropdown */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-500">Sort by:</label>
                  <select
                    value={localFilters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2563eb] focus:border-transparent"
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <ProductGrid 
                products={filteredProducts}
                columns={3}
                layout="grid"
                showDescription={false}
                className="grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4"
              />
            ) : (
              <EmptyState
                title={
                  hasSearchResults 
                    ? "No Products Found" 
                    : "No Products Available"
                }
                message={
                  hasSearchResults
                    ? `No products found for "${searchTerm}". Try searching with different keywords or browse all products.`
                    : categoryId
                    ? `No products found in ${selectedCategory?.name}. Try selecting a different category.`
                    : "No products are available at the moment. Please check back later."
                }
                icon={hasSearchResults ? "🔍" : "📦"}
                action={
                  <div className="flex flex-wrap gap-3 mt-4">
                    {/* Clear Search Button */}
                    {searchTerm && (
                      <button
                        onClick={handleClearSearch}
                        className="px-6 py-2 bg-[#f97316] text-white rounded-lg hover:bg-[#ea580c] transition-colors font-medium"
                      >
                        Clear Search
                      </button>
                    )}
                    
                    {/* Clear Category Button */}
                    {categoryId && (
                      <button
                        onClick={handleClearCategory}
                        className="px-6 py-2 border border-[#2563eb] text-[#2563eb] rounded-lg hover:bg-[#2563eb] hover:text-white transition-colors font-medium"
                      >
                        View All Categories
                      </button>
                    )}
                    
                    {/* View All Products Button */}
                    {(searchTerm || categoryId) && (
                      <button
                        onClick={handleClearAllFilters}
                        className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium"
                      >
                        View All Products
                      </button>
                    )}
                    
                    {/* Browse Products Button when no products at all */}
                    {!searchTerm && !categoryId && filteredProducts.length === 0 && (
                      <button
                        onClick={() => navigate('/categories')}
                        className="px-6 py-2 bg-[#2563eb] text-white rounded-lg hover:bg-[#1e40af] transition-colors font-medium"
                      >
                        Browse Categories
                      </button>
                    )}
                  </div>
                }
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;