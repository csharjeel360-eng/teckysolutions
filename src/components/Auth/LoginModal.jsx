// components/Auth/LoginModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { X, Mail, Lock, ArrowRight } from 'lucide-react';

const LoginModal = ({ isOpen, onClose, redirectPath = null }) => {
  const navigate = useNavigate();

  const handleRedirectToLogin = () => {
    onClose();
    
    // Navigate to login page with redirect back to current page or specified path
    const fromPath = redirectPath || window.location.pathname;
    navigate('/login', { 
      state: { 
        from: fromPath,
        message: 'Please sign in to continue'
      } 
    });
  };

  const handleRedirectToRegister = () => {
    onClose();
    
    // Navigate to register page with redirect back to current page or specified path
    const fromPath = redirectPath || window.location.pathname;
    navigate('/register', { 
      state: { 
        from: fromPath,
        message: 'Create an account to continue'
      } 
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Sign In Required" 
      size="small"
    >
      <div className="p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Authentication Required
          </h3>
          <p className="text-gray-600 text-sm">
            Please sign in to your account to continue with this action.
          </p>
        </div>

        <div className="space-y-3">
          <Button
            onClick={handleRedirectToLogin}
            variant="primary"
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            <Mail className="w-4 h-4" />
            Sign In to Your Account
            <ArrowRight className="w-4 h-4" />
          </Button>

          <Button
            onClick={handleRedirectToRegister}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 py-3"
          >
            Create New Account
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default LoginModal;