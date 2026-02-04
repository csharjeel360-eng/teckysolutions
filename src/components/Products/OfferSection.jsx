import React, { useState, useEffect } from 'react';
import { offersAPI } from '../../services/api';
import { ExternalLink, Award } from 'lucide-react';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const OfferSection = ({ categoryId, listingId }) => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (categoryId) {
      loadOffers();
    }
  }, [categoryId]);

  const loadOffers = async () => {
    try {
      setLoading(true);
      const response = await offersAPI.getByCategory(categoryId);
      setOffers(response.data.data || []);
    } catch (err) {
      console.error('Error loading offers:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  if (!categoryId) return null;
  if (loading) return <LoadingSpinner />;
  if (!offers || offers.length === 0) return null;

  return (
    <section className="mt-12 mb-8">
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Award className="text-amber-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-900">Related Offers</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
              {offer.thumbnail || (offer.images && offer.images.length > 0) ? (
                <img
                  src={offer.thumbnail || offer.images[0]?.url}
                  alt={offer.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Award className="text-white opacity-50" size={48} />
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-5 space-y-4">
              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight">
                {offer.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3">
                {offer.description}
              </p>

              {/* CTA Button */}
              <a
                href={offer.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
              >
                Visit Now
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfferSection;

