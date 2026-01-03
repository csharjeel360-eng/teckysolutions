import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, User } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-[black] to-[black] rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Introduction */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
            <p className="text-gray-700 mb-4">
              Welcome to <strong>AffiliateHub</strong> ("we," "our," or "us"). We operate an affiliate marketing platform 
              that allows users to upload, promote, and manage products and services from various merchants and brands.
            </p>
            <p className="text-gray-700">
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use 
              our platform, including when you upload affiliate products, track performance, and interact with our services.
            </p>
          </section>

          {/* Information Collection */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <User className="w-5 h-5 text-[black] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Personal Information</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Name, email address, and contact details</li>
                    <li>Payment and billing information for affiliate earnings</li>
                    <li>Tax identification numbers for payment processing</li>
                    <li>Social media and marketing platform credentials</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-[black] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product & Performance Data</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Affiliate products and services you upload</li>
                    <li>Product descriptions, images, and promotional materials</li>
                    <li>Click-through rates, conversion data, and commission earnings</li>
                    <li>Customer engagement and sales performance metrics</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <Lock className="w-5 h-5 text-[black] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Technical Information</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>IP addresses, browser type, and device information</li>
                    <li>Usage patterns and platform interaction data</li>
                    <li>Cookies and tracking technologies data</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use Information */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                <li>Process and track affiliate commissions and payments</li>
                <li>Manage and display your uploaded products and services</li>
                <li>Provide performance analytics and reporting tools</li>
                <li>Facilitate communication between affiliates and merchants</li>
                <li>Improve our platform features and user experience</li>
                <li>Comply with legal obligations and prevent fraud</li>
              </ul>
            </div>
          </section>

          {/* Data Sharing */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing & Disclosure</h2>
            <p className="text-gray-700 mb-4">
              We may share your information with:
            </p>
            <ul className="text-gray-700 list-disc list-inside space-y-2">
              <li><strong>Merchants & Brands:</strong> Basic affiliate information and performance data for the products you promote</li>
              <li><strong>Payment Processors:</strong> Necessary information for commission payments</li>
              <li><strong>Analytics Providers:</strong> Aggregated performance data</li>
              <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
            </ul>
          </section>

          {/* Data Retention */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Retention</h2>
            <p className="text-gray-700">
              We retain your personal information for as long as necessary to provide our services, 
              comply with legal obligations, resolve disputes, and enforce our agreements. Product data 
              and performance metrics are retained to provide historical analytics and payment records.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Access & Control</h3>
                <p className="text-gray-700 text-sm">
                  Access, correct, or delete your personal information and uploaded products
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Data Portability</h3>
                <p className="text-gray-700 text-sm">
                  Request a copy of your data in a machine-readable format
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Marketing Preferences</h3>
                <p className="text-gray-700 text-sm">
                  Opt-out of marketing communications at any time
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">Account Deletion</h3>
                <p className="text-gray-700 text-sm">
                  Request deletion of your account and associated data
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <p className="text-gray-700 mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><strong>Email:</strong> privacy@affiliatehub.com</p>
              <p className="text-gray-700"><strong>Address:</strong> 123 Affiliate Street, Digital City, DC 12345</p>
            </div>
          </section>

          {/* Navigation */}
          <div className="border-t border-gray-200 pt-8 mt-8 flex justify-between">
            <Link to="/" className="text-[black] hover:text-[gray-800] font-medium">
              ← Back to Home
            </Link>
            <Link to="/terms-of-service" className="text-[black] hover:text-[gray-800] font-medium">
              Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
