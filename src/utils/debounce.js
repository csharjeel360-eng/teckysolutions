/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to call the function immediately on the leading edge
 * @returns {Function} - The debounced function
 */
function debounce(func, wait = 300, immediate = false) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;
  let result = null;

  const later = () => {
    timeoutId = null;
    if (!immediate) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    }
  };

  const debounced = function (...args) {
    const callNow = immediate && !timeoutId;
    
    lastArgs = args;
    lastThis = this;

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(later, wait);

    if (callNow) {
      result = func.apply(lastThis, lastArgs);
      lastArgs = lastThis = null;
    }

    return result;
  };

  // Cancel the debounced call
  debounced.cancel = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
      lastArgs = lastThis = null;
    }
  };

  // Flush the debounced call immediately
  debounced.flush = function () {
    if (timeoutId) {
      clearTimeout(timeoutId);
      later();
    }
  };

  // Check if there's a pending debounced call
  debounced.pending = function () {
    return timeoutId !== null;
  };

  return debounced;
}

/**
 * Debounce decorator for class methods
 * @param {number} wait - The number of milliseconds to delay
 * @param {boolean} immediate - Whether to call the function immediately on the leading edge
 * @returns {Function} - The decorator function
 */
function debounceMethod(wait = 300, immediate = false) {
  return function (target, propertyName, descriptor) {
    const method = descriptor.value;
    const debounced = debounce(method, wait, immediate);

    return {
      ...descriptor,
      value: function (...args) {
        return debounced.apply(this, args);
      }
    };
  };
}

/**
 * Debounce hook for React components (returns a debounced version of the function)
 * @param {Function} callback - The callback function to debounce
 * @param {number} delay - The debounce delay in milliseconds
 * @param {Array} dependencies - React dependencies array for useCallback
 * @returns {Function} - The debounced callback
 */
const useDebounce = (callback, delay = 300, dependencies = []) => {
  const [debouncedCallback] = React.useState(() => 
    debounce(callback, delay)
  );

  React.useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  React.useEffect(() => {
    debouncedCallback.cancel();
  }, dependencies);

  return debouncedCallback;
};

// Pre-configured debounce functions for common use cases
const debounceOptions = {
  // For search inputs
  search: (func) => debounce(func, 300),
  // For resize events
  resize: (func) => debounce(func, 150),
  // For scroll events
  scroll: (func) => debounce(func, 100),
  // For form submissions
  submit: (func) => debounce(func, 1000, true),
  // For auto-save functionality
  autosave: (func) => debounce(func, 2000),
  // For real-time validation
  validation: (func) => debounce(func, 500),
};

export {
  debounce,
  debounceMethod,
  useDebounce,
  debounceOptions
};

export default debounce;