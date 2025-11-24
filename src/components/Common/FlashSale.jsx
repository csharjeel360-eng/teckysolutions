import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, ArrowRight, Calendar } from 'lucide-react';

const FlashSale = ({ 
  title = "MONTHLY FLASH SALE",
  subtitle = "Limited time offers - Ends this month!",
  buttonText = "Shop Now",
  buttonLink = "/products?flash=true"
}) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [saleProgress, setSaleProgress] = useState(0);
  const [saleActive, setSaleActive] = useState(true);

  // Get current month start and end dates
  const getMonthlySalePeriod = () => {
    const now = new Date();
    const timezoneOffset = now.getTimezoneOffset() * 60000; // Convert to milliseconds
    
    // Start of current month (1st day)
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // End of current month (last day, 23:59:59)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    
    return { start: startOfMonth.getTime(), end: endOfMonth.getTime() };
  };

  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const { start, end } = getMonthlySalePeriod();
    
    // Check if we're in the current month's sale period
    if (now < start) {
      // Sale hasn't started yet (shouldn't happen with monthly cycle)
      return { days: 0, hours: 0, minutes: 0, seconds: 0, active: false };
    }
    
    if (now > end) {
      // Sale ended, will automatically restart next month
      return { days: 0, hours: 0, minutes: 0, seconds: 0, active: false };
    }

    const difference = end - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return { days, hours, minutes, seconds, active: true };
  };

  const calculateSaleProgress = () => {
    const now = new Date().getTime();
    const { start, end } = getMonthlySalePeriod();
    const totalDuration = end - start;
    const elapsed = now - start;
    
    // Calculate progress percentage (0-100)
    const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    return Math.round(progress);
  };

  const getDaysInMonth = () => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  };

  const getCurrentDay = () => {
    return new Date().getDate();
  };

  useEffect(() => {
    // Initialize immediately
    const timeData = calculateTimeLeft();
    setTimeLeft(timeData);
    setSaleActive(timeData.active);
    setSaleProgress(calculateSaleProgress());

    const timer = setInterval(() => {
      const timeData = calculateTimeLeft();
      setTimeLeft(timeData);
      setSaleActive(timeData.active);
      setSaleProgress(calculateSaleProgress());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toString().padStart(2, '0');
  };

  // Don't show if sale is not active (shouldn't happen with monthly cycle)
  if (!saleActive) {
    return null;
  }

  const daysInMonth = getDaysInMonth();
  const currentDay = getCurrentDay();
  const daysLeft = daysInMonth - currentDay;

  return (
    <div className="bg-gradient-to-r from-[#2563eb] to-[#f97316] text-black rounded-lg sm:rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 mx-2 sm:mx-0">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Sale Info */}
        <div className="flex items-center space-x-2 sm:space-x-3 w-full lg:w-auto justify-center lg:justify-start">
          <div className="bg-white bg-opacity-20 p-1.5 sm:p-2 rounded-lg sm:rounded-xl">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300" />
          </div>
          <div className="text-center lg:text-left">
            <h3 className="text-sm sm:text-lg font-bold">{title}</h3>
            <p className="text-white text-opacity-90 text-xs sm:text-sm">{subtitle}</p>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="flex items-center space-x-1 sm:space-x-2 w-full lg:w-auto justify-center">
          {/* Days */}
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded sm:rounded-lg p-1.5 sm:p-2 min-w-10 sm:min-w-12">
              <div className="text-base sm:text-lg font-bold font-mono">
                {formatTime(timeLeft.days)}
              </div>
              <div className="text-[10px] sm:text-xs text-black text-opacity-90">DAYS</div>
            </div>
          </div>
          
          <div className="text-base sm:text-lg font-bold text-yellow-300 hidden xs:block">:</div>
          
          {/* Hours */}
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded sm:rounded-lg p-1.5 sm:p-2 min-w-10 sm:min-w-12">
              <div className="text-base sm:text-lg font-bold font-mono">
                {formatTime(timeLeft.hours)}
              </div>
              <div className="text-[10px] sm:text-xs text-black text-opacity-90">HRS</div>
            </div>
          </div>
          
          <div className="text-base sm:text-lg font-bold text-yellow-300 hidden xs:block">:</div>
          
          {/* Minutes */}
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded sm:rounded-lg p-1.5 sm:p-2 min-w-10 sm:min-w-12">
              <div className="text-base sm:text-lg font-bold font-mono">
                {formatTime(timeLeft.minutes)}
              </div>
              <div className="text-[10px] sm:text-xs text-black text-opacity-90">MIN</div>
            </div>
          </div>
          
          <div className="text-base sm:text-lg font-bold text-yellow-300 hidden xs:block">:</div>
          
          {/* Seconds */}
          <div className="text-center">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded sm:rounded-lg p-1.5 sm:p-2 min-w-10 sm:min-w-12">
              <div className="text-base sm:text-lg font-bold font-mono">
                {formatTime(timeLeft.seconds)}
              </div>
              <div className="text-[10px] sm:text-xs text-black text-opacity-90">SEC</div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={buttonLink}
          className="bg-white text-[#f97316] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 flex items-center space-x-1 text-xs sm:text-sm hover:scale-105 w-full lg:w-auto justify-center"
        >
          <span>{buttonText}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Progress Bar & Month Info */}
      <div className="mt-2 sm:mt-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center space-x-1 text-white text-opacity-90">
            <Calendar className="w-3 h-3" />
            <span>Month Progress</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-black text-opacity-90">
              Day {currentDay} of {daysInMonth}
            </span>
            <span className="font-semibold">{saleProgress}%</span>
          </div>
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-1.5">
          <div 
            className="bg-yellow-300 h-1.5 rounded-full transition-all duration-1000"
            style={{ width: `${saleProgress}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-[10px] sm:text-xs text-white text-opacity-80 mt-1">
          <span>Month Start</span>
          <span>{daysLeft} days left</span>
          <span>Month End</span>
        </div>
      </div>
    </div>
  );
};

export default FlashSale;