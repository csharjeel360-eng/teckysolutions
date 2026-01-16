// components/Home/Home.jsx
import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../../hooks/useBanners';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useBlogs from '../../hooks/useBlogs';
import useSEO from '../../hooks/useSEO';
import Notification from '../../components/Common/Notification';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Button from '../../components/UI/Button';
import { setPageTitle } from '../../utils/slugify';

// Lazy load heavy components
const HeroBanner = lazy(() => import('../../components/Common/HeroBanner'));
const ProductGrid = lazy(() => import('../../components/Products/ProductGrid'));
const CategoryGrid = lazy(() => import('../../components/Categories/CategoryGrid'));
const BlogGrid = lazy(() => import('../../components/Blogs/BlogGrid'));

const Home = () => {
  // SEO Metadata
  const metaTitle = 'TrendyBreeze - Best AI Tools, Software & Tech Resources for Digital Growth';
  const metaDescription = 'Discover curated AI tools, productivity software, SaaS platforms & expert tech blogs. Compare software solutions, read honest reviews & boost your business growth. Trusted by 10,000+ users.';
  const canonicalUrl = window.location.origin;
  
  // Structured data JSON
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

  // Setup SEO
  useSEO({
    title: metaTitle,
    description: metaDescription,
    url: canonicalUrl,
    image: 'https://yourdomain.com/og-image.jpg',
    schema: organizationSchema
  });

  // Local state
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [isMobile, setIsMobile] = useState(false);

  // Memoized banner data
  const topBanners = useMemo(() => getBannersByPosition('home-top'), [getBannersByPosition, banners]);
  const middleBanners = useMemo(() => getBannersByPosition('home-middle'), [getBannersByPosition, banners]);
  const bottomBanners = useMemo(() => getBannersByPosition('home-bottom'), [getBannersByPosition, banners]);

  // Memoized product data - exactly 9 products
  const featuredProducts = useMemo(() => 
    Array.isArray(products) ? products.slice(0, 9) : []
  , [products]);

  // Get popular products for new section
  const popularProducts = useMemo(() => 
    Array.isArray(products) 
      ? [...products]
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 6)
      : []
  , [products]);

  // Memoized category data
  const featuredCategories = useMemo(() => 
    Array.isArray(categories) ? categories.slice(0, 6) : []
  , [categories]);

  // Memoized blog data - exactly 9 blogs
  const featuredBlogs = useMemo(() => 
    Array.isArray(blogs) ? blogs.slice(0, 9) : []
  , [blogs]);

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle errors from hooks
  useEffect(() => {
    // Set SEO title for homepage
    setPageTitle('TrendyBreeze – Best AI Tools, Software & Tech Resources for Digital Growth');
    
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
    autoPlay: !isMobile, // Disable autoplay on mobile for better performance
    showArrows: !isMobile, // Hide arrows on mobile for better UX
    showDots: true,
    interval: 4000,
    className: "h-[350px] md:h-[400px] rounded-3xl shadow-2xl overflow-hidden"
  };

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

      {/* Modern Gradient Hero Banner WITH IMAGES */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-black to-blue-950 text-white">
        {/* Background Images with Overlay */}
        <div className="absolute inset-0">
          {/* AI Tools Image Background */}
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-20">
              <div className="relative w-full h-full">
                {/* AI Dashboard Image */}
                <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent"></div>
              </div>
            </div>
            
            {/* Tech Elements */}
            <div className="absolute top-1/4 left-10 w-32 h-32 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/3 right-20 w-40 h-40 bg-gradient-to-l from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
          </div>
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/70 to-blue-950/50"></div>
        </div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:60px_60px]"></div>
        
        <div className="container relative mx-auto px-4 py-8 sm:py-12 md:py-16 lg:py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div>
              <div className="mb-8">
                <span className="inline-block px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm">
                  ✨ Trusted by 10,000+ Users
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black mb-8 leading-none tracking-tight">
                <span className="block bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Best AI Tools &
                </span>
                <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Software for
                </span>
                <span className="block bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  Business Growth
                </span>
              </h1>
              
              <div className="mb-12">
                <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed font-light">
                  Discover AI-powered software tools designed for productivity, automation, and digital transformation. Curated by experts for entrepreneurs, startups, and businesses.
                </p>
                
                {/* Trust Signals */}
                <div className="flex flex-wrap items-center gap-6 mb-8">
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Expert Reviewed</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Updated Daily</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
                    <span className="text-green-400">✓</span>
                    <span className="text-sm">Free Resources</span>
                  </div>
                </div>
              </div>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button 
                    variant="primary" 
                    size="large"
                    className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl hover:shadow-2xl transition-all duration-300 px-8 py-4 rounded-xl"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl group-hover:scale-110 transition-transform">🚀</span>
                      <span className="font-bold text-lg">Compare AI Tools</span>
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
                      <span className="font-bold text-lg">See Expert Reviews</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>
            
            {/* Right Column - Visual Elements */}
            <div className="relative">
              {/* Floating Dashboard Mockup */}
              <div className="relative max-w-lg mx-auto">
                {/* Main Dashboard Card */}
                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🤖</span>
                    </div>
                    <div>
                      <h3 className="text-white font-bold">AI Tools Dashboard</h3>
                      <p className="text-gray-400 text-sm">Real-time monitoring</p>
                    </div>
                  </div>
                  
                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { label: "Active Tools", value: "142", icon: "📊", color: "from-green-500 to-emerald-500" },
                      { label: "Avg Rating", value: "4.8", icon: "⭐", color: "from-yellow-500 to-orange-500" },
                      { label: "Categories", value: "24", icon: "📁", color: "from-blue-500 to-cyan-500" },
                      { label: "User Growth", value: "+32%", icon: "📈", color: "from-purple-500 to-pink-500" }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-gray-900/50 rounded-xl p-4">
                        <div className={`inline-flex p-2 rounded-lg bg-gradient-to-r ${stat.color} mb-2`}>
                          <span>{stat.icon}</span>
                        </div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-xs text-gray-400">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Tool Logos */}
                  <div className="pt-6 border-t border-white/10">
                    <p className="text-gray-400 text-sm mb-3">Trusted by Industry Leaders:</p>
                    <div className="flex flex-wrap gap-3">
                      {["OpenAI", "Google", "Microsoft", "Notion", "Figma", "Adobe"].map((logo, idx) => (
                        <div key={idx} className="px-3 py-1 bg-white/5 rounded-lg text-sm text-gray-300">
                          {logo}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl backdrop-blur-sm border border-white/10 rotate-12"></div>
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-2xl backdrop-blur-sm border border-white/10 -rotate-12"></div>
              </div>
            </div>
          </div>
          
          {/* Stats Preview */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Software Tools", icon: "🛠️", gradient: "from-blue-500 to-cyan-500" },
              { value: "AI", label: "Powered Solutions", icon: "🤖", gradient: "from-purple-500 to-pink-500" },
              { value: "1000+", label: "Expert Reviews", icon: "📚", gradient: "from-cyan-500 to-blue-500" },
              { value: "10K+", label: "Active Users", icon: "👥", gradient: "from-pink-500 to-purple-500" }
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
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-cyan-300 mt-2 rounded-full animate-bounce"></div>
          </div>
        </div>
        
        {/* Bottom gradient transition */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-50 to-transparent"></div>
      </section>

      {/* New: Popular Tools Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              🔥 <span className="bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">Popular</span> & Trending Tools
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Most viewed and top-rated software solutions our users love
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {popularProducts.slice(0, 3).map((product, index) => (
              <div key={product.id || index} className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200 hover:shadow-2xl hover:border-blue-200 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                      <span className="text-2xl">🛠️</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{product.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="flex items-center gap-1 text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                          ⭐ 4.8
                        </span>
                        <span className="flex items-center gap-1 text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                          🔥 {Math.floor(Math.random() * 20) + 1}K views
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                  {product.description || "AI-powered tool for business automation and growth"}
                </p>
                <Link to={`/products/${product.id}`}>
                  <Button variant="outline" className="w-full border-blue-200 text-blue-600 hover:bg-blue-50">
                    View Details →
                  </Button>
                </Link>
              </div>
            ))}
          </div>
          
          {/* Feature Tags */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {[
              { icon: "🤖", label: "AI Tools", count: "142", color: "bg-purple-100 text-purple-700" },
              { icon: "⚡", label: "Productivity", count: "89", color: "bg-green-100 text-green-700" },
              { icon: "🏢", label: "Business SaaS", count: "67", color: "bg-blue-100 text-blue-700" },
              { icon: "🎨", label: "Design", count: "45", color: "bg-pink-100 text-pink-700" },
              { icon: "📊", label: "Analytics", count: "38", color: "bg-orange-100 text-orange-700" }
            ].map((tag, index) => (
              <Link key={index} to="/categories" className="group">
                <div className={`inline-flex items-center gap-2 px-4 py-3 ${tag.color} rounded-full text-sm font-medium group-hover:shadow-lg transition-all duration-300`}>
                  <span>{tag.icon}</span>
                  <span>{tag.label}</span>
                  <span className="text-xs bg-white/50 px-2 py-0.5 rounded-full">{tag.count}+</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Lazy-loaded Sections */}
      <Suspense fallback={<LoadingSpinner size="medium" />}>
        {/* Categories Section */}
        <section className="py-12 sm:py-16 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Browse Software <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Categories</span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Find tools tailored to your specific business needs and requirements
              </p>
            </div>
            
            {featuredCategories.length > 0 && (
              <CategoryGrid 
                categories={featuredCategories}
                className="grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 sm:gap-6"
                cardClassName="group hover:shadow-2xl hover:scale-[1.02] transition-all duration-300"
              />
            )}
          </div>
        </section>

        {/* Products Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">AI & Software</span> Tools
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover powerful tools to boost productivity, automate workflows, and scale your business effectively
              </p>
            </div>
            
            {featuredProducts.length > 0 && (
              <ProductGrid 
                products={featuredProducts}
                className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                cardClassName="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              />
            )}
          </div>
        </section>

        {/* Lazy-loaded Banners */}
        {topBanners.length > 0 && (
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
        )}

        {/* Lazy-loaded Middle Banner */}
        {middleBanners.length > 0 && (
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
        )}
      </Suspense>

      {/* SEO Content Block - Critical for Google */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Best AI Tools, Software & Tech Resources
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-xl mb-8">
                <strong>TrendyBreeze</strong> helps entrepreneurs, startups, and businesses discover the best AI tools, productivity software, SaaS platforms, and digital growth solutions. Our platform provides comprehensive reviews, comparisons, and insights to help you make informed decisions about technology investments.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left mt-12">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-500">🤖</span> AI Tools & Automation
                  </h3>
                  <p className="text-gray-600">
                    Find AI-powered tools for content creation, data analysis, customer service, marketing automation, and business intelligence.
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-green-500">🏢</span> Business Software
                  </h3>
                  <p className="text-gray-600">
                    Discover SaaS solutions for project management, CRM, accounting, HR, and other essential business operations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section with Schema */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-6">
            {[
              {
                question: "What are the best AI tools for business?",
                answer: "TrendyBreeze curates the best AI tools for businesses including automation software, content creation tools, analytics platforms, and productivity boosters. Our experts test and review each tool to ensure quality and effectiveness."
              },
              {
                question: "Are AI tools suitable for small businesses?",
                answer: "Yes! We specifically curate AI tools that are affordable and effective for small businesses. Many tools offer free tiers or scalable pricing suitable for startups and growing companies."
              },
              {
                question: "How do I choose the right software for my needs?",
                answer: "Use our comparison features, read expert reviews, and check user ratings on TrendyBreeze. We provide detailed breakdowns of features, pricing, and use cases to help you make informed decisions."
              },
              {
                question: "How often is the content updated?",
                answer: "Our team updates the platform daily with new tools, reviews, and tech insights. We monitor industry trends to ensure you have access to the latest information."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center gap-3">
                  <span className="text-blue-500 text-2xl">?</span>
                  {faq.question}
                </h3>
                <p className="text-gray-600 pl-10">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Authority Section */}
      <section className="py-16 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-full shadow-lg mb-8">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white">✍️</span>
              </div>
              <span className="font-semibold text-gray-900">Curated by TrendyBreeze Editors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              Expert-Curated Technology Resources
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Our editorial team consists of industry experts with years of experience in AI tools, software reviews, and digital growth strategies. We test every tool, validate each claim, and provide honest assessments to help you succeed.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-12">
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg">
                <span className="text-2xl">🎯</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Expert Reviews</div>
                  <div className="text-sm text-gray-600">Hands-on testing</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg">
                <span className="text-2xl">📈</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Data-Driven Insights</div>
                  <div className="text-sm text-gray-600">Performance metrics</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-xl shadow-lg">
                <span className="text-2xl">🤝</span>
                <div className="text-left">
                  <div className="font-bold text-gray-900">Unbiased Opinions</div>
                  <div className="text-sm text-gray-600">No sponsored content</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA with Trust Signals */}
      <section className="py-16 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8">
              Join <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">10,000+ Users</span> Growing with TrendyBreeze
            </h2>
            
            {/* Trust Logos */}
            <div className="flex flex-wrap justify-center items-center gap-8 mb-12 opacity-80">
              <div className="text-gray-400 text-xl">Trusted by teams at</div>
              <div className="flex flex-wrap justify-center gap-6">
                {["Startups", "Agencies", "Enterprises", "Freelancers", "Educators"].map((type, idx) => (
                  <div key={idx} className="px-4 py-2 bg-white/5 rounded-lg">{type}</div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center p-6 bg-white/5 rounded-2xl">
                <div className="text-4xl mb-4">🚀</div>
                <h4 className="font-bold text-lg mb-2">Find Best Software</h4>
                <p className="text-gray-400">Compare tools side-by-side</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl">
                <div className="text-4xl mb-4">💡</div>
                <h4 className="font-bold text-lg mb-2">Save Time & Money</h4>
                <p className="text-gray-400">Avoid costly mistakes</p>
              </div>
              <div className="text-center p-6 bg-white/5 rounded-2xl">
                <div className="text-4xl mb-4">📈</div>
                <h4 className="font-bold text-lg mb-2">Grow Your Business</h4>
                <p className="text-gray-400">With proven solutions</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <Link to="/signup">
                <Button 
                  variant="primary" 
                  size="large"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-xl hover:shadow-2xl px-12 py-6 rounded-xl text-lg font-bold"
                >
                  Start Free Account
                </Button>
              </Link>
              <p className="text-gray-400 text-sm">
                No credit card required • Access all features
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;