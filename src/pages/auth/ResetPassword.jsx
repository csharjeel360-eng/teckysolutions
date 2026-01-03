import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import Button from '../../components/UI/Button';
import Input from '../../components/UI/Input';
import Notification from '../../components/UI/Notification';
import { authAPI } from '../../services/api';

const ResetPassword = () => {
  const [passwords, setPasswords] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const handleChange = (e) => {
    setPasswords({
      ...passwords,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (passwords.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setError('Passwords do not match');
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

    if (!token) {
      setError('Invalid reset token');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.resetPassword(token, passwords.newPassword);
      if (response.data?.success) {
        setMessage(response.data.message || 'Your password has been reset successfully. You can now sign in with your new password.');
        // Redirect to login after 2 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (response.data && !response.data.success) {
        setError(response.data.message || 'Failed to reset password.');
      } else {
        setMessage('Your password has been reset successfully. You can now sign in with your new password.');
        setTimeout(() => navigate('/login'), 2000);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || err.message || 'Failed to reset password. Please try again.';
      setError(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-xl">T</span>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Set new password
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create a new password for your account
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {error && (
            <Notification 
              type="error" 
              message={error}
              onClose={() => setError('')}
            />
          )}
          
          {message && (
            <Notification 
              type="success" 
              message={message}
              onClose={() => setMessage('')}
            />
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              label="New Password"
              name="newPassword"
              type="password"
              value={passwords.newPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Enter your new password"
            />
            
            <Input
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={passwords.confirmPassword}
              onChange={handleChange}
              required
              autoComplete="new-password"
              placeholder="Confirm your new password"
            />

            <div>
              <Button
                type="submit"
                variant="primary"
                size="large"
                loading={loading}
                className="w-full"
              >
                Reset Password
              </Button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
