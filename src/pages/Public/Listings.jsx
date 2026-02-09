// pages/Public/Listings.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useSEO from '../../hooks/useSEO';
import ProductGrid from '../../components/Products/ProductGrid';
import MixedGrid from '../../components/Products/MixedGrid';
import CategorySidebar from '../../components/Categories/CategorySidebar';
import { offersAPI } from '../../services/api';
import OfferSection from '../../components/Products/OfferSection';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import EmptyState from '../../components/Common/EmptyState';
import { X, Search, Home } from 'lucide-react';
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

  const [offers, setOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [generalOffers, setGeneralOffers] = useState([]);
  const [generalOffersLoading, setGeneralOffersLoading] = useState(false);
  
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

  // Update category filter and load offers for this category
  useEffect(() => {
    const cid = selectedCategory ? (selectedCategory._id || selectedCategory.id) : null;
    if (cid) {
      setCategory(cid);
      // load offers for category (separate section)
      (async () => {
        try {
          setOffersLoading(true);
          const res = await offersAPI.getByCategory(cid);
          const data = res.data?.data || [];
          console.log(`📦 Offers loaded for category ${cid}:`, {
            categoryName: selectedCategory.name,
            offerCount: data.length,
            offers: data
          });
          setOffers(data);
        } catch (err) {
          console.error('❌ Failed to load offers for listings page:', err);
          setOffers([]);
        } finally {
          setOffersLoading(false);
        }
      })();
    } else {
      setCategory(null);
      setOffers([]);
      // Load general offers for the all-listings page
      (async () => {
        try {
          setGeneralOffersLoading(true);
          const res = await offersAPI.getAll({ limit: 24 });
          const data = res.data?.data || [];
          console.log('📦 General offers loaded:', { count: data.length, offers: data });
          setGeneralOffers(data);
        } catch (err) {
          console.error('Failed to load general offers:', err);
          setGeneralOffers([]);
        } finally {
          setGeneralOffersLoading(false);
        }
      })();
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

  // Determine empty-state conditions (consider offers)
  const noProductResults = !loading && !error && (!products || products.length === 0);
  const hasOffersToShow = selectedCategory ? (offers && offers.length > 0) : (generalOffers && generalOffers.length > 0);

  if (categoriesLoading) return <LoadingSpinner showBrand={true} />;

  return (
    <div className="min-h-screen">
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
              <form onSubmit={handleSearch} className="mt-4 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    name="search"
                    placeholder="Search products, brands, categories..."
                    defaultValue={searchTerm}
                    className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white transition-all duration-200"
                  />
                </div>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 font-medium whitespace-nowrap"
                >
                  <Search size={18} /> Search
                </button>
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center justify-center gap-2 font-medium whitespace-nowrap"
                  >
                    <X size={18} /> Clear
                  </button>
                )}
              </form>
            </div>


            {/* Search Results Info */}
            {searchTerm && (
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-100 to-blue-50 border-l-4 border-blue-600 rounded-lg shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <p className="text-gray-900 text-base">
                    <span className="font-semibold text-blue-700">Search results for: </span>
                    <span className="text-blue-700 font-bold">"{searchTerm}"</span>
                  </p>
                  {products?.length > 0 && (
                    <span className="inline-block px-3 py-1 bg-blue-600 text-white rounded-full text-sm font-medium">
                      {products.length} result{products.length !== 1 ? 's' : ''} found
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Loading State */}
            {loading && <LoadingSpinner />}

            {/* Error State */}
            {error && !loading && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg text-orange-700">
                Error loading listings: {error}
              </div>
            )}

            {/* Empty State */}
            {!noProductResults || hasOffersToShow ? null : (
              <EmptyState 
                title="No Listings Found"
                message={searchTerm ? "No listings match your search. Try different keywords." : "No listings available in this category."}
                actionText="Browse All Listings"
                onAction={() => navigate('/listings')}
              />
            )}

            {/* Interleaved Mixed Grid: Both offers and products for all listings */}
            {!loading && !error && !selectedCategory && generalOffers && generalOffers.length > 0 && products && products.length > 0 && (
              <MixedGrid 
                products={products || []}
                offers={generalOffers || []}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                onProductClick={(product) => {
                  const type = product.type || 'product';
                  if (type === 'tool') {
                    navigate(`/software/${product.slug}`);
                  } else if (type === 'job') {
                    navigate(`/job/${product.slug}`);
                  } else if (type === 'offer') {
                    navigate(`/offer/${product._id}`);
                  } else {
                    navigate(`/product/${product.slug}`);
                  }
                }}
              />
            )}

            {/* Display offers only if all-listings has offers but no products */}
            {!loading && !error && !selectedCategory && generalOffers && generalOffers.length > 0 && (!products || products.length === 0) && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Offers</h3>
                <OfferSection categoryId={null} offers={generalOffers} />
              </div>
            )}

            {/* Mixed Grid: Both offers and products for category listings */}
            {!loading && !error && selectedCategory && offers && offers.length > 0 && products && products.length > 0 && (
              <MixedGrid 
                products={products || []}
                offers={offers || []}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                onProductClick={(product) => {
                  const type = product.type || 'product';
                  if (type === 'tool') {
                    navigate(`/software/${product.slug}`);
                  } else if (type === 'job') {
                    navigate(`/job/${product.slug}`);
                  } else if (type === 'offer') {
                    navigate(`/offer/${product._id}`);
                  } else {
                    navigate(`/product/${product.slug}`);
                  }
                }}
              />
            )}

            {/* Display offers only if category has offers but no products */}
            {!loading && !error && selectedCategory && offers && offers.length > 0 && (!products || products.length === 0) && (
              <div className="mb-12">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Available Offers</h3>
                <OfferSection categoryId={selectedCategory?._id || selectedCategory?.id} offers={offers} />
              </div>
            )}

            {/* Display products only (when no offers to mix with) */}
            {!loading && !error && products && products.length > 0 && !((generalOffers && generalOffers.length > 0 && !selectedCategory) || (selectedCategory && offers && offers.length > 0)) && (
              <ProductGrid 
                products={products}
                onProductClick={(product) => {
                  const type = product.type || 'product';
                  if (type === 'tool') {
                    navigate(`/software/${product.slug}`);
                  } else if (type === 'job') {
                    navigate(`/job/${product.slug}`);
                  } else if (type === 'offer') {
                    navigate(`/offer/${product._id}`);
                  } else {
                    navigate(`/product/${product.slug}`);
                  }
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
