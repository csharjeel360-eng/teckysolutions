import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';

const ServiceCard = ({ service }) => {
  return (
    <Link to={`/services/${service.slug}`} className="group block h-full">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden h-full flex flex-col hover:scale-105 border border-white/10">
        {/* Service Icon/Image - fixed height to match listing cards */}
        <div className="h-40 bg-gradient-to-br from-blue-600 to-cyan-500 overflow-hidden flex items-center justify-center flex-shrink-0">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          {/* Icon & Title */}
          <div className="mb-3">
            <div className="text-3xl mb-2">{service.icon}</div>
            <h3 className="text-lg font-semibold text-gray-100 group-hover:text-blue-400 transition-colors">
              {service.name}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm mb-4 flex-grow">
            {service.shortDescription}
          </p>

          {/* Features Preview */}
          <div className="mb-4 space-y-2">
            {service.features.slice(0, 3).map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                <CheckCircle size={16} className="text-blue-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
            {service.features.length > 3 && (
              <p className="text-sm text-blue-400 font-semibold">
                +{service.features.length - 3} more features
              </p>
            )}
          </div>

          {/* Price & Delivery */}
          <div className="border-t border-white/10 pt-4 mb-4 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Price:</span>
              <span className="font-semibold text-gray-100">{service.price}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400">Delivery:</span>
              <span className="font-semibold text-gray-100">{service.deliveryTime}</span>
            </div>
          </div>

          {/* CTA Button */}
          <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2 group-hover:gap-3">
            Learn More
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
