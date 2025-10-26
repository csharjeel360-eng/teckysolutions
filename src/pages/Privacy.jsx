// src/pages/Privacy.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Privacy = () => {
  useEffect(() => {
    document.title = 'Privacy Policy - DigitalPro';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Privacy Policy
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
              <p className="text-gray-700 mb-4">
                Welcome to TeckySolutions ("we," "our," or "us"). We are committed to protecting your privacy 
                and ensuring the security of your personal information. This Privacy Policy explains how 
                we collect, use, disclose, and safeguard your information when you visit our website or 
                use our services.
              </p>
              <p className="text-gray-700">
                By accessing our website and using our services, you consent to the practices described 
                in this Privacy Policy.
              </p>
            </section>

            {/* Information We Collect */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Information We Collect</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Personal Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>Name and contact information (email address, phone number)</li>
                <li>Company information and job title</li>
                <li>Billing and payment information</li>
                <li>Project requirements and business goals</li>
                <li>Communication preferences</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Automatically Collected Information</h3>
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Website usage data and analytics</li>
                <li>Cookies and tracking technologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Information from Third Parties</h3>
              <p className="text-gray-700">
                We may receive information about you from third-party services like Google Analytics, 
                social media platforms, and business partners.
              </p>
            </section>

            {/* How We Use Your Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>To provide and maintain our digital marketing services</li>
                <li>To process your requests and communicate with you</li>
                <li>To improve our website and services</li>
                <li>To send marketing communications (with your consent)</li>
                <li>To analyze website usage and optimize user experience</li>
                <li>To prevent fraud and enhance security</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Data Sharing and Disclosure</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information in the following circumstances:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>With service providers who assist in our operations</li>
                <li>With business partners for joint marketing efforts (with your consent)</li>
                <li>When required by law or to protect our rights</li>
                <li>During business transfers, such as mergers or acquisitions</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate technical and organizational security measures to protect your 
                personal information against unauthorized access, alteration, disclosure, or destruction. 
                However, no method of transmission over the Internet is 100% secure, and we cannot 
                guarantee absolute security.
              </p>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights</h2>
              <p className="text-gray-700 mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Restrict or object to processing of your data</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-700 mt-4">
                To exercise these rights, please contact us at{' '}
                <a href="mailto:teckysolutions360@gmail.com" className="text-blue-600 hover:underline">
                  privacy@digitalpro.com
                </a>
              </p>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                We use cookies and similar tracking technologies to enhance your experience on our website. 
                You can control cookies through your browser settings.
              </p>
              <p className="text-gray-700">
                We use Google Analytics to analyze website traffic. You can opt-out of Google Analytics 
                tracking through the Google Analytics Opt-out Browser Add-on.
              </p>
            </section>

            {/* Third-Party Links */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Third-Party Links</h2>
              <p className="text-gray-700">
                Our website may contain links to third-party websites. We are not responsible for the 
                privacy practices or content of these external sites. We encourage you to review their 
                privacy policies.
              </p>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Data Retention</h2>
              <p className="text-gray-700">
                We retain your personal information only for as long as necessary to fulfill the purposes 
                outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Children's Privacy</h2>
              <p className="text-gray-700">
                Our services are not directed to individuals under the age of 16. We do not knowingly 
                collect personal information from children. If you believe we have collected information 
                from a child, please contact us immediately.
              </p>
            </section>

            {/* Changes to Policy */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
              <p className="text-gray-700 mb-2">
                If you have any questions about this Privacy Policy, please contact us:
              </p>
              <div className="text-gray-700 space-y-1">
                <p>Email: <a href="mailto:teckysolutions360@gmail.com" className="text-blue-600 hover:underline">privacy@digitalpro.com</a></p>
                <p>Phone: +1 (555) 123-4567</p>
                <p>Address: 123 Business Ave, Suite 100, New York, NY 10001</p>
              </div>
            </section>
          </div>

          {/* Back to Home */}
          <div className="mt-12 pt-8 border-t border-gray-200 text-center">
            <Link
              to="/"
              className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;