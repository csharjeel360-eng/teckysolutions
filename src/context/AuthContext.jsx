import React, { createContext, useContext } from 'react';
import useFirebaseAuth from '../hooks/useAuth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // useFirebaseAuth contains login, loginWithGoogle, register, logout, etc.
  const auth = useFirebaseAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;