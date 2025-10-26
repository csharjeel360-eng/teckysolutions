// src/pages/ServicesPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const ServicesPage = () => {
  const services = [
    {
      icon: '🛠️',
      title: 'Website Cleaning & Maintenance',
      description: 'Keep your website running smoothly with our comprehensive maintenance services.',
      features: [
        'Security updates and patches',
        'Performance optimization',
        'Bug fixes and troubleshooting',
        'Content updates and management',
        'Backup and recovery solutions',
        'SSL certificate management'
      ],
      price: 'Starting at $99/month',
      cta: 'Get Maintenance'
    },
    {
      icon: '🔍',
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings and drive organic traffic with our proven SEO strategies.',
      features: [
        'Comprehensive keyword research',
        'On-page optimization',
        'Technical SEO audit',
        'Content strategy development',
        'Backlink building',
        'Local SEO optimization'
      ],
      price: 'Starting at $499/month',
      cta: 'Boost Rankings'
    },
    {
      icon: '🛒',
      title: 'Shopify Development',
      description: 'Create stunning e-commerce stores with custom Shopify solutions that convert.',
      features: [
        'Custom theme development',
        'App integration and customization',
        'Payment gateway setup',
        'Product migration',
        'Mobile optimization',
        'Ongoing support and training'
      ],
      price: 'Starting at $1,999',
      cta: 'Build Store'
    },
    {
      icon: '📈',
      title: 'Digital Marketing',
      description: 'Reach your target audience and convert leads with data-driven marketing campaigns.',
      features: [
        'Social media marketing',
        'PPC advertising management',
        'Email marketing campaigns',
        'Content marketing',
        'Analytics and reporting',
        'Conversion rate optimization'
      ],
      price: 'Starting at $799/month',
      cta: 'Start Campaign'
    }
  ];

  return (
    <div className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions tailored to your business needs. 
            From website development to digital marketing, we've got you covered.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all p-8 group hover:transform hover:-translate-y-2"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h2>
              <p className="text-gray-600 mb-6 text-lg">
                {service.description}
              </p>
              
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex items-center justify-between mt-8">
                <span className="text-2xl font-bold text-blue-600">
                  {service.price}
                </span>
                <Link
                  to="/contact"
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  {service.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Process Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Our Process
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'We learn about your business and goals' },
              { step: '02', title: 'Strategy', desc: 'We create a customized plan for success' },
              { step: '03', title: 'Execution', desc: 'We implement solutions with precision' },
              { step: '04', title: 'Optimization', desc: 'We continuously improve results' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesPage;