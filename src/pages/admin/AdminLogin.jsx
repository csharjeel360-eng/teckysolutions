import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Notification from '../../components/UI/Notification';

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { adminLogin, logout } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await adminLogin(credentials);
      if (result.success) {
        if (result.data.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else {
          setError('Access denied. Admin privileges required.');
          // Logout non-admin users who try to access admin login
          logout();
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">A</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Admin Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Access the admin dashboard
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Notification 
              type="error" 
              message={error}
              onClose={() => setError('')}
            />
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="Admin Email"
              name="email"
              type="email"
              value={credentials.email}
              onChange={handleChange}
              required
              autoComplete="email"
              placeholder="Enter admin email"
              className="bg-gray-700 border-gray-600 text-black"
            />
            
            <Input
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              required
              autoComplete="current-password"
              placeholder="Enter admin password"
              className="bg-gray-700 border-gray-600 text-black"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Sign in as Admin
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              ← Back to user login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
