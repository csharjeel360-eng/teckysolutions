import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroBanner = ({ 
  banners = [],
  autoPlay = true,
  interval = 5000 
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);

  React.useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlay, interval]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleBannerClick = (banner) => {
    if (banner.externalLink) {
      window.open(banner.externalLink, '_blank', 'noopener,noreferrer');
    } else if (banner.buttonLink) {
      window.open(banner.buttonLink, '_blank', 'noopener,noreferrer');
    }
  };

  if (banners.length === 0) {
    return (
      <div className="relative w-full bg-gradient-to-r from-[#2563eb] to-[#f97316] text-white">
        <div className="w-full aspect-[16/9] sm:aspect-[16/6] min-h-[180px] sm:min-h-[300px] flex items-center justify-center">
          <div className="max-w-6xl mx-auto px-4 text-center">
            {/* Title and subtitle intentionally hidden */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full">
      {/* Banner Slides */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[16/6] min-h-[180px] sm:min-h-[400px] md:min-h-[500px]">
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            role="group"
            aria-roledescription="slide"
            aria-hidden={index === currentSlide ? 'false' : 'true'}
            onClick={() => index === currentSlide && handleBannerClick(banner)}
            className={`absolute inset-0 transition-opacity duration-500 ${
              index === currentSlide ? 'opacity-100 z-0 cursor-pointer' : 'opacity-0 pointer-events-none -z-10'
            }`}
          >
            {/* Full-width Background Image - lazy loaded for performance */}
            <img
              src={banner.image?.url || '/api/placeholder/1920/720'}
              alt={banner.title || 'Banner image'}
              className="w-full h-full object-contain sm:object-cover object-center max-w-full max-h-full"
              loading="lazy"
              decoding="async"
            />

            {/* Banner Content - Bottom Aligned */}
            <div className="absolute inset-0 flex items-end">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pb-6 sm:pb-8 md:pb-12">
                <div className="max-w-3xl">
                  {/* Title and subtitle intentionally hidden */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 z-10"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 rotate-180" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 sm:p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 z-10"
          >
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </>
      )}

      {/* Slide Indicators */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                index === currentSlide
                  ? 'bg-[#f97316] scale-125'
                  : 'bg-white/60 hover:bg-white/80'
              }`}
            />
          ))}
        </div>
      )}

      {/* Click Hint */}
      <div className="absolute top-3 right-3 z-10">
        <div className="bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          Click to explore
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;