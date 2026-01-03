import React from 'react';
import { auth } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const TestFirebase = () => {
  const handleTest = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const idToken = await user.getIdToken();
      // Debug log removed — token handled securely
      alert('Signed in successfully.');
    } catch (error) {
      console.error('TestFirebase sign-in error:', error);
      alert('Sign-in failed: ' + (error.message || error.code));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Test Firebase Google Sign-In</h2>
      <button onClick={handleTest} className="px-4 py-2 bg-black text-white rounded">Sign in with Google (Test)</button>
    </div>
  );
};

export default TestFirebase;

