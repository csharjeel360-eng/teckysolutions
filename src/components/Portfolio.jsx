// src/components/Portfolio.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const projects = [
    {
      id: 1,
      title: 'E-commerce Shopify Store',
      category: 'shopify',
      description: 'Complete Shopify store setup with custom theme and product integration',
      image: '/api/placeholder/600/400',
      tags: ['Shopify', 'E-commerce', 'UI/UX'],
      link: '#',
      features: ['Custom Theme', 'Payment Integration', 'Mobile Responsive']
    },
    {
      id: 2,
      title: 'SEO Optimization - Tech Company',
      category: 'seo',
      description: 'Comprehensive SEO strategy that increased organic traffic by 250% in 6 months',
      image: '/api/placeholder/600/400',
      tags: ['SEO', 'Content Strategy', 'Technical SEO'],
      link: '#',
      features: ['Keyword Research', 'On-page Optimization', 'Backlink Building']
    },
    {
      id: 3,
      title: 'Website Revamp & Cleaning',
      category: 'cleaning',
      description: 'Complete website overhaul with performance optimization and security updates',
      image: '/api/placeholder/600/400',
      tags: ['Website Cleaning', 'Performance', 'Security'],
      link: '#',
      features: ['Performance Optimization', 'Security Hardening', 'Content Restructure']
    },
    {
      id: 4,
      title: 'Digital Marketing Campaign',
      category: 'marketing',
      description: 'Multi-channel digital marketing campaign that boosted conversions by 180%',
      image: '/api/placeholder/600/400',
      tags: ['Digital Marketing', 'PPC', 'Social Media'],
      link: '#',
      features: ['PPC Campaigns', 'Social Media Ads', 'Email Marketing']
    },
    {
      id: 5,
      title: 'Local Business SEO',
      category: 'seo',
      description: 'Local SEO strategy that placed client #1 in local search results',
      image: '/api/placeholder/600/400',
      tags: ['Local SEO', 'Google My Business', 'Citations'],
      link: '#',
      features: ['Local Listings', 'Review Management', 'Local Content']
    },
    {
      id: 6,
      title: 'Shopify Plus Migration',
      category: 'shopify',
      description: 'Seamless migration from WooCommerce to Shopify Plus with zero downtime',
      image: '/api/placeholder/600/400',
      tags: ['Shopify Plus', 'Migration', 'E-commerce'],
      link: '#',
      features: ['Data Migration', 'Theme Development', 'Training']
    }
  ];

  const filters = [
    { key: 'all', label: 'All Projects' },
    { key: 'shopify', label: 'Shopify' },
    { key: 'seo', label: 'SEO' },
    { key: 'cleaning', label: 'Website Cleaning' },
    { key: 'marketing', label: 'Digital Marketing' }
  ];

  const filteredProjects = activeFilter === 'all' 
    ? projects 
    : projects.filter(project => project.category === activeFilter);

  const getCategoryColor = (category) => {
    const colors = {
      shopify: 'bg-green-100 text-green-800',
      seo: 'bg-blue-100 text-blue-800',
      cleaning: 'bg-purple-100 text-purple-800',
      marketing: 'bg-orange-100 text-orange-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };
   const navigate = useNavigate();

  const handleContactClick = () => {
    navigate('/contact');
  };

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            Our Portfolio
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our successful projects and see how we've helped businesses 
            achieve their digital goals.
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-6 py-3 rounded-full font-medium transition-all ${
                activeFilter === filter.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:transform hover:-translate-y-2"
            >
              {/* Project Image */}
              <div className="relative overflow-hidden h-48 bg-gradient-to-br from-blue-50 to-gray-100">
                <div className="absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(project.category)}`}>
                    {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                  </span>
                </div>
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-4xl text-gray-400">
                    {project.category === 'shopify' && '🛒'}
                    {project.category === 'seo' && '🔍'}
                    {project.category === 'cleaning' && '🛠️'}
                    {project.category === 'marketing' && '📈'}
                  </div>
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {project.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA Button */}
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors group-hover:shadow-lg">
                  View Case Study
                  <svg className="w-4 h-4 ml-2 inline-block" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">150+</div>
              <div className="text-blue-100">Projects Completed</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">3x</div>
              <div className="text-blue-100">Average ROI</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Ready to start your next project?
          </p>
          <button onClick={handleContactClick} className="bg-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            Start Your Project Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;