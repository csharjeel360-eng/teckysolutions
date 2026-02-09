// pages/auth/UserSignup.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Notification from '../../components/UI/Notification';

const UserSignup = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setUserData({
      ...userData,
      [e.target.name]: value
    });
  };

  const validateForm = () => {
    if (userData.password !== userData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (userData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (!userData.acceptTerms) {
      setError('Please accept the terms and conditions');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const result = await signup({
        name: userData.name,
        email: userData.email,
        password: userData.password
      });
      
      if (result.success) {
        // After creating a new account, redirect user to login page
        navigate('/login');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setGoogleLoading(true);
      setError('');
      
      const result = await loginWithGoogle();
      
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Google sign in failed. Please try again.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Hero Banner */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('/homeherobanner/futuristic-tech-hero-banner-dark-blue-teal.jpeg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      <div className="relative z-10">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-6">
            <img 
              src="logos/Tecky Logo Design (1).png" 
              alt="TeckySolutions Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Or{' '}
            <Link
              to="/login"
              className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-gray-900 border border-blue-500/20 py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            {error && (
              <Notification 
                type="error" 
                message={error}
                onClose={() => setError('')}
              />
            )}
            
            {/* Google Sign In Button */}
            <div className="mb-6">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleSignIn}
                loading={googleLoading}
                className="w-full flex items-center justify-center gap-3 border-blue-500/30 bg-gray-800 text-white hover:bg-gray-700 transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Continue with Google</span>
              </Button>
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-blue-500/20" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-900 text-gray-400">Or continue with email</span>
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <Input
                label="Full Name"
                name="name"
                type="text"
                value={userData.name}
                onChange={handleChange}
                dark={true}
                required
                autoComplete="name"
                placeholder="Enter your full name"
              />
              
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                dark={true}
                required
                autoComplete="email"
                placeholder="Enter your email address"
              />
              
              <Input
                label="Password"
                name="password"
                type="password"
                value={userData.password}
                onChange={handleChange}
                dark={true}
                required
                autoComplete="new-password"
                placeholder="Create a password (min. 6 characters)"
              />
              
              <Input
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={userData.confirmPassword}
                onChange={handleChange}
                dark={true}
                required
                autoComplete="new-password"
                placeholder="Confirm your password"
              />

              <div className="flex items-center">
                <input
                  id="acceptTerms"
                  name="acceptTerms"
                  type="checkbox"
                  checked={userData.acceptTerms}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-500/30 rounded bg-gray-800"
                  required
                />
                <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-300">
                  I agree to the{' '}
                  <Link to="/terms-of-service" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Terms and Conditions
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy-policy" className="text-blue-400 hover:text-blue-300 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <div>
                <Button
                  type="submit"
                  variant="primary"
                  size="large"
                  loading={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
                >
                  Create Account
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSignup;
