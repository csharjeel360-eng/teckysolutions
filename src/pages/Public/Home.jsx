 // components/Home/Home.jsx
import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../../hooks/useBanners';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useSEO from '../../hooks/useSEO';
import Notification from '../../components/Common/Notification';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Button from '../../components/UI/Button';
import { setPageTitle } from '../../utils/slugify';

// Lazy load heavy components
const HeroBanner = lazy(() => import('../../components/Common/HeroBanner'));
const ProductGrid = lazy(() => import('../../components/Products/ProductGrid'));
const CategoryGrid = lazy(() => import('../../components/Categories/CategoryGrid'));

const Home = () => {
  // SEO Metadata (unchanged, but optimized for sales/content focus)
  const metaTitle = 'TrendyBreeze - Best AI Tools, Software & Tech Resources for Digital Growth';
  const metaDescription = 'Discover curated AI tools, productivity software, SaaS platforms & expert tech blogs. Compare software solutions, read honest reviews & boost your business growth. Trusted by 10,000+ users.';
  const canonicalUrl = window.location.origin;
  
  // Structured data JSON (enhanced for software sales and articles)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TrendyBreeze",
    "url": canonicalUrl,
    "logo": "https://yourdomain.com/logo.png",
    "description": "Curated AI tools, software reviews, and tech resources for digital growth",
    "sameAs": [
      "https://twitter.com/trendybreeze",
      "https://linkedin.com/company/trendybreeze",
      "https://facebook.com/trendybreeze"
    ]
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What are the best AI tools for business?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "TrendyBreeze curates the best AI tools for businesses including automation software, content creation tools, analytics platforms, and productivity boosters. Our experts test and review each tool to ensure quality."
        }
      },
      {
        "@type": "Question",
        "name": "Are AI tools suitable for small businesses?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! We specifically curate AI tools that are affordable and effective for small businesses. Many tools offer free tiers or scalable pricing suitable for startups and growing companies."
        }
      },
      {
        "@type": "Question",
        "name": "How do I choose the right software for my needs?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Use our comparison features, read expert reviews, and check user ratings on TrendyBreeze. We provide detailed breakdowns of features, pricing, and use cases to help you make informed decisions."
        }
      }
    ]
  };

  // Hooks for data fetching (unchanged)
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

  // Setup SEO (unchanged)
  useSEO({
    title: metaTitle,
    description: metaDescription,
    url: canonicalUrl,
    image: 'https://yourdomain.com/og-image.jpg',
    schema: organizationSchema
  });

  // Local state (unchanged)
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isMobile, setIsMobile] = useState(false);
  
  // Combined loading state for better UX
  // Only show loading spinner if critical data is loading (exclude blogs if not displayed)
  const isPageLoading = bannersLoading || productsLoading || categoriesLoading;
  const allDataLoaded = !bannersLoading && !productsLoading && !categoriesLoading;

  // Memoized data (unchanged)
  const topBanners = useMemo(() => getBannersByPosition('home-top'), [getBannersByPosition, banners]);
  const middleBanners = useMemo(() => getBannersByPosition('home-middle'), [getBannersByPosition, banners]);
  const bottomBanners = useMemo(() => getBannersByPosition('home-bottom'), [getBannersByPosition, banners]);
  const featuredProducts = useMemo(() => 
    Array.isArray(products) ? products.slice(0, 9) : []
  , [products]);
  const popularProducts = useMemo(() => 
    Array.isArray(products) 
      ? [...products]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 6)
      : []
  , [products]);
  const featuredCategories = useMemo(() => 
    Array.isArray(categories) ? categories.slice(0, 6) : []
  , [categories]);

  // Effects (unchanged)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setPageTitle('TrendyBreeze – Best AI Tools, Software & Tech Resources for Digital Growth');
    
    const errors = [];
    if (bannersError) errors.push(`Banners: ${bannersError}`);
    if (productsError) errors.push(`Products: ${productsError}`);
    if (categoriesError) errors.push(`Categories: ${categoriesError}`);

    if (errors.length > 0) {
      setNotification({
        show: true,
        message: errors.join(' | '),
        type: 'error'
      });
    }
  }, [bannersError, productsError, categoriesError]);

  // Loading and error handling (unchanged)
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <LoadingSpinner size="large" showBrand={true} brandText="TrendyBreeze" />
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

  // Common banner props (unchanged)
  const commonBannerProps = {
    autoPlay: !isMobile,
    showArrows: !isMobile,
    showDots: true,
    interval: 4000,
    className: "h-[350px] md:h-[400px] rounded-3xl shadow-2xl overflow-hidden"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification (unchanged) */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
          duration={5000}
        />
      )}

      {/* Restructured Hero Section: More Professional and Visually Appealing */}
      {/* Changes: Cleaner layout, better spacing, enhanced animations, stronger CTAs for sales/articles */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white min-h-screen flex items-center">
        {/* Background Enhancements: Added more dynamic elements for visual appeal */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1),transparent_50%)]"></div>
          <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-20 w-40 h-40 bg-gradient-to-l from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>
        
        {/* Grid Pattern (unchanged but more subtle) */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:80px_80px]"></div>
        
        <div className="container relative mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: Enhanced Text Content with Better Hierarchy */}
            <div className="space-y-8">
              {/* Trust Badge: More Prominent */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-full border border-white/20">
                <span className="text-2xl">⭐</span>
                <span className="font-semibold">Trusted by 10,000+ Professionals</span>
              </div>
              
              {/* Headline: Improved Typography and Animation */}
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="block bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-transparent animate-fade-in">
                  Sell & Discover
                </span>
                <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-transparent animate-fade-in delay-200">
                  Top AI Tools
                </span>
                <span className="block text-white animate-fade-in delay-400">
                  for Business Growth
                </span>
              </h1>
              
              {/* Description: More Compelling for Sales/Content */}
              <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                Buy premium AI software, read expert articles on tools & services, and accelerate your digital transformation with TrendyBreeze's curated marketplace.
              </p>
              
              {/* Trust Signals: Expanded for Credibility */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Expert Reviews & Articles</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Secure Software Purchases</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                  <span className="text-green-400">✓</span>
                  <span className="text-sm">Daily Tool Updates</span>
                </div>
              </div>
              
              {/* CTAs: Redesigned for Better Conversion */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link to="/listings">
                  <Button 
                    variant="primary" 
                    size="large"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 px-8 py-4 rounded-2xl transform hover:scale-105"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl group-hover:rotate-12 transition-transform">🛒</span>
                      <span className="font-bold text-lg">Shop AI Tools Now</span>
                    </span>
                  </Button>
                </Link>
                
                <Link to="/blogs">
                  <Button 
                    variant="outline" 
                    size="large"
                    className="border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300 px-8 py-4 rounded-2xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">📖</span>
                      <span className="font-bold text-lg">Explore Articles</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Column: Enhanced Dashboard Mockup */}
            <div className="relative">
              <div className="relative max-w-lg mx-auto transform hover:scale-105 transition-transform duration-500">
                {/* Main Card: More Interactive and Professional */}
                <div className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-lg rounded-3xl p-8 border border-white/10 shadow-2xl hover:shadow-blue-500/20 transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-xl">AI Tools Marketplace</h3>
                      <p className="text-gray-400 text-sm">Buy, Compare & Grow</p>
                    </div>
                  </div>
                  
                  {/* Stats: Updated for Sales Focus */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: "Tools Sold", value: "500+", icon: "🛒", color: "from-green-500 to-emerald-500" },
                      { label: "Articles Read", value: "10K+", icon: "📖", color: "from-yellow-500 to-orange-500" },
                      { label: "Categories", value: "24", icon: "📁", color: "from-blue-500 to-cyan-500" },
                      { label: "Happy Buyers", value: "98%", icon: "😊", color: "from-purple-500 to-pink-500" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-gray-900/50 rounded-2xl p-4 hover:bg-gray-800/50 transition-colors">
                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2 shadow-lg`}>
                          <span>{stat.icon}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Logos: Professional Branding */}
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-gray-400 text-sm mb-3">Featured in Articles & Trusted by:</p>
                    <div className="flex flex-wrap gap-3">
                      {["Shopify", "Stripe", "OpenAI", "Notion", "Figma", "Adobe"].map((logo, idx) => (
                        <div key={idx} className="px-4 py-2 bg-white/5 rounded-lg text-sm text-gray-300 hover:bg-white/10 transition-colors">
                          {logo}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements: More Dynamic */}
                <div className="absolute -top-8 -right-8 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl backdrop-blur-sm border border-white/10 animate-bounce"></div>
                <div className="absolute -bottom-8 -left-8 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-3xl backdrop-blur-sm border border-white/10 animate-pulse"></div>
              </div>
            </div>
          </div>
          
                     {/* Stats Section: Moved Below for Better Flow */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { value: "500+", label: "Tools Available", icon: "🛠️", gradient: "from-blue-500 to-cyan-500" },
              { value: "AI", label: "Powered Marketplace", icon: "🤖", gradient: "from-purple-500 to-pink-500" },
              { value: "1000+", label: "Expert Articles", icon: "📚", gradient: "from-cyan-500 to-blue-500" },
              { value: "10K+", label: "Satisfied Customers", icon: "👥", gradient: "from-pink-500 to-purple-500" }
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.gradient} mb-3 shadow-lg`}>
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
        
        {/* Scroll Indicator: Enhanced */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-cyan-300 mt-2 rounded-full"></div>
          </div>
        </div>
        
        {/* Bottom Transition: Smoother */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* Popular Tools Section: Enhanced for Sales Focus */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              🔥 <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Trending</span> Tools & Services
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover top-selling software, read reviews, and buy with confidence
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {popularProducts.slice(0, 3).map((product, index) => (
              <div key={product.id || index} className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 border border-gray-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300 hover:-translate-y-2">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-3xl">🛠️</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-medium">
                          ⭐ 4.8 Rating
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                          🔥 {Math.floor(Math.random() * 20) + 1}K Sales
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-base mb-8 line-clamp-3">
                  {product.description || "Premium AI tool for automation, productivity, and business growth. Buy now and read expert reviews."}
                </p>
                <div className="flex gap-3">
                  <Link to="/blogs" className="flex-1">
                    <Button variant="primary" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-semibold">
                      Buy Now
                    </Button>
                  </Link>
                  <Link to="/blogs">
                    <Button variant="outline" className="px-6 py-3 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold">
                      Read Review
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Category Tags: More Interactive */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[
              { icon: "🤖", label: "AI Tools", count: "142", color: "bg-purple-100 text-purple-700 hover:bg-purple-200" },
              { icon: "⚡", label: "Productivity", count: "89", color: "bg-green-100 text-green-700 hover:bg-green-200" },
              { icon: "🏢", label: "Business SaaS", count: "67", color: "bg-blue-100 text-blue-700 hover:bg-blue-200" },
              { icon: "🎨", label: "Design Tools", count: "45", color: "bg-pink-100 text-pink-700 hover:bg-pink-200" },
              { icon: "📊", label: "Analytics", count: "38", color: "bg-orange-100 text-orange-700 hover:bg-orange-200" }
            ].map((tag, index) => (
              <Link key={index} to="/categories" className="group transition-all duration-300">
                <div className={`inline-flex items-center gap-3 px-6 py-4 ${tag.color} rounded-2xl text-sm font-semibold shadow-lg hover:shadow-xl hover:scale-105`}>
                  <span className="text-xl">{tag.icon}</span>
                  <span>{tag.label}</span>
                  <span className="text-xs bg-white/60 px-2 py-1 rounded-full">{tag.count}+</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section: Streamlined */}
      <section className="py-16 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Shop by <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the perfect software for your needs across our curated categories
            </p>
          </div>
          
          {featuredCategories.length > 0 && (
            <CategoryGrid 
              categories={featuredCategories}
              className="grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6"
              cardClassName="group hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
            />
          )}
        </div>
      </section>

      {/* Products Section: Focused on Sales */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Top <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Selling</span> AI Tools
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Browse our best-selling software, read detailed reviews, and purchase with ease
            </p>
          </div>
          
          {featuredProducts.length > 0 && (
            <ProductGrid 
              products={featuredProducts}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              cardClassName="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 rounded-3xl"
            />
          )}
        </div>
      </section>

      {/* Lazy-loaded Banners: Unchanged but Integrated */}
      <Suspense fallback={<LoadingSpinner size="medium" />}>
        {topBanners.length > 0 && (
          <section className="py-12 sm:py-16 bg-gradient-to-r from-gray-50 to-white">
            <div className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <HeroBanner 
                  banners={topBanners}
                  {...commonBannerProps}
                />
              </div>
            </div>
          </section>
        )}

        {middleBanners.length > 0 && (
          <section className="py-12 sm:py-16 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <HeroBanner 
                  banners={middleBanners}
                  {...commonBannerProps}
                />
              </div>
            </div>
          </section>
        )}
      </Suspense>

      {/* SEO Content Block: Enhanced for Articles/Sales */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
              Buy Software & Read Expert Articles
            </h2>
            <div className="prose prose-xl mx-auto text-gray-600 mb-12">
              <p className="text-2xl mb-8">
                <strong>TrendyBreeze</strong> is your go-to marketplace for premium AI tools, software solutions, and in-depth articles on digital services. Compare prices, read unbiased reviews, and make informed purchases to accelerate your business.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-16">
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-blue-500 text-3xl">🛒</span> Software Marketplace
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Securely buy AI tools, SaaS platforms, and productivity software. Our marketplace features verified sellers and competitive pricing.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                    <span className="text-green-500 text-3xl">📝</span> Expert Articles & Guides
                  </h3>
                  <p className="text-gray-600 text-lg">
                    Dive into comprehensive articles on tools, services, and tech trends. Written by industry experts to help you choose the right solutions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section: Expanded for Sales/Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-900 mb-16">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                question: "How do I buy software on TrendyBreeze?",
                answer: "Browse our marketplace, compare tools, read reviews, and purchase securely. We offer multiple payment options and buyer protection."
              },
              {
                question: "Are your articles free to read?",
                answer: "Yes! All expert articles on tools, services, and software are free. Sign up for premium content and early access to new reviews."
              },
              {
                question: "What are the best AI tools for business?",
                answer: "Our curated selection includes top AI tools for automation, analytics, and productivity. Read our articles for detailed comparisons."
              },
              {
                question: "How often do you update tool reviews?",
                answer: "We update reviews and articles daily with the latest software releases, pricing changes, and user feedback."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-3xl p-8 hover:shadow-xl transition-shadow duration-300">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-4">
                  <span className="text-blue-500 text-3xl">?</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 text-lg pl-12">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Authority: Enhanced */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-white rounded-2xl shadow-xl mb-12">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">✍️</span>
              </div>
              <span className="font-bold text-gray-900 text-xl">Curated by TrendyBreeze Experts</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-8">
              Trusted Reviews & Articles for Smart Purchases
            </h2>
            <p className="text-2xl text-gray-600 mb-12 max-w-4xl mx-auto">
              Our team of tech experts tests every tool, writes detailed articles, and ensures you get honest insights for better buying decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <div className="flex items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-xl">
                <span className="text-3xl">🎯</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">In-Depth Reviews</div>
                  <div className="text-sm text-gray-600">Hands-on testing before you buy</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-xl">
                <span className="text-3xl">📈</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">Data-Driven Articles</div>
                  <div className="text-sm text-gray-600">Performance metrics & comparisons</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white px-8 py-6 rounded-2xl shadow-xl">
                <span className="text-3xl">🤝</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900 text-lg">Buyer-First Approach</div>
                  <div className="text-sm text-gray-600">No sponsored content, just facts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA: Optimized for Conversions */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              Ready to <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Buy & Learn</span>?
            </h2>
            
            <div className="flex flex-wrap justify-center items-center gap-8 mb-16 opacity-80">
              <div className="text-xl">Join 10,000+ buyers and readers at</div>
              <div className="flex flex-wrap justify-center gap-6">
                {["Startups", "Agencies", "Enterprises", "Freelancers", "Educators"].map((type, idx) => (
                  <div key={idx} className="px-6 py-3 bg-white/5 rounded-xl text-lg">{type}</div>
                ))}
              </div>
            </div>
            
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              <div className="text-center p-8 bg-white/5 rounded-3xl hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl mb-4">🛒</div>
                <h4 className="font-bold text-xl mb-2">Shop Premium Tools</h4>
                <p className="text-gray-400">Secure purchases with reviews</p>
              </div>
              <div className="text-center p-8 bg-white/5 rounded-3xl hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl mb-4">📖</div>
                <h4 className="font-bold text-xl mb-2">Read Expert Articles</h4>
                <p className="text-gray-400">Free guides & comparisons</p>
              </div>
              <div className="text-center p-8 bg-white/5 rounded-3xl hover:bg-white/10 transition-all duration-300">
                <div className="text-5xl mb-4">🚀</div>
                <h4 className="font-bold text-xl mb-2">Grow Your Business</h4>
                <p className="text-gray-400">With proven AI solutions</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <Link to="/signup">
                <Button 
                  variant="primary" 
                  size="large"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-2xl hover:shadow-cyan-500/25 px-12 py-6 rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-300"
                >
                  Start Shopping & Reading Today
                </Button>
              </Link>
              <p className="text-gray-400 text-lg">
                Free account • No credit card required • Instant access
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;