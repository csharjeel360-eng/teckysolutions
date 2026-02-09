/**
 * Admin Analytics Dashboard Component
 * 
 * File: client/src/pages/admin/AnalyticsDashboard.jsx
 * Purpose: Display analytics summary across all listings
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Eye, MousePointer, ShoppingCart, Loader } from 'lucide-react';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/analytics/summary');
      const data = await response.json();
      
      if (data.success) {
        setAnalytics(data.data);
      } else {
        setError('Failed to load analytics');
      }
    } catch (err) {
      setError('Failed to load analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner size="large" text="Loading analytics..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const stats = analytics.total;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Overall platform performance and metrics</p>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Listings */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Listings</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.listings}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Views</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.views.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          {/* Total Clicks */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Clicks</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.clicks.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <MousePointer className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          {/* Total Conversions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Conversions</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.conversions.toLocaleString()}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* CTR */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Click-Through Rate (CTR)</p>
            <p className="text-4xl font-bold text-blue-600">{stats.ctr}%</p>
            <p className="text-gray-600 text-sm mt-3">
              {stats.clicks} clicks out of {stats.views.toLocaleString()} views
            </p>
            <div className="mt-4 bg-blue-50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-blue-600 h-full"
                style={{ width: `${Math.min(stats.ctr, 100)}%` }}
              />
            </div>
          </div>

          {/* Conversion Rate */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Conversion Rate</p>
            <p className="text-4xl font-bold text-purple-600">{stats.conversionRate}%</p>
            <p className="text-gray-600 text-sm mt-3">
              {stats.conversions} conversions out of {stats.clicks.toLocaleString()} clicks
            </p>
            <div className="mt-4 bg-purple-50 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-purple-600 h-full"
                style={{ width: `${Math.min(stats.conversionRate, 100)}%` }}
              />
            </div>
          </div>

          {/* Average Views per Listing */}
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600 text-sm font-medium mb-2">Avg Views per Listing</p>
            <p className="text-4xl font-bold text-green-600">
              {stats.listings > 0 ? Math.round(stats.views / stats.listings) : 0}
            </p>
            <p className="text-gray-600 text-sm mt-3">
              Total {stats.views.toLocaleString()} ÷ {stats.listings} listings
            </p>
            <div className="mt-4 bg-green-50 rounded-full h-2 overflow-hidden">
              <div className="bg-green-600 h-full" style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Breakdown by Type */}
        <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Performance by Listing Type</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Products */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg border border-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                <h3 className="font-semibold text-blue-900">Products</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-blue-700">Count:</span>
                  <span className="font-semibold text-blue-900">{analytics.byType.product.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Views:</span>
                  <span className="font-semibold text-blue-900">{analytics.byType.product.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Clicks:</span>
                  <span className="font-semibold text-blue-900">{analytics.byType.product.clicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Conversions:</span>
                  <span className="font-semibold text-blue-900">{analytics.byType.product.conversions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Tools */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg border border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
                <h3 className="font-semibold text-green-900">Software Tools</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-green-700">Count:</span>
                  <span className="font-semibold text-green-900">{analytics.byType.tool.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Views:</span>
                  <span className="font-semibold text-green-900">{analytics.byType.tool.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Clicks:</span>
                  <span className="font-semibold text-green-900">{analytics.byType.tool.clicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Conversions:</span>
                  <span className="font-semibold text-green-900">{analytics.byType.tool.conversions.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Jobs */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-lg border border-purple-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                <h3 className="font-semibold text-purple-900">Job Listings</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-purple-700">Count:</span>
                  <span className="font-semibold text-purple-900">{analytics.byType.job.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Views:</span>
                  <span className="font-semibold text-purple-900">{analytics.byType.job.views.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Clicks:</span>
                  <span className="font-semibold text-purple-900">{analytics.byType.job.clicks.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Conversions:</span>
                  <span className="font-semibold text-purple-900">{analytics.byType.job.conversions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={loadAnalytics}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
