// components/Products/Products.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useSEO from '../../hooks/useSEO';
import ProductGrid from '../../components/Products/ProductGrid';
import CategorySidebar from '../../components/Categories/CategorySidebar';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { X, Search, Filter, Home } from 'lucide-react';
import { setPageTitle, generateSlug } from '../../utils/slugify';

const Products = () => {
  const { slug: categorySlug } = useParams(); // Changed from id to slug
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

  // Find category by slug instead of ID
  const selectedCategory = useMemo(() => 
    categories?.find(cat => generateSlug(cat.name) === categorySlug),
    [categories, categorySlug]
  );
  
  const searchTerm = searchParams.get('search') || '';
  const currentPage = parseInt(searchParams.get('page')) || 1;

  // Generate page metadata
  const pageTitle = useMemo(() => {
    if (selectedCategory) {
      return selectedCategory.name;
    } else if (searchTerm) {
      return `Search Results: ${searchTerm}`;
    }
    return 'All Products';
  }, [selectedCategory, searchTerm]);

  const metaDescription = useMemo(() => {
    if (selectedCategory) {
      return selectedCategory.description || `Browse all products in ${selectedCategory?.name}. Find quality items at competitive prices.`;
    } else if (searchTerm) {
      return `Search results for "${searchTerm}" on our products page. Find what you're looking for from our extensive collection.`;
    }
    return 'Discover our wide range of amazing products. Quality items at competitive prices with fast shipping.';
  }, [selectedCategory, searchTerm]);

  // Initialize when categorySlug or search params change
  useEffect(() => {
    // Set page title
    if (selectedCategory) {
      setPageTitle(selectedCategory.name);
    } else if (searchTerm) {
      setPageTitle(`Search: ${searchTerm}`);
    } else {
      setPageTitle('Products');
    }

    if (selectedCategory) {
      setCategory(selectedCategory._id);
    }

    if (searchTerm) {
      setSearch(searchTerm);
      setLocalFilters(prev => ({ ...prev, search: searchTerm }));
    } else {
      setSearch('');
      setLocalFilters(prev => ({ ...prev, search: '' }));
    }
  }, [selectedCategory, searchTerm, setCategory, setSearch]);

  // Filter products by category and search
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) return [];

    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category?._id === selectedCategory._id || 
        product.category === selectedCategory._id
      );
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.title?.toLowerCase().includes(searchLower) ||
        product.description?.toLowerCase().includes(searchLower) ||
        product.category?.name?.toLowerCase().includes(searchLower) ||
        product.brand?.toLowerCase().includes(searchLower) ||
        product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
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
      case 'popular':
        filtered.sort((a, b) => (b.popularityScore || 0) - (a.popularityScore || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [products, localFilters, selectedCategory, searchTerm]);

  // Generate structured data for products - MOVED AFTER filteredProducts
  const structuredData = useMemo(() => {
    if (!filteredProducts || filteredProducts.length === 0) return null;
    
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": filteredProducts.map((product, index) => ({
        "@type": "Product",
        "position": index + 1,
        "url": `${window.location.origin}/product/${generateSlug(product.title)}-${product._id}`,
        "name": product.title,
        "description": product.description?.substring(0, 200) || '',
        "image": product.images?.[0] || "",
        "brand": product.brand ? {
          "@type": "Brand",
          "name": product.brand
        } : undefined,
        "sku": product.sku || product._id,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "PKR",
          "price": product.price,
          "availability": product.stock > 0 ? 
            "https://schema.org/InStock" : 
            "https://schema.org/OutOfStock",
          "url": `${window.location.origin}/product/${generateSlug(product.title)}-${product._id}`,
          "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        "aggregateRating": product.averageRating ? {
          "@type": "AggregateRating",
          "ratingValue": product.averageRating,
          "reviewCount": product.reviews?.length || 0
        } : undefined
      }))
    };
  }, [filteredProducts]);

  const handleCategorySelect = (category) => {
    if (category) {
      navigate(`/category/${generateSlug(category.name)}/products`);
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
    newSearchParams.delete('page');
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
  const hasActiveFilters = selectedCategory || searchTerm;
  const hasSearchResults = searchTerm && filteredProducts.length === 0;

  // Setup SEO - Must be called before any early returns
  useSEO({
    title: `${pageTitle} | TrendyBreeze`,
    description: metaDescription,
    url: window.location.href,
    image: selectedCategory?.image,
    schema: structuredData
  });

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
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav className="mb-6" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
              <li>
                <Link 
                  to="/" 
                  className="flex items-center gap-1 hover:text-gray-900 transition-colors"
                  aria-label="Home"
                >
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link 
                  to="/products" 
                  className="hover:text-gray-900 transition-colors"
                  aria-label="All Products"
                >
                  Products
                </Link>
              </li>
              {selectedCategory && (
                <>
                  <li aria-hidden="true">/</li>
                  <li 
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    {selectedCategory.name}
                  </li>
                </>
              )}
              {searchTerm && (
                <>
                  <li aria-hidden="true">/</li>
                  <li 
                    className="text-gray-900 font-medium"
                    aria-current="page"
                  >
                    Search: "{searchTerm}"
                  </li>
                </>
              )}
            </ol>
          </nav>

          {/* Page Header Section */}
          <section aria-labelledby="page-header">
            <div className="mb-8">
              <h1 id="page-header" className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {selectedCategory ? selectedCategory.name : 'All Products'}
              </h1>
              <p className="text-lg text-gray-600">
                {metaDescription}
              </p>
              
              {/* Active Filters Display */}
              {hasActiveFilters && (
                <div className="mt-4 flex flex-wrap items-center gap-3" aria-label="Active filters">
                  <span className="text-sm text-gray-500 font-medium">Active filters:</span>
                  
                  {/* Search Filter Badge */}
                  {searchTerm && (
                    <div className="flex items-center gap-2 bg-gray-100 text-black px-3 py-1 rounded-full text-sm">
                      <Search className="w-3 h-3" aria-hidden="true" />
                      <span>Search: "{searchTerm}"</span>
                      <button
                        onClick={handleClearSearch}
                        className="text-black hover:text-gray-700"
                        aria-label={`Clear search filter for "${searchTerm}"`}
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  
                  {/* Category Filter Badge */}
                  {selectedCategory && (
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      <Filter className="w-3 h-3" aria-hidden="true" />
                      <span>Category: {selectedCategory.name}</span>
                      <button
                        onClick={handleClearCategory}
                        className="text-green-600 hover:text-green-800"
                        aria-label={`Clear category filter for ${selectedCategory.name}`}
                      >
                        <X className="w-3 h-3" aria-hidden="true" />
                      </button>
                    </div>
                  )}
                  
                  {/* Clear All Button */}
              <button
                onClick={handleClearAllFilters}
                className="text-sm text-black hover:text-gray-700 font-medium px-3 py-1 border border-black rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Clear all filters"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Category Sidebar Section */}
        <aside className="lg:w-1/4" aria-label="Product categories">
          <CategorySidebar
            categories={categories || []}
            onCategorySelect={handleCategorySelect}
            productCounts={{}}
          />
        </aside>

        {/* Products Grid Section */}
        <section className="lg:w-3/4" aria-labelledby="products-heading">
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex flex-col gap-2">
              <h2 id="products-heading" className="sr-only">
                Products List
              </h2>
              
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory && ` in ${selectedCategory.name}`}
                {searchTerm && ` for "${searchTerm}"`}
              </p>
              
              {/* No Results Message */}
              {hasSearchResults && (
                <p className="text-sm text-black font-medium">
                  No products found for "{searchTerm}". Try different keywords or browse all products.
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-select" className="text-sm text-gray-500">
                  Sort by:
                </label>
                <select
                  id="sort-select"
                  value={localFilters.sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  aria-label="Sort products by"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name</option>
                  <option value="rating">Rating</option>
                  <option value="popular">Most Popular</option>
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
              // Make sure ProductGrid passes alt text to images
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
                  : selectedCategory
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
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      aria-label="Clear search and show all products"
                    >
                      Clear Search
                    </button>
                  )}
                  
                  {/* Clear Category Button */}
                  {selectedCategory && (
                    <button
                      onClick={handleClearCategory}
                      className="px-6 py-2 border border-black text-black rounded-lg hover:bg-black hover:text-white transition-colors font-medium"
                      aria-label="View all categories"
                    >
                      View All Categories
                    </button>
                  )}
                  
                  {/* View All Products Button */}
                  {(searchTerm || selectedCategory) && (
                    <button
                      onClick={handleClearAllFilters}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      aria-label="View all products"
                    >
                      View All Products
                    </button>
                  )}
                  
                  {/* Browse Products Button when no products at all */}
                  {!searchTerm && !selectedCategory && filteredProducts.length === 0 && (
                    <button
                      onClick={() => navigate('/categories')}
                      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                      aria-label="Browse all categories"
                    >
                      Browse Categories
                    </button>
                  )}
                </div>
              }
            />
          )}
        </section>
      </div>
    </div>
  </main>
</>
);
};

export default Products;