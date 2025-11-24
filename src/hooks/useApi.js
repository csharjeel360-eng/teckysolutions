import { useState, useCallback } from 'react';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callApi = useCallback(async (apiCall, options = {}) => {
    const {
      showLoading = true,
      showError = true,
      errorMessage = 'An error occurred',
      onSuccess,
      onError,
    } = options;

    try {
      if (showLoading) setLoading(true);
      setError(null);

      const response = await apiCall();
      
      if (onSuccess) {
        onSuccess(response.data);
      }

      return { success: true, data: response.data };
    } catch (err) {
      const message = err.response?.data?.message || errorMessage;
      
      if (showError) {
        setError(message);
      }

      if (onError) {
        onError(err);
      }

      return { success: false, error: message, originalError: err };
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    loading,
    error,
    callApi,
    clearError,
  };
};

export default useApi;