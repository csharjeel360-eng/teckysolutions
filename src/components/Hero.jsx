 // src/components/Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-blue-50 py-16 lg:py-24 xl:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
          {/* Left Content - Text Section */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 leading-tight">
              Boost Your{' '}
              <span className="text-blue-600 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Online
              </span>{' '}
              Presence
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-gray-600 max-w-2xl leading-relaxed">
              Professional website development, SEO optimization, and digital marketing 
              solutions to grow your business and dominate your market.
            </p>
            
            {/* CTA Buttons */}
            <div className="mt-8 lg:mt-12 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Start Your Project
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                to="/services"
                className="inline-flex items-center justify-center border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1"
              >
                Our Services
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l7-7-7-7" />
                </svg>
              </Link>
            </div>
            
            {/* Features List */}
            <div className="mt-8 lg:mt-10 flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-6 text-sm text-gray-600">
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="font-medium">24/7 Support</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3 flex-shrink-0"></div>
                <span className="font-medium">Money Back Guarantee</span>
              </div>
            </div>
          </div>

          {/* Right Content - Visual Section - FIXED */}
          <div className="relative order-1 lg:order-2">
            {/* Main Card */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-6 lg:p-8 text-white relative z-10 shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <div className="grid grid-cols-2 gap-4 lg:gap-6">
                {/* SEO Card */}
                <div className="bg-white/20 rounded-2xl p-4 lg:p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-blue-600 text-lg lg:text-xl">🔍</span>
                  </div>
                  <h3 className="font-bold text-white text-sm lg:text-base mb-1">SEO</h3>
                  <p className="text-white/90 text-xs lg:text-sm">Rank Higher</p>
                </div>
                
                {/* Web Design Card */}
                <div className="bg-white/20 rounded-2xl p-4 lg:p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-blue-600 text-lg lg:text-xl">💻</span>
                  </div>
                  <h3 className="font-bold text-white text-sm lg:text-base mb-1">Web Design</h3>
                  <p className="text-white/90 text-xs lg:text-sm">Beautiful Sites</p>
                </div>
                
                {/* E-commerce Card */}
                <div className="bg-white/20 rounded-2xl p-4 lg:p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-blue-600 text-lg lg:text-xl">🛒</span>
                  </div>
                  <h3 className="font-bold text-white text-sm lg:text-base mb-1">E-commerce</h3>
                  <p className="text-white/90 text-xs lg:text-sm">Shopify Expert</p>
                </div>
                
                {/* Marketing Card */}
                <div className="bg-white/20 rounded-2xl p-4 lg:p-5 border border-white/30 hover:bg-white/30 transition-all duration-300">
                  <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                    <span className="text-blue-600 text-lg lg:text-xl">📈</span>
                  </div>
                  <h3 className="font-bold text-white text-sm lg:text-base mb-1">Marketing</h3>
                  <p className="text-white/90 text-xs lg:text-sm">Grow Business</p>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-3 -right-3 w-6 h-6 lg:w-8 lg:h-8 bg-yellow-400 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-2 -left-2 w-8 h-8 lg:w-12 lg:h-12 bg-green-400 rounded-full opacity-60 animate-pulse delay-1000"></div>
            </div>
            
            {/* Background Decorative Elements */}
            <div className="absolute -top-6 -right-6 w-20 h-20 lg:w-32 lg:h-32 bg-yellow-400 rounded-full opacity-10 animate-bounce"></div>
            <div className="absolute -bottom-8 -left-8 w-24 h-24 lg:w-40 lg:h-40 bg-green-400 rounded-full opacity-10 animate-bounce delay-1000"></div>
            <div className="absolute top-1/2 -right-4 w-16 h-16 lg:w-24 lg:h-24 bg-pink-400 rounded-full opacity-10 animate-pulse delay-500"></div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="mt-16 lg:mt-20 flex justify-center">
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
              <div className="w-1 h-3 bg-gray-400 rounded-full mt-2"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;