 // components/Home/Home.jsx
import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Link } from 'react-router-dom';
import useBanners from '../../hooks/useBanners';
import useProducts from '../../hooks/useProducts';
import useCategories from '../../hooks/useCategories';
import useSEO from '../../hooks/useSEO';
import productService from '../../services/productService';
import { offersAPI, blogsAPI } from '../../services/api';
import Notification from '../../components/Common/Notification';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Button from '../../components/UI/Button';
import { setPageTitle } from '../../utils/slugify';
import servicesData from '../../data/servicesData';

// Global cache for home page blogs to prevent re-fetching
const homePageBlogsCache = { data: null, timestamp: 0 };
const HOME_BLOGS_CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Lazy load heavy components
const HeroBanner = lazy(() => import('../../components/Common/HeroBanner'));
const ProductGrid = lazy(() => import('../../components/Products/ProductGrid'));
const CategoryGridFullImage = lazy(() => import('../../components/Categories/CategoryGridFullImage'));
const OfferSection = lazy(() => import('../../components/Products/OfferSection'));
const BlogGrid = lazy(() => import('../../components/Blogs/BlogGrid'));

const Home = () => {
  // SEO Metadata (unchanged, but optimized for sales/content focus)
  const metaTitle = 'TeckySolutions - Best AI Tools, Software & Tech Resources for Digital Growth';
  const metaDescription = 'Discover curated AI tools, productivity software, SaaS platforms & expert tech blogs. Compare software solutions, read honest reviews & boost your business growth. Trusted by 10,000+ users.';
  const canonicalUrl = window.location.origin;
  
  // Structured data JSON (enhanced for software sales and articles)
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TeckySolutions",
    "url": canonicalUrl,
    "logo": "https://yourdomain.com/logo.png",
    "description": "Curated AI tools, software reviews, and tech resources for digital growth",
    "sameAs": [
      "https://twitter.com/teckysolutions",
      "https://linkedin.com/company/teckysolutions",
      "https://facebook.com/teckysolutions"
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
          "text": "TeckySolutions curates the best AI tools for businesses including automation software, content creation tools, analytics platforms, and productivity boosters. Our experts test and review each tool to ensure quality."
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
          "text": "Use our comparison features, read expert reviews, and check user ratings on TeckySolutions. We provide detailed breakdowns of features, pricing, and use cases to help you make informed decisions."
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
  const [generalOffers, setGeneralOffers] = useState([]);
  const [recentBlogs, setRecentBlogs] = useState([]);
  
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
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        // Fetch product counts
        const prodResp = await productService.getCategoriesWithCounts();
        const prodCounts = {};
        if (prodResp.success) {
          (prodResp.categories || prodResp.data || []).forEach(c => {
            const id = c.category || c._id || c.categoryId;
            if (id) prodCounts[id] = c.count || 0;
          });
        }

        // Fetch all offers and count by category
        const offersResp = await offersAPI.getAll({ limit: 10000 });
        const offerCounts = {};
        const offersList = offersResp.data?.data || offersResp.data || [];
        offersList.forEach(offer => {
          const catId = offer?.category?._id || offer?.category || null;
          if (!catId) return;
          const key = String(catId);
          offerCounts[key] = (offerCounts[key] || 0) + 1;
        });

        if (!mounted) return;

        // Merge counts: products + offers
        const merged = {};
        const allIds = new Set([...Object.keys(prodCounts).map(String), ...Object.keys(offerCounts).map(String)]);
        allIds.forEach(id => {
          merged[id] = (Number(prodCounts[id]) || 0) + (Number(offerCounts[id]) || 0);
        });
        
        setCategoryCounts(merged);
      } catch (err) {
        console.warn('Failed to load category counts:', err);
        setCategoryCounts({});
      }
    })();
    return () => { mounted = false; };
  }, [categories]);

  const featuredCategories = useMemo(() => {
    if (!Array.isArray(categories)) return [];
    return categories.slice(0, 6).map(cat => ({
      ...cat,
      productCount: categoryCounts[String(cat._id)] || 0
    }));
  }, [categories, categoryCounts]);

  // Effects (unchanged)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setPageTitle('TeckySolutions – Best AI Tools, Software & Tech Resources for Digital Growth');
    
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

  // Fetch recent blogs with persistent caching
  useEffect(() => {
    let mounted = true;
    
    // Check cache first
    if (homePageBlogsCache.data && Date.now() - homePageBlogsCache.timestamp < HOME_BLOGS_CACHE_TTL) {
      if (mounted) {
        setRecentBlogs(homePageBlogsCache.data);
      }
      return;
    }
    
    (async () => {
      try {
        const response = await blogsAPI.getAll({ 
          limit: 100,
          pageSize: 100
        });
        const blogs = response?.data?.blogs || [];
        
        if (mounted) {
          // Sort by creation date descending (most recent first)
          const sorted = [...blogs].sort((a, b) => {
            const dateA = new Date(a.createdAt || 0).getTime();
            const dateB = new Date(b.createdAt || 0).getTime();
            return dateB - dateA;
          });
          
          // Cache the result
          homePageBlogsCache.data = sorted;
          homePageBlogsCache.timestamp = Date.now();
          
          setRecentBlogs(sorted);
        }
      } catch (err) {
        console.error('Failed to fetch blogs:', err);
        if (mounted) {
          setRecentBlogs([]);
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Loading and error handling (unchanged)
  if (isPageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="large" showBrand={true} />
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
    <div className="min-h-screen">
      {/* Notification (unchanged) */}
      {notification.show && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification({ ...notification, show: false })}
          duration={5000}
        />
      )}

      {/* Hero Section with background image */}
      <section
        className="relative overflow-hidden text-white min-h-screen flex items-center"
        style={{
          backgroundImage: `url('/homeherobanner/futuristic-tech-hero-banner-dark-blue-teal.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay to ensure strong contrast with text */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45))' }}
        />

        <div className="container relative mx-auto px-4 py-16 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column: All hero text lives here for strong left alignment */}
            <div className="lg:col-span-1 max-w-2xl space-y-6">
              {/* Small trust badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2 bg-black/30 rounded-full border border-white/10 text-sm">
                <span className="text-lg">⭐</span>
                <span className="font-semibold">Trusted by 10,000+ Professionals</span>
              </div>

              {/* Headline - split into three lines */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight">
                <span className="block">Discover & Shop</span>
                <span className="block">Software, Services</span>
                <span className="block">& Professional Solutions</span>
              </h1>

              {/* Supporting paragraph */}
              <p className="text-lg text-gray-300 leading-relaxed">
                Explore top AI tools, curated software, exclusive offers, and professional services. Compare products and read expert guides to grow your business.
              </p>

              {/* Feature list in one column */}
              <ul className="mt-2 space-y-3 text-gray-200">
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-0.5">✓</span>
                  <span>Expert Reviews & Articles</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-0.5">✓</span>
                  <span>Secure Software Purchases</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-teal-400 mt-0.5">✓</span>
                  <span>Daily Tool Updates</span>
                </li>
              </ul>

              {/* CTAs: stacked on mobile, horizontal on desktop */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link to="/listings" className="w-full sm:w-auto cursor-pointer">
                  <Button
                    size="large"
                    className="bg-[#FF6600] hover:bg-[#e65500] text-white border-0 px-8 py-4 rounded-2xl shadow-lg w-full sm:w-auto cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🛒</span>
                      <span className="font-bold text-lg">Shop Now</span>
                    </span>
                  </Button>
                </Link>

                <Link to="/services" className="w-full sm:w-auto cursor-pointer">
                  <Button
                    size="large"
                    className="bg-[#20C997] hover:bg-[#1aa07f] text-white border-0 px-8 py-4 rounded-2xl shadow-sm w-full sm:w-auto cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">🚀</span>
                      <span className="font-bold text-lg">Services</span>
                    </span>
                  </Button>
                </Link>

                <Link to="/blogs" className="w-full sm:w-auto cursor-pointer">
                  <Button
                    size="large"
                    variant="ghost"
                    className="text-gray-100 hover:text-white bg-transparent px-6 py-3 rounded-2xl w-full sm:w-auto cursor-pointer transition-all"
                  >
                    <span className="flex items-center gap-3">
                      <span className="text-2xl">📖</span>
                      <span className="font-medium">Articles</span>
                    </span>
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right Column: keep mostly empty to preserve balance with background */}
            <div className="hidden lg:block" aria-hidden="true"></div>

          </div>
        </div>
        
        {/* Scroll Indicator: Enhanced */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center backdrop-blur-sm">
            <div className="w-1 h-4 bg-gradient-to-b from-blue-400 to-teal-300 mt-2 rounded-full"></div>
          </div>
        </div>
        
        {/* Bottom Transition: Smoother */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
      </section>

      {/* Categories Section: Streamlined */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
              Shop by <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Find the perfect software for your needs across our curated categories
            </p>
          </div>
          
          {featuredCategories.length > 0 && (
            <CategoryGridFullImage 
              categories={featuredCategories}
              columns={4}
              imageHeight="h-40"
              showDescription={true}
              showProductCount={true}
              mobileSize="small"
              horizontal={true}
              autoRotate={true}
              rotationInterval={4000}
            />
            
          )}
        </div>
      </section>

      {/* Top Banner Section */}
      <Suspense fallback={<LoadingSpinner size="medium" />}>
        {topBanners.length > 0 && (
          <section className="py-12 sm:py-16">
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
      </Suspense>

      {/* Popular Listings: 9 Items */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-gray-900/50 via-blue-900/10 to-cyan-900/10 border border-blue-500/20 rounded-3xl mx-4 sm:mx-0">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
              Top <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Trending</span> Listings
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore premium software, job opportunities, professional services, and products. Compare features, read reviews, and find the right solution for your needs.
            </p>
          </div>
          
          {featuredProducts.length > 0 && (
            <ProductGrid 
              products={featuredProducts.slice(0, 9)}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              cardClassName="hover:shadow-2xl hover:shadow-cyan-500/50 hover:-translate-y-2 transition-all duration-300 rounded-3xl bg-gradient-to-br from-gray-800/80 to-gray-900/80 border border-cyan-500/20 hover:border-cyan-400/60"
            />
          )}

          <div className="text-center mt-12">
            <Link to="/listings" className="cursor-pointer">
              <Button 
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all"
              >
                View All Listings
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Section: 6 Services */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
              Our <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Professional Services</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Beyond tools, we offer expert services to help your business grow
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {servicesData.slice(0, 4).map((service) => (
              <Link key={service.id} to={`/services/${service.slug}`} className="group">
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:scale-105 border border-white/10">
                  {/* Service Image */}
                  <div className="flex justify-center items-center bg-gradient-to-br from-gray-700 to-gray-800 p-4 h-56">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="max-w-md w-full h-56 object-contain group-hover:scale-105 transition-transform duration-500 rounded-lg"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="text-3xl mb-3">{service.icon}</div>
                      <h3 className="text-base font-bold text-gray-100 group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                        {service.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                        {service.shortDescription}
                      </p>
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm group-hover:gap-3 transition-all">
                      Learn More
                      <span>→</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/services" className="cursor-pointer">
              <Button 
                variant="primary"
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Middle Banner Section */}
      <Suspense fallback={<LoadingSpinner size="medium" />}>
        {middleBanners.length > 0 && (
          <section className="py-12 sm:py-16">
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

      {/* Offers Section: 6 Offers */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
              🎁 Exclusive Offers
            </h2>

            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-6">
              Hand-picked deals across listings—software, services, and products. Find limited-time discounts and exclusive partner offers.
            </p>

            <Suspense fallback={<LoadingSpinner size="medium" />}>
              <OfferSection offers={Array.isArray(generalOffers) ? generalOffers.slice(0, 6) : []} showExploreButton={true} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Blogs Section: 6 Blogs */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-4">
              📖 Latest <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Articles</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Expert insights on tools, technology, and digital growth
            </p>
          </div>

          <Suspense fallback={<LoadingSpinner size="medium" />}>
            <BlogGrid blogs={recentBlogs.slice(0, 4)} columns={4} limit={4} />
          </Suspense>

          <div className="text-center mt-12">
            <Link to="/blogs" className="cursor-pointer">
              <Button 
                variant="primary"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-4 rounded-xl font-bold text-lg cursor-pointer transition-all"
              >
                Read All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Banner Section */}
      <Suspense fallback={<LoadingSpinner size="medium" />}>
        {bottomBanners.length > 0 && (
          <section className="py-12 sm:py-16">
            <div className="container mx-auto px-4">
              <div className="relative overflow-hidden rounded-3xl shadow-2xl">
                <HeroBanner 
                  banners={bottomBanners}
                  {...commonBannerProps}
                />
              </div>
            </div>
          </section>
        )}
      </Suspense>

      {/* SEO Content Block: Enhanced for Articles/Sales */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-8">
              Buy Software & Read Expert Articles
            </h2>
            <div className="prose prose-xl mx-auto text-gray-400 mb-12">
              <p className="text-2xl mb-8">
                <strong>TeckySolutions</strong> is your go-to marketplace for premium AI tools, software solutions, and in-depth articles on digital services. Compare prices, read unbiased reviews, and make informed purchases to accelerate your business.
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
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl sm:text-5xl font-bold text-center text-gray-100 mb-16">
            Frequently Asked Questions
          </h2>
          <div className="max-w-4xl mx-auto space-y-8">
            {[
              {
                question: "How do I buy software on TeckySolutions?",
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
                <p className="text-gray-300 text-lg pl-12">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Editorial Authority: Enhanced */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl shadow-xl mb-12 border border-white/10">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                <span className="text-white text-2xl">✍️</span>
              </div>
              <span className="font-bold text-gray-100 text-xl">Curated by TeckySolutions Experts</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-100 mb-8">
              Trusted Reviews & Articles for Smart Purchases
            </h2>
            <p className="text-2xl text-gray-300 mb-12 max-w-4xl mx-auto">
              Our team of tech experts tests every tool, writes detailed articles, and ensures you get honest insights for better buying decisions.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-16">
              <div className="flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6 rounded-2xl shadow-xl border border-white/10">
                <span className="text-3xl">🎯</span>
                <div className="text-left">
                  <div className="font-bold text-gray-100 text-lg">In-Depth Reviews</div>
                  <div className="text-sm text-gray-400">Hands-on testing before you buy</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6 rounded-2xl shadow-xl border border-white/10">
                <span className="text-3xl">📈</span>
                <div className="text-left">
                  <div className="font-bold text-gray-100 text-lg">Data-Driven Articles</div>
                  <div className="text-sm text-gray-400">Performance metrics & comparisons</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-gradient-to-r from-gray-800 to-gray-700 px-8 py-6 rounded-2xl shadow-xl border border-white/10">
                <span className="text-3xl">🤝</span>
                <div className="text-left">
                  <div className="font-bold text-gray-100 text-lg">Buyer-First Approach</div>
                  <div className="text-sm text-gray-400">No sponsored content, just facts</div>
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
              <Link to="/signup" className="cursor-pointer">
                <Button 
                  variant="primary" 
                  size="large"
                  className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 shadow-2xl hover:shadow-cyan-500/25 px-12 py-6 rounded-2xl text-xl font-bold transform hover:scale-105 transition-all duration-300 cursor-pointer"
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