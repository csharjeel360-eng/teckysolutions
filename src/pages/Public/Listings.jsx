// pages/Public/Listings.jsx
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

const Listings = () => {
  const { slug: categorySlug } = useParams();
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
    return 'All Listings';
  }, [selectedCategory, searchTerm]);

  // Set SEO metadata via hook (must be called at top-level)
  useSEO({
    title: pageTitle,
    description: `Browse our ${pageTitle.toLowerCase()} collection`,
    url: window.location.href
  });

  useEffect(() => {
    // Set page title with domain suffix
    setPageTitle(pageTitle);
  }, [pageTitle]);

  // Update category filter
  useEffect(() => {
    if (selectedCategory) {
      setCategory(selectedCategory._id || selectedCategory.id);
    } else {
      setCategory(null);
    }
  }, [selectedCategory, setCategory]);

  // Update search filter
  useEffect(() => {
    setSearch(searchTerm);
  }, [searchTerm, setSearch]);

  // Handle sort change
  const handleSortChange = (sortBy) => {
    setLocalFilters(prev => ({ ...prev, sortBy }));
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const search = formData.get('search');
    if (search) {
      setSearchParams({ search });
    }
  };

  // Clear search
  const clearSearch = () => {
    setSearchParams({});
    setLocalFilters(prev => ({ ...prev, search: '' }));
  };

  if (categoriesLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <Home size={16} /> Home
          </Link>
          <span className="text-gray-400">/</span>
          <span className="text-gray-700">
            {selectedCategory ? selectedCategory.name : 'All Listings'}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <CategorySidebar 
              categories={categories}
              selectedCategoryId={selectedCategory?.id || selectedCategory?._id}
              onCategorySelect={(categorySlug) => {
                navigate(`/category/${categorySlug}/listings`);
              }}
            />
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Search and Filter Bar */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold text-gray-900">{pageTitle}</h1>
                
                <div className="flex items-center gap-2">
                  <select 
                    value={localFilters.sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                    <option value="popular">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="mt-4 flex gap-2">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search listings..."
                    defaultValue={searchTerm}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <Filter size={18} /> Search
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition flex items-center gap-2"
                  >
                    <X size={18} /> Clear
                  </button>
                )}
              </form>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-gray-700">
                  Search results for: <span className="font-semibold text-blue-600">"{searchTerm}"</span>
                  {products?.length > 0 && <span className="ml-2">({products.length} result{products.length !== 1 ? 's' : ''})</span>}
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Error State */}
            {error && !loading && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                Error loading listings: {error}
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && (!products || products.length === 0) && (
              <EmptyState 
                title="No Listings Found"
                message={searchTerm ? "No listings match your search. Try different keywords." : "No listings available in this category."}
                actionText="Browse All Listings"
                onAction={() => navigate('/listings')}
              />
            )}

            {/* Products Grid */}
            {!loading && !error && products && products.length > 0 && (
              <ProductGrid 
                products={products}
                onProductClick={(product) => {
                  navigate(`/listings/${product.slug}`);
                }}
              />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Listings;
