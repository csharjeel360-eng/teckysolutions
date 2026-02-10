import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { offersAPI } from '../../services/api';
import { ExternalLink, Award } from 'lucide-react';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import Button from '../UI/Button';

const OfferSection = ({ 
  categoryId, 
  listingId, 
  offers: initialOffers, 
  showExploreButton = false,
  exploreButtonText = 'Explore Offers',
  exploreButtonLink = '/category/offers/listings'
}) => {
  const [offers, setOffers] = useState(initialOffers || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If initial offers were provided, don't fetch. Otherwise fetch by category or load all.
    if (initialOffers && initialOffers.length > 0) return;
    // Priority: listingId (offers linked to a listing) -> categoryId -> all
    if (listingId) {
      loadOffersByListing();
    } else if (categoryId) {
      loadOffersByCategory();
    } else {
      // If no listingId/categoryId and no initialOffers, fetch all offers for general listings
      loadAllOffers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId, initialOffers]);

  const loadOffersByCategory = async () => {
    try {
      setLoading(true);
      const response = await offersAPI.getByCategory(categoryId);
      setOffers(response.data.data || []);
    } catch (err) {
      console.error('Error loading offers by category:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const loadAllOffers = async () => {
    try {
      setLoading(true);
      const response = await offersAPI.getAll({ limit: 24 });
      setOffers(response.data.data || []);
    } catch (err) {
      console.error('Error loading all offers:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  const loadOffersByListing = async () => {
    try {
      setLoading(true);
      // Use listing query param supported by server
      const response = await offersAPI.getAll({ listing: listingId, limit: 24 });
      setOffers(response.data.data || []);
    } catch (err) {
      console.error('Error loading offers by listing:', err);
      setError('Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!offers || offers.length === 0) return null;

  return (
    <section className="mt-12 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {offers.map((offer) => (
          <div
            key={offer._id}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 h-full flex flex-col"
          >
            {/* Image */}
            <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center flex-shrink-0">
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
            <div className="p-5 flex flex-col flex-1">
              {/* Title */}
              <h3 className="font-bold text-lg text-gray-900 line-clamp-2 leading-tight mb-2">
                {offer.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-3 mb-4 flex-1">
                {offer.description}
              </p>

              {/* CTA Button */}
              <a
                href={offer.trackingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                Visit Now
                <ExternalLink size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {showExploreButton && (
        <div className="text-center mt-8">
          <Link to={exploreButtonLink} className="cursor-pointer">
            <Button variant="primary" className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 cursor-pointer transition-all">
              {exploreButtonText}
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default OfferSection;

