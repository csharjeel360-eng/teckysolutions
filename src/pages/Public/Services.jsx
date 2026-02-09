import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Home, MessageCircle } from 'lucide-react';
import servicesData from '../../data/servicesData';
import ServiceCard from '../../components/Services/ServiceCard';
import useSEO from '../../hooks/useSEO';
import { setPageTitle } from '../../utils/slugify';

const Services = () => {
  const pageTitle = 'Our Services';
  
  // Set SEO metadata
  useSEO({
    title: 'Web Development, Digital Marketing & SEO Services',
    description: 'Professional services including website development, Shopify store creation, digital marketing, and SEO optimization. Get a custom quote today!',
    url: window.location.href
  });

  useMemo(() => {
    setPageTitle(pageTitle);
  }, [pageTitle]);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-gray-800 border-b border-white/10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-2 text-sm">
          <Link to="/" className="text-blue-400 hover:text-blue-300 flex items-center gap-1">
            <Home size={16} /> Home
          </Link>
          <span className="text-gray-500">/</span>
          <span className="text-gray-300">Services</span>
        </div>
      </div>

      {/* Hero Section with banner background */}
      <section
        className="relative overflow-hidden text-white py-16 sm:py-20"
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
        <div className="container relative mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our Expert Services
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Get professional solutions for your digital needs. From website development to digital marketing, we've got you covered.
          </p>
          <a
            href="https://wa.me/923259579107?text=I%20am%20interested%20in%20your%20services%20and%20would%20like%20a%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <MessageCircle size={20} />
            Get In Touch on WhatsApp
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 sm:py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
              What We Offer
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Choose the service that best fits your business needs and let us help you grow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {servicesData.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 sm:py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              We bring expertise, creativity, and dedication to every project
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-white/10">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Expert Team</h3>
              <p className="text-gray-300">
                Our experienced professionals have years of industry expertise
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-white/10">
              <div className="text-5xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Fast Turnaround</h3>
              <p className="text-gray-300">
                We deliver quality results on time without compromising excellence
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl border border-white/10">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">Results Focused</h3>
              <p className="text-gray-300">
                Our goal is your success. We focus on measurable results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-blue-600 to-teal-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Contact us now through WhatsApp to discuss your project and get a custom quote
          </p>
          <a
            href="https://wa.me/923259579107?text=I%20am%20interested%20in%20your%20services%20and%20would%20like%20a%20quote."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-10 rounded-lg transition-all duration-300 transform hover:scale-105 text-lg"
          >
            <MessageCircle size={24} />
            Start a Conversation on WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
