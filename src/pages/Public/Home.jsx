// components/Home/Home.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../../hooks/useBanners';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useBlogs from '../../hooks/useBlogs';
import HeroBanner from '../../components/Common/HeroBanner';
import FlashSale from '../../components/Common/FlashSale';
import Notification from '../../components/Common/Notification';
import ProductGrid from '../../components/Products/ProductGrid';
import CategoryGrid from '../../components/Categories/CategoryGrid';
import BlogGrid from '../../components/Blogs/BlogGrid';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Button from '../../components/UI/Button';
import { setPageTitle } from '../../utils/slugify';

const Home = () => {
  // Hooks for data fetching
  const { 
    banners, 
    loading: bannersLoading, 
    error: bannersError,
    getBannersByPosition,
    refetch: refetchBanners
  } = useBanners();
  
  const { 
    products, 
    loading: productsLoading, 
    error: productsError
  } = useProducts();
  
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError
  } = useCategories();
  
  const { 
    blogs, 
    loading: blogsLoading, 
    error: blogsError
  } = useBlogs();

  // Local state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [showAllFeatured, setShowAllFeatured] = useState(false);

  // Memoized banner data
  const topBanners = useMemo(() => getBannersByPosition('home-top'), [getBannersByPosition, banners]);
  const middleBanners = useMemo(() => getBannersByPosition('home-middle'), [getBannersByPosition, banners]);
  const bottomBanners = useMemo(() => getBannersByPosition('home-bottom'), [getBannersByPosition, banners]);

  // Memoized product data
  const featuredProducts = useMemo(() => 
    Array.isArray(products) ? products.slice(0, 8) : []
  , [products]);

  const popularProducts = useMemo(() => 
    Array.isArray(products) ? products.slice(0, 12) : []
  , [products]);

  // Show only 4 featured products initially, or all if showAllFeatured is true
  const displayedFeaturedProducts = useMemo(() => 
    showAllFeatured ? featuredProducts : featuredProducts.slice(0, 4)
  , [featuredProducts, showAllFeatured]);

  // Memoized category data
  const featuredCategories = useMemo(() => 
    Array.isArray(categories) ? categories.slice(0, 6) : []
  , [categories]);

  // Memoized blog data
  const popularBlogs = useMemo(() => 
    Array.isArray(blogs) ? blogs.slice(0, 4) : []
  , [blogs]);

  // Handle errors from hooks
  useEffect(() => {
    // Set home page title
    setPageTitle('Home');
    
    const errors = [];
    if (bannersError) errors.push(`Banners: ${bannersError}`);
    if (productsError) errors.push(`Products: ${productsError}`);
    if (categoriesError) errors.push(`Categories: ${categoriesError}`);
    if (blogsError) errors.push(`Blogs: ${blogsError}`);

    if (errors.length > 0) {
      setNotification({
        show: true,
        message: errors.join(' | '),
        type: 'error'
      });
    }
  }, [bannersError, productsError, categoriesError, blogsError]);

  // Flash sale end time (24 hours from now)
  const flashSaleEndTime = useMemo(() => Date.now() + 24 * 60 * 60 * 1000, []);

  // Show loading spinner if any data is still loading
  if (bannersLoading || productsLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-gray-600">Loading amazing deals...</p>
        </div>
      </div>
    );
  }

  const handleRefreshBanners = async () => {
    try {
      await refetchBanners();
      setNotification({
        show: true,
        message: 'Banners refreshed successfully',
        type: 'success'
      });
    } catch (error) {
      setNotification({
        show: true,
        message: 'Failed to refresh banners',
        type: 'error'
      });
    }
  };

  const toggleFeaturedProducts = () => {
    setShowAllFeatured(!showAllFeatured);
  };

  // (Development) banner status removed from UI

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
          duration={5000}
        />
      )}

      {/* Debug Info removed in production build */}

      {/* Hero Banner Section */}
      <section className="relative">
        {topBanners.length > 0 ? (
          <HeroBanner 
            banners={topBanners}
            autoPlay={true}
            interval={5000}
            className="h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] xl:h-[600px]"
          />
        ) : (
          // Fallback hero section when no banners
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-12 sm:py-16 md:py-20 lg:py-24">
            <div className="container mx-auto px-4 text-center">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-3 sm:mb-4">
                Welcome to Our Store
              </h1>
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                Discover amazing products at unbeatable prices. Shop the latest trends with free shipping.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Link to="/products">
                  <Button variant="primary" size="large" className="w-full sm:w-auto">
                    Shop Now
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="large" className="w-full sm:w-auto text-white border-white hover:bg-white hover:text-blue-600 transition-colors">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Flash Sale Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-gradient-to-r from-red-500 to-orange-500 text-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Flash Sale</h2>
            <p className="text-sm sm:text-base md:text-lg opacity-90">Limited time offers - Don't miss out!</p>
          </div>
          <FlashSale 
            products={featuredProducts}
            endTime={flashSaleEndTime}
          />
          <div className="text-center mt-6 sm:mt-8">
            <Link to="/products?sort=discount">
              <Button variant="outline" size="large" className="text-white border-white hover:bg-white hover:text-orange-500 transition-colors w-full sm:w-auto">
                View All Deals
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Shop by Category
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              Explore our wide range of product categories.
            </p>
          </div>
          
          {featuredCategories.length > 0 ? (
            <>
              <CategoryGrid 
                categories={featuredCategories}
                className="grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4"
              />
              <div className="text-center mt-6 sm:mt-8">
                <Link to="/categories">
                  <Button variant="primary" size="large" className="w-full sm:w-auto">
                    View All Categories
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📁</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Categories Available</h3>
              <p className="text-gray-500 text-sm sm:text-base">Categories will be available soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Middle Banner */}
      {middleBanners.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <HeroBanner 
              banners={middleBanners}
              autoPlay={false}
              showArrows={false}
              showDots={true}
              className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[350px] xl:h-[400px] rounded-lg overflow-hidden"
            />
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Featured Products
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Handpicked items just for you</p>
          </div>
          
          {displayedFeaturedProducts.length > 0 ? (
            <>
              <ProductGrid 
                products={displayedFeaturedProducts}
                className="grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
              />
              <div className="text-center mt-6 sm:mt-8">
                {featuredProducts.length > 4 && (
                  <Button 
                    variant="primary" 
                    size="large"
                    onClick={toggleFeaturedProducts}
                    className="w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4"
                  >
                    {showAllFeatured ? 'Show Less' : 'Show More'}
                  </Button>
                )}
                <Link to="/products">
                  <Button variant="outline" size="large" className="w-full sm:w-auto">
                    View All Products
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📦</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Products Available</h3>
              <p className="text-gray-500 text-sm sm:text-base mb-4">Check back soon for amazing products.</p>
              <Link to="/products">
                <Button variant="primary" className="w-full sm:w-auto">
                  Browse Products
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular Products Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-white">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              Popular Right Now
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Trending products everyone's buying</p>
          </div>
          
          {popularProducts.length > 0 ? (
            <ProductGrid 
              products={popularProducts}
              className="grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4"
            />
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-sm sm:text-base">No popular products at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Banner */}
      {bottomBanners.length > 0 && (
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-3 sm:px-4">
            <HeroBanner 
              banners={bottomBanners}
              autoPlay={false}
              showArrows={false}
              className="h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px] rounded-lg overflow-hidden"
            />
          </div>
        </section>
      )}

      {/* Blog Section */}
      <section className="py-12 sm:py-14 md:py-16 bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
              From Our Blog
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600">Latest news, tips, and shopping guides</p>
          </div>
          
          {popularBlogs.length > 0 ? (
            <>
              <BlogGrid 
                blogs={popularBlogs}
                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              />
              <div className="text-center mt-6 sm:mt-8">
                <Link to="/blogs">
                  <Button variant="primary" size="large" className="w-full sm:w-auto">
                    Read Our Blog
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-8 sm:py-12">
              <div className="text-gray-400 text-4xl sm:text-6xl mb-3 sm:mb-4">📝</div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">No Blog Posts Yet</h3>
              <p className="text-gray-500 text-sm sm:text-base">Stay tuned for exciting content coming soon.</p>
            </div>
          )}
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="py-8 sm:py-10 md:py-12 bg-white border-t border-gray-200">
        <div className="container mx-auto px-3 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 text-center">
            <div className="flex flex-col items-center p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-green-600 text-lg sm:text-xl">🚚</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Free Shipping</h3>
              <p className="text-xs sm:text-sm text-gray-600">On orders over $50</p>
            </div>
            
            <div className="flex flex-col items-center p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-blue-600 text-lg sm:text-xl">↩️</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Easy Returns</h3>
              <p className="text-xs sm:text-sm text-gray-600">30-day return policy</p>
            </div>
            
            <div className="flex flex-col items-center p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-purple-600 text-lg sm:text-xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">Secure Payment</h3>
              <p className="text-xs sm:text-sm text-gray-600">100% secure checkout</p>
            </div>
            
            <div className="flex flex-col items-center p-3 sm:p-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <span className="text-orange-600 text-lg sm:text-xl">📞</span>
              </div>
              <h3 className="font-semibold text-gray-900 text-sm sm:text-base mb-1">24/7 Support</h3>
              <p className="text-xs sm:text-sm text-gray-600">Dedicated support</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;