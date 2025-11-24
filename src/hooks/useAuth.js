// hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../firebase/config';
import { authAPI } from '../services/api';

const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check authentication status on mount
  useEffect(() => {
    // Attempt immediate restore from backend JWT (if present) before Firebase listener runs
    (async () => {
      try {
        const token = localStorage.getItem('token');
        // Only attempt restore if there's a token and no firebase current user
        if (token && !auth.currentUser) {
          const resp = await authAPI.getProfile();
          if (resp.data?.success) {
            setUser(resp.data.data);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('Initial auth restore failed:', err);
        localStorage.removeItem('token');
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Firebase user is signed in, get backend token
        try {
          const idToken = await firebaseUser.getIdToken();
          const response = await authAPI.firebaseAuth(idToken, 'email');
          
          if (response.data.success) {
            setUser(response.data.data);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Auth state change error:', error);
          await signOut(auth);
          setUser(null);
          setIsAuthenticated(false);
        }
      } else {
        // No firebase user. If we have a backend JWT (admin login), restore session from backend
        const token = localStorage.getItem('token');
        if (token) {
          try {
            const resp = await authAPI.getProfile();
            if (resp.data?.success) {
              setUser(resp.data.data);
              setIsAuthenticated(true);
            } else {
              // token invalid or expired
              localStorage.removeItem('token');
              setUser(null);
              setIsAuthenticated(false);
            }
          } catch (err) {
            console.error('Auth restore from token failed:', err);
            localStorage.removeItem('token');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  // Regular email/password signup (for users only)
  const signup = useCallback(async (userData) => {
    try {
      setIsLoading(true);
      setError(null);

      // Create user in Firebase
      const result = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      // Create user in backend
      const response = await authAPI.firebaseAuth(idToken, 'email');
      
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        // Store backend JWT for user
        if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
        }
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      // Log raw error for easier debugging (identitytoolkit responses etc.)
      console.error('useAuth.signup error raw:', error.response?.data || error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Regular email/password login
  const login = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await signInWithEmailAndPassword(
        auth,
        credentials.email,
        credentials.password
      );
      
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const response = await authAPI.firebaseAuth(idToken, 'email');
      
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        // Store backend JWT for user
        if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
        }
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      // Log raw error to surface Firebase REST errors (e.g., INVALID_PASSWORD, EMAIL_NOT_FOUND, INVALID_CREDENTIAL)
      console.error('useAuth.login error raw:', error.response?.data || error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Google authentication
  const loginWithGoogle = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');

      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;
      const idToken = await firebaseUser.getIdToken();

      const response = await authAPI.firebaseAuth(idToken, 'google');
      
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        // Store backend JWT for user
        if (response.data.data.token) {
          localStorage.setItem('token', response.data.data.token);
        }
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('useAuth.loginWithGoogle error raw:', error.response?.data || error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Admin login (email/password only)
  const adminLogin = useCallback(async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await authAPI.adminLogin(credentials);
      
      if (response.data.success) {
        setUser(response.data.data);
        setIsAuthenticated(true);
        localStorage.setItem('token', response.data.data.token);
        return { success: true, data: response.data.data };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Admin login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  // Forgot password
  const forgotPassword = useCallback(async (email) => {
    try {
      setError(null);
      await sendPasswordResetEmail(auth, email);
      return {
        success: true,
        message: 'Password reset email sent! Check your inbox.'
      };
    } catch (error) {
      console.error('Auth: forgotPassword error', error);
      const errorMessage = getFirebaseErrorMessage(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  // Helper function to get Firebase error messages
  const getFirebaseErrorMessage = (error) => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'Email is already registered';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled';
      case 'auth/popup-blocked':
        return 'Popup was blocked by browser';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      default:
        return error.message || 'Authentication failed';
    }
  };

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    signup,
    // backward-compatible alias used by some components
    register: signup,
    login,
    loginWithGoogle,
    adminLogin,
    logout,
    forgotPassword,
    clearError,
    
    // Helpers
    isAdmin
  };
};

export default useAuth;