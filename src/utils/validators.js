/**
 * Comprehensive validation utility for form inputs and data
 */

// Common validation patterns
const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]{10,}$/,
  url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  username: /^[a-zA-Z0-9_-]{3,20}$/,
  hexColor: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  zipCode: /^\d{5}(-\d{4})?$/,
  price: /^\d+(\.\d{1,2})?$/,
  slug: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
};

// Validation error messages
const messages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  url: 'Please enter a valid URL',
  minLength: (min) => `Must be at least ${min} characters`,
  maxLength: (max) => `Must be less than ${max} characters`,
  min: (min) => `Must be greater than or equal to ${min}`,
  max: (max) => `Must be less than or equal to ${max}`,
  between: (min, max) => `Must be between ${min} and ${max}`,
  password: 'Password must contain uppercase, lowercase, number and special character',
  confirmPassword: 'Passwords do not match',
  username: 'Username must be 3-20 characters (letters, numbers, _, -)',
  hexColor: 'Please enter a valid hex color code',
  zipCode: 'Please enter a valid zip code',
  price: 'Please enter a valid price',
  slug: 'Please enter a valid slug (lowercase letters, numbers, hyphens)',
  integer: 'Please enter a whole number',
  positive: 'Please enter a positive number',
};

/**
 * Base validator class
 */
class Validator {
  constructor(value) {
    this.value = value;
    this.errors = [];
    this.isOptional = false;
  }

  // Mark field as optional
  optional() {
    this.isOptional = true;
    return this;
  }

  // Check if value is empty (including empty strings, null, undefined)
  isEmpty() {
    return this.value === null || 
           this.value === undefined || 
           this.value === '' || 
           (Array.isArray(this.value) && this.value.length === 0);
  }

  // Required field validation
  required(message = messages.required) {
    if (this.isEmpty()) {
      this.errors.push(message);
    }
    return this;
  }

  // Email validation
  email(message = messages.email) {
    if (!this.isEmpty() && !patterns.email.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Phone number validation
  phone(message = messages.phone) {
    if (!this.isEmpty() && !patterns.phone.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // URL validation
  url(message = messages.url) {
    if (!this.isEmpty() && !patterns.url.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Minimum length validation
  minLength(min, message) {
    if (!this.isEmpty() && this.value.length < min) {
      this.errors.push(message || messages.minLength(min));
    }
    return this;
  }

  // Maximum length validation
  maxLength(max, message) {
    if (!this.isEmpty() && this.value.length > max) {
      this.errors.push(message || messages.maxLength(max));
    }
    return this;
  }

  // Length range validation
  lengthBetween(min, max, message) {
    if (!this.isEmpty() && (this.value.length < min || this.value.length > max)) {
      this.errors.push(message || messages.between(min, max));
    }
    return this;
  }

  // Minimum value validation (for numbers)
  min(min, message) {
    const num = Number(this.value);
    if (!this.isEmpty() && (!isNaN(num) && num < min)) {
      this.errors.push(message || messages.min(min));
    }
    return this;
  }

  // Maximum value validation (for numbers)
  max(max, message) {
    const num = Number(this.value);
    if (!this.isEmpty() && (!isNaN(num) && num > max)) {
      this.errors.push(message || messages.max(max));
    }
    return this;
  }

  // Value range validation
  between(min, max, message) {
    const num = Number(this.value);
    if (!this.isEmpty() && (!isNaN(num) && (num < min || num > max))) {
      this.errors.push(message || messages.between(min, max));
    }
    return this;
  }

  // Password validation
  password(message = messages.password) {
    if (!this.isEmpty() && !patterns.password.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Confirm password validation
  confirmPassword(confirmValue, message = messages.confirmPassword) {
    if (!this.isEmpty() && this.value !== confirmValue) {
      this.errors.push(message);
    }
    return this;
  }

  // Username validation
  username(message = messages.username) {
    if (!this.isEmpty() && !patterns.username.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Hex color validation
  hexColor(message = messages.hexColor) {
    if (!this.isEmpty() && !patterns.hexColor.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Zip code validation
  zipCode(message = messages.zipCode) {
    if (!this.isEmpty() && !patterns.zipCode.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Price validation
  price(message = messages.price) {
    if (!this.isEmpty() && !patterns.price.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Slug validation
  slug(message = messages.slug) {
    if (!this.isEmpty() && !patterns.slug.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Integer validation
  integer(message = messages.integer) {
    if (!this.isEmpty() && !Number.isInteger(Number(this.value))) {
      this.errors.push(message);
    }
    return this;
  }

  // Positive number validation
  positive(message = messages.positive) {
    const num = Number(this.value);
    if (!this.isEmpty() && (!isNaN(num) && num <= 0)) {
      this.errors.push(message);
    }
    return this;
  }

  // Custom regex validation
  matches(pattern, message) {
    if (!this.isEmpty() && !pattern.test(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Custom validation function
  custom(validator, message) {
    if (!this.isEmpty() && !validator(this.value)) {
      this.errors.push(message);
    }
    return this;
  }

  // Check if validation passes
  isValid() {
    // If field is optional and empty, skip validation
    if (this.isOptional && this.isEmpty()) {
      return true;
    }
    return this.errors.length === 0;
  }

  // Get validation errors
  getErrors() {
    return this.errors;
  }

  // Get first error
  getFirstError() {
    return this.errors[0] || null;
  }

  // Clear errors
  clearErrors() {
    this.errors = [];
    return this;
  }
}

/**
 * Create a new validator instance
 */
function validate(value) {
  return new Validator(value);
}

/**
 * Form validation helper
 */
class FormValidator {
  constructor(rules) {
    this.rules = rules;
    this.errors = {};
  }

  validate(formData) {
    this.errors = {};

    Object.keys(this.rules).forEach(field => {
      const value = formData[field];
      const fieldRules = this.rules[field];
      
      if (Array.isArray(fieldRules)) {
        const validator = validate(value);
        
        fieldRules.forEach(rule => {
          if (typeof rule === 'function') {
            rule(validator);
          } else if (typeof rule === 'object') {
            const { type, params = [], message } = rule;
            if (typeof validator[type] === 'function') {
              validator[type](...params, message);
            }
          }
        });

        if (!validator.isValid()) {
          this.errors[field] = validator.getFirstError();
        }
      }
    });

    return {
      isValid: Object.keys(this.errors).length === 0,
      errors: this.errors
    };
  }

  getFieldError(field) {
    return this.errors[field];
  }

  hasErrors() {
    return Object.keys(this.errors).length > 0;
  }
}

/**
 * Pre-defined validation rules for common scenarios
 */
const validationRules = {
  // Auth validations
  auth: {
    email: [
      { type: 'required' },
      { type: 'email' }
    ],
    password: [
      { type: 'required' },
      { type: 'minLength', params: [6] },
      { type: 'password' }
    ],
    name: [
      { type: 'required' },
      { type: 'minLength', params: [2] },
      { type: 'maxLength', params: [50] }
    ]
  },

  // Product validations
  product: {
    name: [
      { type: 'required' },
      { type: 'minLength', params: [3] },
      { type: 'maxLength', params: [100] }
    ],
    price: [
      { type: 'required' },
      { type: 'positive' },
      { type: 'max', params: [1000000] }
    ],
    stock: [
      { type: 'required' },
      { type: 'integer' },
      { type: 'min', params: [0] }
    ],
    description: [
      { type: 'required' },
      { type: 'minLength', params: [10] },
      { type: 'maxLength', params: [2000] }
    ]
  },

  // Category validations
  category: {
    name: [
      { type: 'required' },
      { type: 'minLength', params: [2] },
      { type: 'maxLength', params: [50] }
    ],
    description: [
      { type: 'maxLength', params: [500] }
    ]
  },

  // Blog validations
  blog: {
    title: [
      { type: 'required' },
      { type: 'minLength', params: [5] },
      { type: 'maxLength', params: [200] }
    ],
    excerpt: [
      { type: 'maxLength', params: [200] }
    ],
    content: [
      { type: 'required' },
      { type: 'minLength', params: [50] }
    ]
  },

  // User profile validations
  profile: {
    name: [
      { type: 'required' },
      { type: 'minLength', params: [2] },
      { type: 'maxLength', params: [50] }
    ],
    phone: [
      { type: 'phone' }
    ],
    address: [
      { type: 'maxLength', params: [200] }
    ]
  },

  // Order validations
  order: {
    shippingAddress: [
      { type: 'required' },
      { type: 'minLength', params: [10] }
    ],
    paymentMethod: [
      { type: 'required' }
    ]
  }
};

/**
 * Quick validation functions for common use cases
 */
const quickValidators = {
  // Check if value is a valid email
  isEmail: (value) => patterns.email.test(value),
  
  // Check if value is a valid phone number
  isPhone: (value) => patterns.phone.test(value),
  
  // Check if value is a valid URL
  isUrl: (value) => patterns.url.test(value),
  
  // Check if value is not empty
  isRequired: (value) => !(value === null || value === undefined || value === ''),
  
  // Check if value meets minimum length
  hasMinLength: (value, min) => value && value.length >= min,
  
  // Check if value meets maximum length
  hasMaxLength: (value, max) => value && value.length <= max,
  
  // Check if value is a number
  isNumber: (value) => !isNaN(Number(value)),
  
  // Check if value is a positive number
  isPositive: (value) => !isNaN(Number(value)) && Number(value) > 0,
  
  // Check if value is an integer
  isInteger: (value) => Number.isInteger(Number(value)),
  
  // Check if value is within range
  isInRange: (value, min, max) => {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
  }
};

/**
 * React hook for form validation
 */
const useValidation = (rules, initialData = {}) => {
  const [formData, setFormData] = React.useState(initialData);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});

  const validator = React.useMemo(() => new FormValidator(rules), [rules]);

  const validateField = React.useCallback((field, value) => {
    const result = validator.validate({ [field]: value });
    return result.errors[field] || '';
  }, [validator]);

  const validateForm = React.useCallback(() => {
    const result = validator.validate(formData);
    setErrors(result.errors);
    return result.isValid;
  }, [validator, formData]);

  const setFieldValue = React.useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Auto-validate when field is touched and has error
    if (touched[field] && errors[field]) {
      const error = validateField(field, value);
      setErrors(prev => ({
        ...prev,
        [field]: error
      }));
    }
  }, [touched, errors, validateField]);

  const setFieldTouched = React.useCallback((field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Validate field when touched
    const error = validateField(field, formData[field]);
    setErrors(prev => ({
      ...prev,
      [field]: error
    }));
  }, [formData, validateField]);

  const resetForm = React.useCallback((newData = {}) => {
    setFormData(newData);
    setErrors({});
    setTouched({});
  }, []);

  return {
    formData,
    errors,
    touched,
    isValid: Object.keys(errors).length === 0,
    setFieldValue,
    setFieldTouched,
    validateForm,
    resetForm,
    validateField
  };
};

export {
  Validator,
  FormValidator,
  validate,
  validationRules,
  quickValidators,
  useValidation,
  patterns,
  messages
};

export default validate;