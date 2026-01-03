import React from 'react';
import { 
  ShoppingBag, 
  Tag, 
  Users, 
  FileText, 
  TrendingUp, 
  DollarSign,
  Eye,
  ShoppingCart
} from 'lucide-react';

const DashboardStats = ({ stats }) => {
  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts || 0,
      icon: ShoppingBag,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Total Categories',
      value: stats?.totalCategories || 0,
      icon: Tag,
      color: 'bg-green-500',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-purple-500',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Total Blogs',
      value: stats?.totalBlogs || 0,
      icon: FileText,
      color: 'bg-orange-500',
      change: '+15%',
      trend: 'up'
    },
    {
      title: 'Monthly Revenue',
      value: `$${(stats?.monthlyRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: 'bg-green-500',
      change: '+20%',
      trend: 'up'
    },
    {
      title: 'Total Views',
      value: (stats?.totalViews || 0).toLocaleString(),
      icon: Eye,
      color: 'bg-indigo-500',
      change: '+25%',
      trend: 'up'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className={`flex items-center mt-2 ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">{stat.change}</span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`${stat.color} p-3 rounded-xl`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardStats;
