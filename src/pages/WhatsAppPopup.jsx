 // src/components/WhatsAppSticky.jsx
import React from 'react';

const WhatsAppPopup = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+923259579107'; // Replace with your actual WhatsApp number
    const message = 'Hello! I would like to get more information about your services.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="fixed bottom-25 right-6 z-50">
      {/* WhatsApp Button */}
      <button
        onClick={handleWhatsAppClick}
        className="group relative"
        aria-label="Chat on WhatsApp"
      >
        {/* Floating Notification Badge */}
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white text-xs font-bold">1</span>
        </div>

        {/* Main Button */}
        <div className="w-14 h-14 bg-green-500 rounded-full shadow-2xl flex items-center justify-center hover:bg-green-600 transition-all duration-300 transform hover:scale-110 group-hover:rotate-12">
          <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893c0-3.189-1.248-6.189-3.515-8.464"/>
          </svg>
        </div>

        {/* Tooltip that's always visible on hover */}
        <div className="absolute right-16 top-1/2 transform -translate-y-1/2 bg-gray-900 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
          Chat with us on WhatsApp
          {/* Tooltip arrow */}
          <div className="absolute top-1/2 right-0 transform translate-x-1 -translate-y-1/2">
            <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
          </div>
        </div>
      </button>
    </div>
  );
};

export default WhatsAppPopup;