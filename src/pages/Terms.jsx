// src/pages/Terms.jsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

const Terms = () => {
  useEffect(() => {
    document.title = 'Terms & Conditions - DigitalPro';
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h1>
          <p className="text-xl text-gray-600">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
          <div className="prose prose-lg max-w-none">
            {/* Agreement */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
              <p className="text-gray-700">
                By accessing and using DigitalPro's website and services, you accept and agree to be bound 
                by these Terms and Conditions. If you disagree with any part of these terms, you may not 
                access our website or use our services.
              </p>
            </section>

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Services Description</h2>
              <p className="text-gray-700 mb-4">
                DigitalPro provides digital marketing services including but not limited to:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Website development and design</li>
                <li>Search Engine Optimization (SEO)</li>
                <li>Shopify store development</li>
                <li>Digital marketing campaigns</li>
                <li>Website maintenance and cleaning</li>
                <li>Social media marketing</li>
              </ul>
              <p className="text-gray-700 mt-4">
                All services are provided on a project basis or through ongoing retainers as outlined 
                in individual service agreements.
              </p>
            </section>

            {/* Payments */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Payments and Billing</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>All prices are quoted in US Dollars unless otherwise specified</li>
                <li>Payment terms are outlined in individual service agreements</li>
                <li>Late payments may incur additional fees or service suspension</li>
                <li>Refund policies vary by service and are detailed in service agreements</li>
                <li>We reserve the right to modify pricing with 30 days' notice</li>
              </ul>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Intellectual Property</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Client Content</h3>
              <p className="text-gray-700 mb-4">
                You retain all rights to your content, including text, images, and other materials 
                provided for your projects.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Our Work</h3>
              <p className="text-gray-700 mb-4">
                Upon full payment, we transfer all rights to the delivered work to you, except for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4">
                <li>Pre-existing code and frameworks we own</li>
                <li>Third-party assets with their own licensing terms</li>
                <li>Proprietary tools and methodologies</li>
              </ul>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Portfolio Rights</h3>
              <p className="text-gray-700">
                We reserve the right to display your project in our portfolio and marketing materials, 
                unless otherwise agreed in writing.
              </p>
            </section>

            {/* Client Responsibilities */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Client Responsibilities</h2>
              <p className="text-gray-700 mb-4">As our client, you agree to:</p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Provide accurate and complete information for your projects</li>
                <li>Respond to requests for feedback and approval in a timely manner</li>
                <li>Provide necessary access to systems and accounts</li>
                <li>Adhere to agreed-upon payment schedules</li>
                <li>Ensure all provided content does not infringe on third-party rights</li>
              </ul>
            </section>

            {/* Project Timeline */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Project Timeline</h2>
              <p className="text-gray-700 mb-4">
                Project timelines are estimates and may vary based on:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Client responsiveness and feedback timing</li>
                <li>Project complexity and scope changes</li>
                <li>Third-party dependencies</li>
                <li>Technical challenges</li>
              </ul>
              <p className="text-gray-700 mt-4">
                We are not liable for delays caused by factors beyond our reasonable control.
              </p>
            </section>

            {/* Warranties */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Warranties and Limitations</h2>
              
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Service Warranty</h3>
              <p className="text-gray-700 mb-4">
                We warrant that our services will be performed in a professional and workmanlike manner. 
                Specific warranties are outlined in individual service agreements.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">Limitation of Liability</h3>
              <p className="text-gray-700 mb-4">
                Our total liability to you for any claim shall not exceed the total amount paid by you 
                for the specific services giving rise to the claim.
              </p>

              <h3 className="text-xl font-semibold text-gray-800 mb-3">No Guarantees</h3>
              <p className="text-gray-700">
                While we use our expertise to achieve the best results, we cannot guarantee specific 
                outcomes for services like SEO, where results depend on numerous external factors.
              </p>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Termination</h2>
              <p className="text-gray-700 mb-4">
                Either party may terminate a service agreement with written notice according to the 
                terms specified in the agreement.
              </p>
              <p className="text-gray-700">
                Upon termination, you are responsible for payment for all services rendered up to the 
                termination date.
              </p>
            </section>

            {/* Confidentiality */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Confidentiality</h2>
              <p className="text-gray-700">
                Both parties agree to maintain the confidentiality of proprietary information received 
                from the other party. This obligation survives termination of our relationship.
              </p>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Services</h2>
              <p className="text-gray-700">
                We may use third-party services and tools to deliver our services. You are responsible 
                for complying with the terms of service of these third-party providers.
              </p>
            </section>

            {/* Indemnification */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Indemnification</h2>
              <p className="text-gray-700">
                You agree to indemnify and hold harmless DigitalPro and its employees from any claims, 
                damages, or expenses arising from your use of our services or violation of these terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Governing Law</h2>
              <p className="text-gray-700">
                These Terms and Conditions shall be governed by and construed in accordance with the 
                laws of the State of New York, without regard to its conflict of law provisions.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify clients of 
                significant changes via email or through our website.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
              <p className="text-gray-700 mb-2">
                For questions about these Terms and Conditions, please contact us:
              </p>
              <div className="text-gray-700 space-y-1">
                <p>Email: <a href="mailto:teckysolutions360@gmail.com" className="text-blue-600 hover:underline">legal@digitalpro.com</a></p>
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

export default Terms;