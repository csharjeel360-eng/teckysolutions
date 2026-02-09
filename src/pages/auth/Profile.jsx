import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';
import { Mail, Calendar, Shield, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner showBrand={true} />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const memberSince = new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">My Profile</h1>
          <p className="text-gray-400">Manage your account information and settings</p>
        </div>

        {/* Main Profile Card */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
          {/* Banner Background */}
          <div className="h-32 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600"></div>

          {/* Profile Content */}
          <div className="px-6 sm:px-8 py-8">
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-6 -mt-20 mb-8">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-5xl font-extrabold shadow-lg border-4 border-gray-800">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-white">{user?.name}</h2>
                <p className="text-lg text-gray-400 mt-2">
                  {user?.role === 'admin' ? 'Administrator' : 'Member'}
                </p>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Email Card */}
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-400">Email Address</p>
                    <a
                      href={`mailto:${user?.email}`}
                      className="text-white font-medium hover:text-blue-400 transition-colors break-all"
                    >
                      {user?.email}
                    </a>
                  </div>
                </div>
              </div>

              {/* Member Since Card */}
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-purple-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Member Since</p>
                    <p className="text-white font-medium">{memberSince}</p>
                  </div>
                </div>
              </div>

              {/* Role Card */}
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-green-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Account Status</p>
                    <p className="text-white font-medium capitalize">
                      {user?.role === 'admin' ? 'Administrator' : 'Active Member'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Account ID */}
              <div className="bg-gray-700/50 border border-gray-600 rounded-lg p-4 hover:bg-gray-700/70 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 text-pink-400 mt-1 flex-shrink-0 text-sm font-bold">#</div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-gray-400">Account ID</p>
                    <p className="text-white font-mono text-sm break-all">{user?._id?.substring(0, 12)}...</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => navigate('/settings')}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                Edit Profile
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 border border-red-500/30"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gray-800 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            This is your personal profile page. Here you can view your account details and manage your profile settings. 
            Keep your information up to date to ensure the best experience.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
