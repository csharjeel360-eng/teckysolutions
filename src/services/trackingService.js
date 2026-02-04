/**
 * Tracking Service
 * 
 * File: client/src/services/trackingService.js
 * Purpose: Frontend service to record analytics events and fetch analytics data
 */

// Resolve API base in a way that is safe for browser bundles (Vite uses import.meta.env)
let API_BASE = 'http://localhost:5000/api';
try {
  // Prefer Vite-provided env, then Node-style env (if available at build-time),
  // then a window override. Avoid using `typeof import` which can cause parse
  // issues in some bundlers.
  if (import.meta && import.meta.env && import.meta.env.VITE_API_URL) {
    API_BASE = import.meta.env.VITE_API_URL;
  } else if (typeof process !== 'undefined' && process.env && process.env.REACT_APP_API_URL) {
    API_BASE = process.env.REACT_APP_API_URL;
  } else if (typeof window !== 'undefined' && window.__API_BASE__) {
    API_BASE = window.__API_BASE__;
  }
} catch (e) {
  // If import.meta is not supported in this environment, keep default
}

const trackingService = {
  /**
   * Record view event when user opens listing
   */
  recordView: async (listingId, listingType = 'product') => {
    try {
      const response = await fetch(`${API_BASE}/tracking/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, listingType })
      });

      if (!response.ok) {
        console.warn('Failed to record view:', response.status);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to record view:', error);
      // Silently fail - don't disrupt user experience
      return { success: false };
    }
  },

  /**
   * Record click event (affiliate link, apply link, add to cart, buy)
   */
  recordClick: async (listingId, listingType = 'product', clickType) => {
    try {
      if (!clickType) {
        console.warn('clickType is required for recordClick');
        return { success: false };
      }

      const response = await fetch(`${API_BASE}/tracking/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ listingId, listingType, clickType })
      });

      if (!response.ok) {
        console.warn('Failed to record click:', response.status);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to record click:', error);
      return { success: false };
    }
  },

  /**
   * Record conversion (purchase, signup, application, etc)
   */
  recordConversion: async (
    listingId,
    listingType = 'product',
    conversionType,
    conversionValue = 0
  ) => {
    try {
      if (!conversionType) {
        console.warn('conversionType is required for recordConversion');
        return { success: false };
      }

      const response = await fetch(`${API_BASE}/tracking/conversion`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listingId,
          listingType,
          conversionType,
          conversionValue
        })
      });

      if (!response.ok) {
        console.warn('Failed to record conversion:', response.status);
      }
      return await response.json();
    } catch (error) {
      console.warn('Failed to record conversion:', error);
      return { success: false };
    }
  },

  /**
   * Get analytics for a specific listing
   */
  getListingAnalytics: async (listingId, startDate = null, endDate = null) => {
    try {
      const params = new URLSearchParams();
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);

      const url = `${API_BASE}/tracking/analytics/${listingId}${params ? '?' + params : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn('Failed to fetch listing analytics:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch listing analytics:', error);
      return null;
    }
  },

  /**
   * Get aggregate analytics across all listings
   */
  getAggregateAnalytics: async (type = null) => {
    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);

      const url = `${API_BASE}/tracking/analytics${params ? '?' + params : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        console.warn('Failed to fetch aggregate analytics:', response.status);
        return null;
      }

      return await response.json();
    } catch (error) {
      console.error('Failed to fetch aggregate analytics:', error);
      return null;
    }
  },

  /**
   * Format analytics for display
   */
  formatAnalytics: (analytics) => {
    if (!analytics) return null;

    const { listing, eventBreakdown } = analytics;
    return {
      views: listing?.views || 0,
      clicks: listing?.clicks || 0,
      conversions: listing?.conversions || 0,
      ctr: `${listing?.ctr || 0}%`,
      conversionRate: `${listing?.conversionRate || 0}%`,
      revenue: listing?.revenue || 0,
      eventBreakdown
    };
  }
};

export default trackingService;
