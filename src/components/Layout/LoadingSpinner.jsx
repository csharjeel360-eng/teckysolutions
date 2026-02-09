import React from 'react';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = 'temu-red',
  className = '',
  showBrand = false,
  brandText = 'teckysolutions'
}) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-10 h-10',
    large: 'w-16 h-16',
  };

  // Modern full-screen brand spinner
  if (showBrand) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex flex-col items-center justify-center z-50">
        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-cyan-600/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center gap-8">
          {/* Modern spinner container */}
          <div className="relative w-40 h-40 md:w-48 md:h-48">
            {/* Outer rotating ring */}
            <svg 
              className="absolute inset-0 w-full h-full animate-spin" 
              viewBox="0 0 100 100" 
              style={{ animationDuration: '3s' }}
            >
              <defs>
                <linearGradient id="outerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#outerGrad)"
                strokeWidth="2"
                strokeDasharray="60 40"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>

            {/* Middle rotating ring (reverse) */}
            <svg 
              className="absolute inset-4 w-32 h-32 md:w-40 md:h-40 animate-spin" 
              viewBox="0 0 100 100" 
              style={{ animationDuration: '2s', animationDirection: 'reverse' }}
            >
              <defs>
                <linearGradient id="midGrad" x1="100%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#0EA5E9" />
                </linearGradient>
              </defs>
              <circle
                cx="50"
                cy="50"
                r="35"
                fill="none"
                stroke="url(#midGrad)"
                strokeWidth="2"
                strokeDasharray="50 30"
                strokeLinecap="round"
                opacity="0.6"
              />
            </svg>

            {/* Center glow effect */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-20 h-20 md:w-24 md:h-24">
                {/* Glowing center */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full blur-lg opacity-60 animate-pulse"></div>
                <div className="absolute inset-2 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-md opacity-40"></div>
                {/* Center icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">✓</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern text section */}
          <div className="text-center space-y-6">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold uppercase tracking-wider bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent mb-2">
                {brandText}
              </h3>
              <div className="h-1 w-24 mx-auto bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"></div>
            </div>
            
            {/* Loading text with animation */}
            <div className="text-sm md:text-base text-gray-300 font-medium">
              <span className="inline-block">Loading</span>
              <span className="inline-flex gap-1 ml-1">
                <span className="animate-pulse">.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
              </span>
            </div>

            {/* Progress dots */}
            <div className="flex gap-3 justify-center pt-2">
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-bounce" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 animate-bounce" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes blob {
            0%, 100% { transform: translate(0, 0) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `}</style>
      </div>
    );
  }

  // Modern inline spinner
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin text-blue-500 ${sizeClasses[size]}`}
        style={{ animationDuration: '1.5s' }}
        viewBox="0 0 100 100"
        fill="none"
      >
        <defs>
          <linearGradient id="inlineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#inlineGrad)"
          strokeWidth="4"
          strokeDasharray="70 30"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default LoadingSpinner;
