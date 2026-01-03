// components/Home/Home.jsx
import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../../hooks/useBanners';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useBlogs from '../../hooks/useBlogs';
import HeroBanner from '../../components/Common/HeroBanner';
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

  // Memoized banner data
  const topBanners = useMemo(() => getBannersByPosition('home-top'), [getBannersByPosition, banners]);
  const middleBanners = useMemo(() => getBannersByPosition('home-middle'), [getBannersByPosition, banners]);
  const bottomBanners = useMemo(() => getBannersByPosition('home-bottom'), [getBannersByPosition, banners]);

  // Memoized product data - exactly 9 products
  const featuredProducts = useMemo(() => 
    Array.isArray(products) ? products.slice(0, 9) : []
  , [products]);

  // Memoized category data
  const featuredCategories = useMemo(() => 
    Array.isArray(categories) ? categories.slice(0, 6) : []
  , [categories]);

  // Memoized blog data - exactly 9 blogs
  const featuredBlogs = useMemo(() => 
    Array.isArray(blogs) ? blogs.slice(0, 9) : []
  , [blogs]);

  // Handle errors from hooks
  useEffect(() => {
    // Set SEO title for homepage
    setPageTitle('TrendyBreeze – Smart Software, AI Tools & Tech Blogs for Digital Growth');
    
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

  // Common banner style props
  const commonBannerProps = {
    autoPlay: true,
    showArrows: true,
    showDots: true,
    interval: 4000,
    className: "h-[350px] md:h-[400px] rounded-3xl shadow-2xl overflow-hidden"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta Description should be added in your main HTML head via helmet or similar */}
      
      {/* Notification */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
          duration={5000}
        />
      )}

      {/* Modern Gradient Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-l from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        <div className="container relative mx-auto px-4 py-20 sm:py-24 md:py-32 lg:py-40">
          <div className="max-w-4xl mx-auto text-center">
            {/* Modern Typography with Gradient */}
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                ✨ Your Digital Growth Partner
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-none tracking-tight">
              <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Smart Software
              </span>
              <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                AI Tools &
              </span>
              <span className="block bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Tech Insights
              </span>
            </h1>
            
            {/* Hero Section Content */}
            <div className="mb-12 max-w-3xl mx-auto">
              <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed font-light">
                At <span className="font-bold text-white">TrendyBreeze</span>, we bring you the latest software solutions, AI-powered tools, and high-value tech blogs designed to help businesses, creators, and professionals grow faster in the digital world.
              </p>
              
              <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-2xl">🚀</span>
                </div>
                <div className="text-left">
                  <p className="text-lg font-bold text-white">Explore. Compare. Grow Smarter.</p>
                  <p className="text-sm text-gray-300">Join thousands of successful users</p>
                </div>
              </div>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/products">
                <Button 
                  variant="primary" 
                  size="large"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 rounded-xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                    <span className="font-bold text-lg">Browse Software Tools</span>
                  </span>
                </Button>
              </Link>
              
              <Link to="/blogs">
                <Button 
                  variant="outline" 
                  size="large"
                  className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 px-8 py-4 rounded-xl"
                >
                  <span className="flex items-center gap-3">
                    <span className="text-2xl">📘</span>
                    <span className="font-bold text-lg">Read Expert Blogs</span>
                  </span>
                </Button>
              </Link>
            </div>
            
            {/* Stats Preview */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
              {[
                { value: "100+", label: "Software Tools", icon: "🛠️", gradient: "from-blue-500 to-cyan-500" },
                { value: "AI", label: "Powered Solutions", icon: "🤖", gradient: "from-purple-500 to-pink-500" },
                { value: "50+", label: "Expert Guides", icon: "📚", gradient: "from-cyan-500 to-blue-500" },
                { value: "SEO", label: "Optimized Content", icon: "🔍", gradient: "from-pink-500 to-purple-500" }
              ].map((stat, index) => (
                <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-cyan-300 mt-2 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Modern Top Banner Section - Updated to match middle banner structure */}
      {topBanners.length > 0 ? (
        <section className="py-8 sm:py-12 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <HeroBanner 
                banners={topBanners}
                {...commonBannerProps}
              />
            </div>
          </div>
        </section>
      ) : (
        // Modern Placeholder Banner - Updated structure
        <section className="py-8 sm:py-12 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[350px] md:h-[400px] flex items-center">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                </div>
                <div className="relative px-8 md:px-16 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold mb-6">
                      ✨ Trending Now
                    </span>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Discover <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Innovation</span>
                    </h3>
                    <p className="text-xl text-gray-300 mb-6">
                      Explore the latest technology trends and insights
                    </p>
                    <Button 
                      variant="primary" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 shadow-lg"
                    >
                      Learn More
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="absolute -ins-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="text-6xl mb-4">🚀</div>
                        <p className="text-white text-lg font-semibold">Featured Content</p>
                        <p className="text-gray-300">Latest updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 text-sm font-semibold rounded-full">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Browse Collections
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Find Your Perfect <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Tools</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated categories and discover tools tailored to your specific needs
            </p>
          </div>
          
          {featuredCategories.length > 0 ? (
            <>
              <CategoryGrid 
                categories={featuredCategories}
                className="grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6"
                cardClassName="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              />
              <div className="text-center mt-10 sm:mt-12">
                <Link to="/categories">
                  <Button 
                    variant="primary" 
                    size="large" 
                    className="bg-gradient-to-r from-gray-900 to-black hover:from-black hover:to-gray-900 text-white border-0 shadow-lg hover:shadow-xl px-8 py-4 rounded-xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-xl">🔍</span>
                      <span className="font-bold">Explore All Categories</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gradient-to-b from-white to-gray-50 rounded-3xl">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center">
                  <span className="text-4xl">📁</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">+</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Curating Amazing Categories</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">We're organizing the best tools into easy-to-browse collections</p>
              <Button 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:border-gray-400"
                onClick={handleRefreshBanners}
              >
                Check for Updates
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-block mb-4">
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-600 text-sm font-semibold rounded-full">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Featured Collection
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Top <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Software & AI</span> Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover powerful tools to boost productivity, automate workflows, and scale your business
            </p>
          </div>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12 max-w-4xl mx-auto">
            {[
              { icon: "🤖", label: "AI Tools", color: "bg-purple-100 text-purple-700" },
              { icon: "🖼️", label: "Image Tools", color: "bg-blue-100 text-blue-700" },
              { icon: "⚡", label: "Productivity", color: "bg-cyan-100 text-cyan-700" },
              { icon: "🏢", label: "Business SaaS", color: "bg-emerald-100 text-emerald-700" },
              { icon: "🔒", label: "Security", color: "bg-red-100 text-red-700" },
              { icon: "📊", label: "Analytics", color: "bg-orange-100 text-orange-700" }
            ].map((tag, index) => (
              <span key={index} className={`inline-flex items-center gap-2 px-4 py-2 ${tag.color} rounded-full text-sm font-medium`}>
                <span>{tag.icon}</span>
                {tag.label}
              </span>
            ))}
          </div>
          
          {featuredProducts.length > 0 ? (
            <>
              <ProductGrid 
                products={featuredProducts}
                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                cardClassName="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              />
              <div className="text-center mt-12">
                <Link to="/products">
                  <Button 
                    variant="primary" 
                    size="large" 
                    className="group bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 shadow-xl hover:shadow-2xl px-10 py-5 rounded-xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl group-hover:rotate-12 transition-transform">🚀</span>
                      <span className="font-bold text-lg">Explore All Software Tools</span>
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl shadow-lg border border-gray-100">
              <div className="relative inline-block mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl flex items-center justify-center animate-pulse">
                  <span className="text-4xl">📦</span>
                </div>
                <div className="absolute -inset-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">Loading Amazing Tools</h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">We're curating the best software solutions for you</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button variant="primary" className="bg-gradient-to-r from-green-600 to-emerald-600">
                    Browse All Tools
                  </Button>
                </Link>
                <Button variant="outline" className="border-gray-300">
                  Notify Me
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Modern Middle Banner */}
      {middleBanners.length > 0 ? (
        <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <HeroBanner 
                banners={middleBanners}
                {...commonBannerProps}
              />
            </div>
          </div>
        </section>
      ) : (
        // Modern Promotional Banner Placeholder
        <section className="py-8 sm:py-12 bg-gradient-to-r from-blue-50 to-cyan-50">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[350px] md:h-[400px] flex items-center">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                </div>
                <div className="relative px-8 md:px-16 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold mb-6">
                      ✨ Featured Content
                    </span>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Discover <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Innovation</span>
                    </h3>
                    <p className="text-xl text-gray-300 mb-6">
                      Explore the latest technology trends and insights
                    </p>
                    <Button 
                      variant="primary" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 shadow-lg"
                    >
                      Learn More
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="absolute -ins-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="text-6xl mb-4">🎯</div>
                        <p className="text-white text-lg font-semibold">Featured Content</p>
                        <p className="text-gray-300">Latest updates</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Rest of the sections remain similar but with improved styling */}
      
      {/* Why Choose TrendyBreeze Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">TrendyBreeze</span>?
            </h2>
          </div>
          
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
            {[
              { 
                icon: "🚀", 
                title: "Premium Quality Tools", 
                desc: "Carefully curated software solutions",
                gradient: "from-purple-500 to-pink-500",
                bg: "bg-gradient-to-br from-purple-50 to-pink-50"
              },
              { 
                icon: "📈", 
                title: "SEO Optimized Content", 
                desc: "Rank higher with our expert guides",
                gradient: "from-blue-500 to-cyan-500",
                bg: "bg-gradient-to-br from-blue-50 to-cyan-50"
              },
              { 
                icon: "🔍", 
                title: "Honest Reviews", 
                desc: "Unbiased comparisons & ratings",
                gradient: "from-green-500 to-emerald-500",
                bg: "bg-gradient-to-br from-green-50 to-emerald-50"
              },
              { 
                icon: "💡", 
                title: "Regular Updates", 
                desc: "Fresh content & latest tools",
                gradient: "from-orange-500 to-red-500",
                bg: "bg-gradient-to-br from-orange-50 to-red-50"
              },
              { 
                icon: "🌐", 
                title: "User-Friendly Platform", 
                desc: "Easy navigation & fast loading",
                gradient: "from-indigo-500 to-purple-500",
                bg: "bg-gradient-to-br from-indigo-50 to-purple-50"
              },
              { 
                icon: "✅", 
                title: "Trusted Community", 
                desc: "Join thousands of satisfied users",
                gradient: "from-gray-900 to-black",
                bg: "bg-gradient-to-br from-gray-50 to-black/5"
              }
            ].map((item, index) => (
              <div key={index} className={`${item.bg} p-8 rounded-2xl border border-gray-200 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300`}>
                <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${item.gradient} mb-6`}>
                  <span className="text-2xl text-white">{item.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
          
          {/* CTA Card */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white p-12 rounded-3xl max-w-4xl mx-auto border border-gray-800 shadow-2xl">
            <div className="text-center">
              <div className="inline-block mb-6">
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white text-sm font-semibold rounded-full backdrop-blur-sm">
                  <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  Ready to Grow?
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-bold mb-6">
                Start Your Digital <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Journey</span> Today
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                Join thousands of users who trust TrendyBreeze for discovering the best software, AI tools, and technology content.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/products">
                  <Button 
                    variant="primary" 
                    size="large"
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 shadow-lg"
                  >
                    <span className="flex items-center gap-3">
                      <span>🚀</span>
                      <span>Browse Tools</span>
                    </span>
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button 
                    variant="outline" 
                    size="large"
                    className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-3">
                      <span>✨</span>
                      <span>Join Free</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modern Bottom Banner - Updated to match middle banner structure */}
      {bottomBanners.length > 0 ? (
        <section className="py-8 sm:py-12 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <HeroBanner 
                banners={bottomBanners}
                {...commonBannerProps}
              />
            </div>
          </div>
        </section>
      ) : (
        // Bottom Banner Placeholder - Updated structure
        <section className="py-8 sm:py-12 bg-gradient-to-r from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 rounded-3xl overflow-hidden shadow-2xl">
              <div className="relative h-[350px] md:h-[400px] flex items-center">
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl"></div>
                </div>
                <div className="relative px-8 md:px-16 grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full text-sm font-semibold mb-6">
                      ✨ Stay Updated
                    </span>
                    <h3 className="text-4xl md:text-5xl font-bold text-white mb-4">
                      Latest <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Insights</span>
                    </h3>
                    <p className="text-xl text-gray-300 mb-6">
                      Get the most recent technology news and updates
                    </p>
                    <Button 
                      variant="primary" 
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 border-0 shadow-lg"
                    >
                      Explore More
                    </Button>
                  </div>
                  <div className="hidden md:block">
                    <div className="relative">
                      <div className="absolute -ins-8 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-2xl"></div>
                      <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                        <div className="text-6xl mb-4">📰</div>
                        <p className="text-white text-lg font-semibold">Latest News</p>
                        <p className="text-gray-300">Stay informed</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Final Trust Section */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Trusted by <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Digital Professionals</span>
            </h2>
          </div>
          
          {/* Final CTA */}
          <div className="text-center mt-12 pt-8 border-t border-white/10">
            <p className="text-2xl font-semibold mb-6">Ready to Transform Your Digital Experience?</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button 
                  variant="primary" 
                  size="large"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl hover:shadow-2xl px-10 py-5 rounded-xl"
                >
                  Join TrendyBreeze Today
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;