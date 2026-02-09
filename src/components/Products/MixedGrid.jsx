// components/Products/MixedGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { createSlug } from '../../utils/slugify';
import { ExternalLink, Award } from 'lucide-react';

const MixedGrid = ({ 
  products = [], 
  offers = [],
  onProductClick,
  className = ''
}) => {
  // Create interleaved array: 2 offers, 6 products, repeat
  const createInterleavedList = () => {
    const interleavedList = [];
    let offerIndex = 0;
    let productIndex = 0;

    while (offerIndex < offers.length || productIndex < products.length) {
      // Add up to 2 offers
      const offersToAdd = Math.min(2, offers.length - offerIndex);
      for (let i = 0; i < offersToAdd; i++) {
        interleavedList.push({
          type: 'offer',
          data: offers[offerIndex++]
        });
      }

      // Add up to 6 products
      const productsToAdd = Math.min(6, products.length - productIndex);
      for (let i = 0; i < productsToAdd; i++) {
        interleavedList.push({
          type: 'product',
          data: products[productIndex++]
        });
      }
    }

    return interleavedList;
  };

  const interleavedItems = createInterleavedList();

  if (interleavedItems.length === 0) return null;

  return (
    <div className={className}>
      {interleavedItems.map((item, idx) => {
        if (item.type === 'offer') {
          const offer = item.data;
          return (
            <div
                key={`offer-${offer._id}`}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-white/10 h-full flex flex-col"
              >
              {/* Image */}
              <div className="h-40 bg-gray-700 overflow-hidden flex items-center justify-center">
                {offer.thumbnail || (offer.images && offer.images.length > 0) ? (
                  <img
                    src={offer.thumbnail || offer.images[0]?.url}
                    alt={offer.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
                    <Award className="text-gray-300 opacity-50" size={48} />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                {/* Badge */}
                <div className="inline-flex items-center gap-1 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                  <Award size={14} /> Offer
                </div>

                {/* Title */}
                <h3 className="font-bold text-gray-100 line-clamp-2 leading-tight text-sm">
                  {offer.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-gray-300 line-clamp-2">
                  {offer.description}
                </p>

                {/* CTA Button */}
                <a
                  href={offer.trackingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-2 px-3 rounded transition-all duration-300 text-sm"
                >
                  Visit Now
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          );
        } else {
          const product = item.data;
          const type = product.type || 'product';
          let dest = `/product/${product.slug || createSlug(product._id, product.title)}`;
          if (type === 'tool') dest = `/software/${product.slug || createSlug(product._id, product.title)}`;
          if (type === 'job') dest = `/job/${product.slug || createSlug(product._id, product.title)}`;
          if (type === 'offer') dest = `/offer/${product._id}`;

          return (
              <Link
              key={`product-${product._id}`}
              to={dest}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group block h-full flex flex-col border border-white/10"
              onClick={() => onProductClick && onProductClick(product)}
            >
              {/* Thumbnail */}
              <div className="h-40 bg-gray-700 overflow-hidden">
                <img
                  src={product.images?.[0]?.url || '/api/placeholder/300/300'}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <h3 className="font-semibold text-gray-100 text-sm mb-2 line-clamp-2 group-hover:text-blue-400 transition-colors">
                  {product.title}
                </h3>

                {product.description && (
                  <p className="text-gray-300 text-xs line-clamp-2">
                    {product.description}
                  </p>
                )}
              </div>
            </Link>
          );
        }
      })}
    </div>
  );
};

export default MixedGrid;
