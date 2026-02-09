import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, DollarSign, Upload, BarChart } from 'lucide-react';

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Last updated: {new Date().getFullYear()}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          {/* Important Notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-orange-900 mb-2">Important Notice</h3>
                <p className="text-orange-800 text-sm">
                  By using TeckySolutions, you agree to these terms. Please read them carefully as they 
                  govern your use of our platform for discovering AI tools, reading reviews, and accessing tech resources.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing or using <strong>TeckySolutions</strong> ("Platform"), you agree to be bound by these 
              Terms of Service and our Privacy Policy. These terms apply to all users, readers, and visitors 
              who browse AI tools, read reviews, access blogs, and interact with our curated tech resources.
            </p>
          </section>

          {/* Account Registration */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Account Registration</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  1
                </div>
                <p className="text-gray-700">
                  You must be at least 13 years old to create an account and use our platform. Parental consent is required for users under 18.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  2
                </div>
                <p className="text-gray-700">
                  Provide accurate and complete information during registration and maintain its accuracy.
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5 flex-shrink-0">
                  3
                </div>
                <p className="text-gray-700">
                  You are responsible for maintaining the confidentiality of your account credentials.
                </p>
              </div>
            </div>
          </section>

          {/* User Conduct & Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Conduct & Responsibilities</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Upload className="w-5 h-5 text-[black] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Use of Platform Content</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Use reviews, comparisons, and resources for personal, non-commercial purposes</li>
                    <li>Do not republish or distribute our content without permission</li>
                    <li>Respect copyright and intellectual property of reviewed AI tools</li>
                    <li>Do not scrape or automate access to our platform</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BarChart className="w-5 h-5 text-[black] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Account & Comments</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Do not create multiple accounts to circumvent our policies</li>
                    <li>Do not post spam, harassment, or offensive content</li>
                    <li>Respect the tools and companies we review</li>
                    <li>Provide constructive feedback and avoid misinformation</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-[black] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Third-Party Links & Offers</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Our platform contains affiliate links to AI tools and SaaS platforms</li>
                    <li>We earn commissions when you use our links (at no extra cost to you)</li>
                    <li>We only recommend tools we believe are valuable</li>
                    <li>Review terms and conditions of linked services separately</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Prohibited Activities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Prohibited Activities</h2>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <ul className="text-gray-700 list-disc list-inside space-y-2">
                <li>Scraping, crawling, or automating access to our platform</li>
                <li>Distributing malware, viruses, or harmful content</li>
                <li>Hacking, phishing, or attempting unauthorized access</li>
                <li>Posting spam, harassment, hate speech, or illegal content</li>
                <li>Impersonating other users or misrepresenting your identity</li>
                <li>Circumventing security measures or terms of service</li>
                <li>Using content for illegal purposes or violating laws</li>
              </ul>
            </div>
          </section>

          {/* Affiliate Disclosure & Monetization */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Transparency & Affiliate Disclosure</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">How We Monetize</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Affiliate commissions from AI tools & SaaS links</li>
                  <li>• Sponsored content clearly marked</li>
                  <li>• No impact on your costs</li>
                  <li>• Transparent disclosure on all pages</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Our Commitment</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Honest, unbiased reviews</li>
                  <li>• Only recommend tools we trust</li>
                  <li>• Clearly disclose affiliate status</li>
                  <li>• No false claims or exaggerations</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Content & Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Content Ownership & Rights</h2>
            <p className="text-gray-700 mb-4">
              All reviews, comparisons, blog posts, and curated content on TeckySolutions are owned by us. 
              You may view and share content for personal use, but cannot republish or resell our content. 
              The AI tools and software reviewed maintain their own intellectual property rights.
            </p>
          </section>

          {/* Account Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Account Termination & Suspension</h2>
            <p className="text-gray-700">
              We may suspend or terminate your account for violations of these terms, including spam, harassment, 
              violations of intellectual property rights, or illegal activities. You may delete your account at any time 
              through your account settings. Upon termination, your personal data will be handled according to our Privacy Policy.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability & Disclaimers</h2>
            <p className="text-gray-700">
              TeckySolutions provides reviews and recommendations as informational resources only. We are not liable for:
            </p>
            <ul className="text-gray-700 list-disc list-inside space-y-2 mt-3">
              <li>Product quality, performance, or service issues from reviewed tools</li>
              <li>Outcomes or results from using recommended AI tools or software</li>
              <li>Technical issues or downtime on our platform</li>
              <li>Data loss, security breaches, or third-party platform failures</li>
              <li>Affiliate links or third-party website content</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Always review the terms and privacy policies of reviewed tools before use. We provide information but cannot guarantee outcomes.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><strong>Email:</strong> support@teckysolutions.com</p>
              <p className="text-gray-700"><strong>Legal:</strong> legal@teckysolutions.com</p>
              <p className="text-gray-700 text-sm mt-2">
                For questions about these terms, account issues, or copyright concerns, please contact us using the above information.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="border-t border-gray-200 pt-8 mt-8 flex justify-between">
            <Link to="/privacy-policy" className="text-black hover:text-gray-700 font-medium">
              ← Privacy Policy
            </Link>
            <Link to="/" className="text-black hover:text-gray-700 font-medium">
              Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
