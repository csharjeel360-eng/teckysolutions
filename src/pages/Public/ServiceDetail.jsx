import React, { useMemo } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Home, MessageCircle, CheckCircle, ChevronLeft } from 'lucide-react';
import servicesData from '../../data/servicesData';
import useSEO from '../../hooks/useSEO';
import { setPageTitle } from '../../utils/slugify';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const ServiceDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  // Find the service by slug
  const service = useMemo(() => {
    return servicesData.find(s => s.slug === slug);
  }, [slug]);

  // Set SEO metadata
  useSEO({
    title: service ? `${service.name} | Professional Services` : 'Service Details',
    description: service ? service.description : 'Professional service details',
    url: window.location.href
  });

  useMemo(() => {
    if (service) {
      setPageTitle(service.name);
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-100 mb-4">Service Not Found</h2>
          <p className="text-gray-300 mb-8">The service you're looking for doesn't exist.</p>
          <Link
            to="/services"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  const whatsappMessage = `Hi! I'm interested in your ${service.name} service. Can you please provide more details and a quote?`;
  const whatsappUrl = `https://wa.me/923259579107?text=${encodeURIComponent(whatsappMessage)}`;
  
  // Get the first banner as main image (16:9 ratio)
  const mainBanner = service.banners && service.banners.length > 0 ? service.banners[0] : null;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Home size={16} /> Home
          </Link>
          <span className="text-gray-500">/</span>
          <Link to="/services" className="text-blue-400 hover:text-blue-300">
            Services
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">{service.name}</span>
        </div>
      </div>

      {/* Hero Banner with background image */}
      <section
        className="relative overflow-hidden text-white py-12 sm:py-16"
        style={{
          backgroundImage: `url('/homeherobanner/futuristic-tech-hero-banner-dark-blue-teal.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.45))' }}
        />
        <div className="container relative mx-auto px-4">
          <button
            onClick={() => navigate('/services')}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg mb-6 transition-colors"
          >
            <ChevronLeft size={18} />
            Back to Services
          </button>
          <div className="flex items-center gap-6 mb-6">
            <div className="text-6xl">{service.icon}</div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-2">{service.name}</h1>
              <p className="text-xl text-blue-100">{service.shortDescription}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Content */}
          <div className="lg:col-span-2">
            {/* Service Image Section - Main Banner (16:9) */}
            {mainBanner && (
              <div className="mb-12 rounded-2xl border border-blue-500/30 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative w-full pt-[56.25%] bg-gradient-to-br from-blue-400 to-teal-400">
                  <img
                    src={mainBanner.image}
                    alt={mainBanner.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-gray-800 border-t border-white/10">
                  <h3 className="text-lg font-semibold text-gray-100">{mainBanner.title}</h3>
                  <p className="text-gray-300 text-sm mt-1">{mainBanner.description}</p>
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-100 mb-4">Overview</h2>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                {service.description}
              </p>
            </div>

            {/* Features */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">Key Features</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {service.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/30 hover:bg-blue-500/20 transition-colors">
                    <CheckCircle size={24} className="text-blue-400 flex-shrink-0 mt-1" />
                    <span className="text-gray-100 font-semibold">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* What's Included */}
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-gray-100 mb-6">What's Included</h2>
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-md border border-white/10 overflow-hidden">
                {service.detailsList.map((item, idx) => (
                    <div
                    key={idx}
                    className={`flex items-center gap-4 p-5 ${
                      idx !== service.detailsList.length - 1 ? 'border-b border-white/10' : ''
                    }`}
                  >
                    <CheckCircle size={20} className="text-blue-400 flex-shrink-0" />
                    <span className="text-gray-100">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Sticky Container */}
            <div className="sticky top-20 space-y-6">
              {/* Service Info Card */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg border border-white/10 p-8">
                {/* Price */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-gray-400 text-sm font-semibold mb-2">PRICING</p>
                  <p className="text-3xl font-bold text-gray-100">{service.price}</p>
                </div>

                {/* Delivery Time */}
                <div className="mb-6 pb-6 border-b border-white/10">
                  <p className="text-gray-400 text-sm font-semibold mb-2">DELIVERY TIME</p>
                  <p className="text-2xl font-bold text-gray-100">{service.deliveryTime}</p>
                </div>

                {/* CTA Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mb-4 transform hover:scale-105"
                >
                  <MessageCircle size={24} />
                  Contact via WhatsApp
                </a>

                {/* Info Text */}
                <div className="text-center text-sm text-gray-300 bg-blue-500/10 p-4 rounded-lg border border-blue-500/20">
                  <p className="font-semibold text-gray-100 mb-1">Phone:</p>
                  <p>+92 325 957 9107</p>
                  <p className="text-xs text-gray-400 mt-2">Click the button to chat directly</p>
                </div>

                {/* Additional Info */}
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Support</p>
                    <p className="text-sm text-gray-300">Professional support throughout your project</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Quality</p>
                    <p className="text-sm text-gray-300">100% quality assurance and satisfaction</p>
                  </div>
                </div>
              </div>

              {/* Why This Service Card */}
              <div className="bg-blue-500/10 rounded-xl border border-blue-500/30 p-6">
                <h3 className="text-lg font-bold text-gray-100 mb-4">Why Choose This Service?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Professional expertise and years of experience</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Competitive pricing with excellent value</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Fast turnaround time and delivery</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>24/7 customer support and assistance</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-blue-400 font-bold">✓</span>
                    <span>Proven track record with satisfied clients</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
