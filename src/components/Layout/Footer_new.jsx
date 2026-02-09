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
              <img 
                src="logos/Tecky Logo Design (1).png" 
                alt="TeckySolutions Logo" 
                className="h-16 w-auto object-contain"
              />
              <div>
                <span className="text-2xl font-bold text-white">TeckySolutions</span>
                <p className="text-gray-400 text-sm mt-1">
                  Your trusted online shopping destination
                </p>
              </div>
            </div>
            
            {/* Social Media Icons */}
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com/teckysolutions"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
                className="text-gray-400 hover:text-blue-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              
              <a
                href="https://instagram.com/teckysolutions"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
                className="text-gray-400 hover:text-pink-500 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22.5C6.201 22.5 1.5 17.799 1.5 12S6.201 1.5 12 1.5 22.5 6.201 22.5 12 17.799 22.5 12 22.5zm5.06-10.5c0-2.821-2.278-5.1-5.1-5.1-2.821 0-5.1 2.279-5.1 5.1 0 2.821 2.279 5.1 5.1 5.1 2.822 0 5.1-2.279 5.1-5.1zm-8.1 0c0-1.657 1.342-3 3-3s3 1.343 3 3-1.342 3-3 3-3-1.343-3-3zm6.15-4.65c0-.66.54-1.2 1.2-1.2.66 0 1.2.54 1.2 1.2 0 .66-.54 1.2-1.2 1.2-.66 0-1.2-.54-1.2-1.2z"/>
                </svg>
              </a>
              
              <a
                href="https://twitter.com/teckysolutions"
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
                className="text-gray-400 hover:text-blue-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417a9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              
              <a
                href="https://linkedin.com/company/teckysolutions"
                target="_blank"
                rel="noopener noreferrer"
                title="LinkedIn"
                className="text-gray-400 hover:text-blue-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/>
                </svg>
              </a>
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
                      to="/services" 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Services
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/contact" 
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      Contact
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
              © {currentYear} TeckySolutions. All rights reserved.
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
