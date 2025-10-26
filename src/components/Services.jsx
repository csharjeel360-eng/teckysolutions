// src/components/Services.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Services = () => {
  const services = [
    {
      icon: '🛠️',
      title: 'Website Cleaning & Maintenance',
      description: 'Keep your website running smoothly with regular maintenance, security updates, and performance optimization.',
      features: ['Security Updates', 'Performance Optimization', 'Bug Fixes', 'Content Updates']
    },
    {
      icon: '🔍',
      title: 'SEO Optimization',
      description: 'Improve your search engine rankings and drive organic traffic with our comprehensive SEO strategies.',
      features: ['Keyword Research', 'On-Page SEO', 'Technical SEO', 'Content Strategy']
    },
    {
      icon: '🛒',
      title: 'Shopify Development',
      description: 'Create stunning e-commerce stores with Shopify. Custom designs, functionality, and seamless user experience.',
      features: ['Custom Themes', 'App Integration', 'Payment Setup', 'Mobile Optimization']
    },
    {
      icon: '📈',
      title: 'Digital Marketing',
      description: 'Reach your target audience and convert leads with our data-driven digital marketing campaigns.',
      features: ['Social Media Marketing', 'PPC Advertising', 'Email Marketing', 'Analytics']
    }
  ];

  return (
    <section id="services" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Our Professional Services
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive digital solutions to elevate your online presence and drive business growth.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 group hover:transform hover:-translate-y-2 transition-transform"
            >
              <div className="text-4xl mb-4">{service.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>
              <ul className="space-y-2 mb-6">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-gray-700">
                    <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group-hover:translate-x-2 transition-transform"
              >
                Get Started
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            to="/services"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
          >
            View All Services
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Services;