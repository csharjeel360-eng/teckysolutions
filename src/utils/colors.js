// Color Palette - Centralized color constants
export const colors = {
  // Primary - Blue
  primary: '#007BFF',
  primaryLight: '#E3F2FD',
  primaryDark: '#0056B3',
  
  // Secondary - Teal
  secondary: '#20C997',
  secondaryLight: '#E0F2F1',
  secondaryDark: '#1a9b7d',
  
  // Accent - Orange
  accent: '#FF6600',
  accentLight: '#FFF3E0',
  accentDark: '#E55A00',
  
  // Neutral
  white: '#FFFFFF',
  dark: '#343A40',
  
  // Gray Scale
  gray: {
    50: '#F8F9FA',
    100: '#F8F9FA',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#ADB5BD',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
  },
  
  // Status Colors
  success: '#28A745',
  error: '#DC3545',
  warning: '#FFC107',
  info: '#17A2B8',
};

// Tailwind Class Mappings
export const tailwindColors = {
  // Primary
  primaryBg: 'bg-blue-600',
  primaryText: 'text-blue-600',
  primaryHover: 'hover:bg-blue-700',
  primaryBorder: 'border-blue-600',
  
  // Secondary (Teal)
  secondaryBg: 'bg-teal-500',
  secondaryText: 'text-teal-500',
  secondaryHover: 'hover:bg-teal-600',
  secondaryBorder: 'border-teal-500',
  
  // Accent (Orange)
  accentBg: 'bg-orange-600',
  accentText: 'text-orange-600',
  accentHover: 'hover:bg-orange-700',
  accentBorder: 'border-orange-600',
  
  // Neutral
  darkText: 'text-gray-800',
  lightBg: 'bg-white',
  darkBg: 'bg-gray-800',
};

// Gradient Combinations
export const gradients = {
  primaryTeal: 'from-blue-600 to-teal-500',
  primaryOrange: 'from-blue-600 to-orange-600',
  tealOrange: 'from-teal-500 to-orange-600',
  lightPrimary: 'from-blue-50 to-teal-50',
};

export default colors;
