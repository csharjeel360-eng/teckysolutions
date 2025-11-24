import React from 'react';
import { Link } from 'react-router-dom';
import  Button  from '../../components/UI/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="mx-auto w-48 h-48 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <span className="text-6xl">404</span>
          </div>
        </div>

        {/* Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        <p className="text-lg text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you entered the wrong URL.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/">
            <Button variant="primary" size="large">
              Go Back Home
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="outline" size="large">
              Browse Products
            </Button>
          </Link>
        </div>

        {/* Additional Help */}
        <div className="mt-12 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Need Help?</h3>
          <p className="text-gray-600 mb-4">
            If you believe this is an error, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:support@temuclone.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Contact Support
            </a>
            <a
              href="/help"
              className="text-gray-600 hover:text-gray-700 font-medium"
            >
              Visit Help Center
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8">
          <p className="text-sm text-gray-500 mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/categories" className="text-blue-600 hover:text-blue-700 text-sm">
              Categories
            </Link>
            <Link to="/blogs" className="text-blue-600 hover:text-blue-700 text-sm">
              Blog
            </Link>
            <Link to="/about" className="text-blue-600 hover:text-blue-700 text-sm">
              About Us
            </Link>
            <Link to="/contact" className="text-blue-600 hover:text-blue-700 text-sm">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;