import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              {/* Logo */}
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white rounded transform rotate-45"></div>
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"></div>
                  <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold text-white">
                    Trendy<span className="text-blue-300">Breeze</span>
                  </span>
                  <p className="text-gray-400 text-sm mt-1">
                    Your trusted online shopping destination
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <h3 className="font-semibold mb-3 text-sm">Navigation</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/" 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/listings" 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Listings
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 text-sm">&nbsp;</h3>
                <ul className="space-y-2">
                  <li>
                    <Link 
                      to="/categories" 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Categories
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/blogs" 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Blogs
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-sm">Legal</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                       to="/privacy-policy"
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                    to="/terms-of-service"
                       className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Terms of Service
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © {currentYear} TrendyBreeze. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                 to="/privacy-policy" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms-of-service" 
                className="text-gray-400 hover:text-white text-sm transition-colors"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;