import React from 'react';
import { ArrowRight } from 'lucide-react';

const HeroBanner = ({ 
  banners = [],
  autoPlay = true,
  interval = 5000,
  // mode: 'fade' (default) or 'slide'
  mode = 'fade',
  // if true, pick a random next slide each interval
  random = false
}) => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const containerRef = React.useRef(null);
  const [containerHeight, setContainerHeight] = React.useState(null);
  const [loadedMap, setLoadedMap] = React.useState({});

  React.useEffect(() => {
    if (!autoPlay || banners.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => {
        if (random) {
          // pick a different random index
          let next = prev;
          if (banners.length <= 1) return prev;
          while (next === prev) {
            next = Math.floor(Math.random() * banners.length);
          }
          return next;
        }

        // sequential
        return (prev + 1) % banners.length;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [banners.length, autoPlay, interval, random]);

  // Compute container height based on current image aspect ratio so full image is visible
  const computeHeightForIndex = (index) => {
    const banner = banners[index];
    if (!banner || !banner.image?.url || !containerRef.current) return;
    const img = new Image();
    img.src = banner.image.url;
    img.onload = () => {
      const containerWidth = containerRef.current.clientWidth || window.innerWidth;
      if (img.naturalWidth && img.naturalHeight && containerWidth) {
        const h = Math.ceil((containerWidth * img.naturalHeight) / img.naturalWidth);
        setContainerHeight(h);
      }
    };
    img.onerror = () => {
      // fallback: clear explicit height
      setContainerHeight(null);
    };
  };

  React.useEffect(() => {
    // compute on mount and when currentSlide changes
    computeHeightForIndex(currentSlide);

    const onResize = () => computeHeightForIndex(currentSlide);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [currentSlide, banners]);

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
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
              Welcome to ShopHub
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 opacity-90">
              Discover amazing products at unbelievable prices
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden w-full">
      {/* Banner Slides */}
      <div ref={containerRef} style={containerHeight ? { height: containerHeight + 'px' } : {}} className="relative w-full overflow-hidden">
        {mode === 'slide' ? (
          // Slide mode: render slides in a horizontal row and translate
          <div
            className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ width: `${banners.length * 100}%`, transform: `translateX(-${(currentSlide * 100) / banners.length}%)` }}
          >
            {banners.map((banner) => (
              <div key={banner._id} className="w-full" style={{ width: `${100 / banners.length}%` }}>
                <div className="relative w-full h-full">
                  <img
                    src={banner.image?.url || '/api/placeholder/1920/720'}
                    alt={banner.title || 'Banner image'}
                    className="w-full h-auto object-contain transition-opacity duration-700"
                    style={{ opacity: loadedMap[banner._id] ? 1 : 0 }}
                    onLoad={() => setLoadedMap(prev => ({ ...prev, [banner._id]: true }))}
                    onClick={() => handleBannerClick(banner)}
                  />

                  {/* Title overlay at top - visible immediately */}
                  <div className="absolute left-0 right-0 top-0 flex justify-center items-start pointer-events-none">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3 sm:pt-4">
                      <div className="max-w-3xl mx-auto text-center">
                        {typeof banner.title === 'string' && !/^https?:\/\//i.test(banner.title) && (
                          <h1 className="text-sm sm:text-base md:text-lg font-semibold text-white tracking-wide drop-shadow-md uppercase">
                            {banner.title}
                          </h1>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Fade mode (default): absolute stacked slides with opacity transitions
          banners.map((banner, index) => (
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
              <img
                src={banner.image?.url || '/api/placeholder/1920/720'}
                alt={banner.title || 'Banner image'}
                className="w-full h-auto object-contain transition-opacity duration-700"
                style={{ opacity: loadedMap[banner._id] ? 1 : 0 }}
                onLoad={() => setLoadedMap(prev => ({ ...prev, [banner._id]: true }))}
              />

              {/* Title overlay at top - visible immediately */}
              <div className="absolute left-0 right-0 top-0   flex justify-center items-start pointer-events-none">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-3 sm:pt-4">
                  <div className="max-w-3xl mx-auto text-center">
                    {typeof banner.title === 'string' && !/^https?:\/\//i.test(banner.title) && (
                      <h1 className="text-sm sm:text-base md:text-lg font-semibold text-black tracking-wide drop-shadow-md uppercase">
                        {banner.title}
                      </h1>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
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
      <div className="absolute top-1 right-4 z-10">
        <div className="bg-black/40 text-white text-[10px] px-1 py-0.5 rounded-md backdrop-blur-sm">
          Click to explore
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;