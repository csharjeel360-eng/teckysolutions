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
            <div className="w-16 h-16 bg-gradient-to-r from-[#2563eb] to-[#f97316] rounded-full flex items-center justify-center">
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
                  By using our affiliate platform, you agree to these terms. Please read them carefully as they 
                  govern your use of our services for uploading and promoting affiliate products.
                </p>
              </div>
            </div>
          </div>

          {/* Agreement */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-700">
              By accessing or using <strong>AffiliateHub</strong> ("Platform"), you agree to be bound by these 
              Terms of Service and our Privacy Policy. These terms apply to all affiliates, merchants, and users 
              who upload, promote, or manage products through our platform.
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
                  You must be at least 18 years old to create an account and use our affiliate platform.
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

          {/* Affiliate Responsibilities */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Affiliate Responsibilities</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <Upload className="w-5 h-5 text-[#2563eb] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Product Upload Guidelines</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Only upload products you are authorized to promote</li>
                    <li>Provide accurate product descriptions and pricing</li>
                    <li>Ensure all product images and content are legally compliant</li>
                    <li>Disclose affiliate relationships as required by law</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <BarChart className="w-5 h-5 text-[#2563eb] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Promotional Activities</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Comply with all applicable advertising laws and regulations</li>
                    <li>Do not engage in spam, misleading claims, or deceptive practices</li>
                    <li>Respect intellectual property rights of merchants and brands</li>
                    <li>Maintain truthful and accurate performance reporting</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <DollarSign className="w-5 h-5 text-[#2563eb] mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Commission & Payments</h3>
                  <ul className="text-gray-700 list-disc list-inside space-y-1">
                    <li>Commissions are paid according to merchant agreements</li>
                    <li>Provide accurate payment and tax information</li>
                    <li>Report all earned commissions as required by tax laws</li>
                    <li>Understand that commission rates may change based on merchant terms</li>
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
                <li>Uploading counterfeit, illegal, or prohibited products</li>
                <li>Engaging in cookie stuffing or other fraudulent tracking methods</li>
                <li>Using automated bots or scripts to generate fake traffic</li>
                <li>Promoting products through spam or unsolicited communications</li>
                <li>Infringing on intellectual property rights</li>
                <li>Misrepresenting product features or benefits</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </div>
          </section>

          {/* Commission Structure */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Commission & Payments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-900 mb-2">Commission Earnings</h3>
                <ul className="text-green-800 text-sm space-y-1">
                  <li>• Commissions based on merchant terms</li>
                  <li>• Tracked through our platform</li>
                  <li>• Paid according to schedule</li>
                  <li>• Subject to minimum thresholds</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Payment Terms</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• Monthly or bi-weekly payments</li>
                  <li>• Multiple payment methods available</li>
                  <li>• Tax documentation required</li>
                  <li>• 30-day refund period affects commissions</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Intellectual Property */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Intellectual Property</h2>
            <p className="text-gray-700 mb-4">
              You retain rights to your original content, but grant us a license to display and distribute 
              your product listings through our platform. You are responsible for ensuring you have proper 
              rights to all content you upload.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Termination</h2>
            <p className="text-gray-700">
              We may suspend or terminate your account for violations of these terms, fraudulent activities, 
              or at our discretion. Upon termination, you must cease using our platform and we may withhold 
              unpaid commissions if terms are violated.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700">
              AffiliateHub is not liable for merchant disputes, product quality issues, or commission 
              disputes between affiliates and merchants. We provide the platform but do not guarantee 
              earnings or product performance.
            </p>
          </section>

          {/* Contact */}
          <section className="border-t border-gray-200 pt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-700"><strong>Email:</strong> legal@affiliatehub.com</p>
              <p className="text-gray-700"><strong>Address:</strong> 123 Affiliate Street, Digital City, DC 12345</p>
              <p className="text-gray-700 text-sm mt-2">
                For legal notices or copyright infringement claims, please use the above contact information.
              </p>
            </div>
          </section>

          {/* Navigation */}
          <div className="border-t border-gray-200 pt-8 mt-8 flex justify-between">
            <Link to="/privacy" className="text-[#2563eb] hover:text-[#1e40af] font-medium">
              ← Privacy Policy
            </Link>
            <Link to="/" className="text-[#2563eb] hover:text-[#1e40af] font-medium">
              Back to Home →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;