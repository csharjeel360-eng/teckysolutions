import React from 'react';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../../components/Layout/LoadingSpinner';

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          <div className="p-8 text-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="w-28 h-28 mx-auto rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center text-white text-4xl font-extrabold mb-4">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">{user?.name}</h2>
            <a
              href={`mailto:${user?.email}`}
              className="mt-2 inline-block text-sm text-blue-600 hover:underline"
            >
              {user?.email}
            </a>
            <p className="mt-4 text-xs text-gray-500">Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
