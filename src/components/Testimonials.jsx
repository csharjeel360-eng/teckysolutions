 // src/components/Testimonials.jsx
import React, { useState, useEffect } from 'react';

const Testimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: 'Ali Hassan',
      company: 'TechGrowth Inc.',
      role: 'Marketing Director',
      rating: 5,
      text: 'DigitalPro completely transformed our online presence. Our website traffic increased by 300% and our conversion rates have never been better. Their SEO strategies are simply outstanding!',
      service: 'SEO Optimization',
      results: ['300% traffic increase', '45% higher conversions', 'Page 1 Google rankings']
    },
    {
      id: 2,
      name: 'Abdul Rehman',
      company: 'FashionHub',
      role: 'E-commerce Manager',
      rating: 5,
      text: 'The Shopify store they built for us is incredible. Sales increased by 180% in the first month alone. The attention to detail and user experience is exceptional.',
      service: 'Shopify Development',
      results: ['180% sales increase', 'Mobile-first design', 'Seamless checkout']
    },
    {
      id: 3,
      name: 'Bilal Ahmed',
      company: 'HealthWell Clinic',
      role: 'Practice Manager',
      rating: 5,
      text: 'Our website was outdated and slow. DigitalPro not only made it beautiful but also incredibly fast. Patient inquiries have increased significantly since the relaunch.',
      service: 'Website Cleaning & Redesign',
      results: ['85% faster load times', '40% more inquiries', 'Modern responsive design']
    },
    {
      id: 4,
      name: 'kashif Khan',
      company: 'Local Builders Co.',
      role: 'Business Owner',
      rating: 5,
      text: 'The digital marketing campaign they created brought us qualified leads we never thought possible. ROI was achieved within the first 60 days. Highly recommended!',
      service: 'Digital Marketing',
      results: ['200+ qualified leads', '60-day ROI', 'Multi-channel strategy']
    },
    {
      id: 5,
      name: 'Aisha Malik',
      company: 'Creative Studio',
      role: 'Creative Director',
      rating: 5,
      text: 'Working with DigitalPro was a game-changer. They understood our vision and delivered beyond expectations. The ongoing support and maintenance have been invaluable.',
      service: 'Full Service Package',
      results: ['Complete brand alignment', 'Ongoing support', 'Scalable solutions']
    }
  ];

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      nextTestimonial();
    }, 5000); // Change testimonial every 5 seconds

    return () => clearInterval(interval);
  }, [activeTestimonial]);

  const nextTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const prevTestimonial = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setActiveTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const goToTestimonial = (index) => {
    if (isAnimating || index === activeTestimonial) return;
    
    setIsAnimating(true);
    setActiveTestimonial(index);
    
    // Reset animation state after transition
    setTimeout(() => setIsAnimating(false), 300);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
            What Our Clients Say
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our clients have to say 
            about their experience working with us.
          </p>
        </div>

        {/* Main Testimonial Display with Slide Animation */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 relative overflow-hidden">
            {/* Quote Icon */}
            <div className="absolute top-6 left-6 text-blue-100 text-6xl">
              "
            </div>
            
            {/* Testimonial Content with Slide Animation */}
            <div 
              className={`relative z-10 transition-all duration-300 transform ${
                isAnimating ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
              }`}
              key={activeTestimonial} // This key forces re-render and enables animation
            >
              <div className="flex flex-col md:flex-row items-start mb-6">
                {/* Client Avatar */}
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                    {testimonials[activeTestimonial].name.charAt(0)}
                  </div>
                </div>

                {/* Client Info */}
                <div className="flex-grow text-center md:text-left">
                  <div className="flex justify-center md:justify-start items-center mb-2">
                    {renderStars(testimonials[activeTestimonial].rating)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {testimonials[activeTestimonial].name}
                  </h3>
                  <p className="text-gray-600">
                    {testimonials[activeTestimonial].role}, {testimonials[activeTestimonial].company}
                  </p>
                  <div className="mt-2">
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {testimonials[activeTestimonial].service}
                    </span>
                  </div>
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed italic mb-8 text-center md:text-left">
                "{testimonials[activeTestimonial].text}"
              </blockquote>

              {/* Results */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-semibold text-gray-900 mb-4 text-center md:text-left">Key Results Achieved:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {testimonials[activeTestimonial].results.map((result, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-700 justify-center md:justify-start">
                      <svg className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{result}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={prevTestimonial}
              disabled={isAnimating}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              disabled={isAnimating}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white shadow-lg rounded-full p-3 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Testimonial Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToTestimonial(index)}
                disabled={isAnimating}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                } ${isAnimating ? 'cursor-not-allowed' : 'cursor-pointer'}`}
              />
            ))}
          </div>
        </div>

        {/* Additional Mini Testimonials */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                index === activeTestimonial ? 'border-2 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center mb-4">
                {renderStars(testimonial.rating)}
              </div>
              <p className="text-gray-600 mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-md">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.company}</div>
                  <div className="text-xs text-blue-600 font-medium mt-1">{testimonial.service}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-8 text-lg font-medium">Trusted by businesses worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-12 opacity-70">
            {['Google', 'Shopify', 'Microsoft', 'Amazon', 'Facebook', 'Instagram'].map((brand, index) => (
              <div 
                key={brand}
                className="text-gray-500 font-semibold text-lg hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              >
                {brand}
              </div>
            ))}
          </div>
        </div>

        {/* Progress Bar for Auto-slide */}
        <div className="mt-8 max-w-md mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-1">
            <div 
              className="bg-blue-600 h-1 rounded-full transition-all duration-1000 ease-linear"
              style={{ width: `${((activeTestimonial + 1) / testimonials.length) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;