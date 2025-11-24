import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/UI/Button';

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don't have permission to access this page.
        </p>
        <div className="space-y-3">
          <Link to="/">
            <Button>Go Home</Button>
          </Link>
          <Link to="/admin/login">
            <Button variant="outline">Admin Login</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;