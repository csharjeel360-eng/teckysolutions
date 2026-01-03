import React, { createContext, useContext, useReducer, useEffect } from 'react';

const ThemeContext = createContext();

// Available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Available colors
export const COLORS = {
  BLACK: 'black',
  WHITE: 'white',
};

const initialState = {
  theme: THEMES.LIGHT,
  color: COLORS.BLACK,
  isDark: false,
  sidebarCollapsed: false,
};

function themeReducer(state, action) {
  switch (action.type) {
    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
        isDark: calculateIsDark(action.payload),
      };
    
    case 'SET_COLOR':
      return {
        ...state,
        color: action.payload,
      };
    
    case 'TOGGLE_THEME':
      const newTheme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT;
      return {
        ...state,
        theme: newTheme,
        isDark: newTheme === THEMES.DARK,
      };
    
    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed,
      };
    
    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarCollapsed: action.payload,
      };
    
    case 'LOAD_SETTINGS':
      return {
        ...state,
        ...action.payload,
        isDark: calculateIsDark(action.payload.theme),
      };
    
    default:
      return state;
  }
}

// Helper function to calculate if dark mode should be active
const calculateIsDark = (theme) => {
  if (theme === THEMES.SYSTEM) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
  return theme === THEMES.DARK;
};

// Load theme settings from localStorage
const loadThemeSettings = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const settings = localStorage.getItem('temu-clone-theme-settings');
    return settings ? JSON.parse(settings) : null;
  } catch (error) {
    console.error('Error loading theme settings:', error);
    return null;
  }
};

// Save theme settings to localStorage
const saveThemeSettings = (settings) => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('temu-clone-theme-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving theme settings:', error);
  }
};

export function ThemeProvider({ children }) {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = loadThemeSettings();
    if (savedSettings) {
      dispatch({ type: 'LOAD_SETTINGS', payload: savedSettings });
    }
  }, []);

  // Save settings when they change
  useEffect(() => {
    const settings = {
      theme: state.theme,
      color: state.color,
      sidebarCollapsed: state.sidebarCollapsed,
    };
    saveThemeSettings(settings);
  }, [state.theme, state.color, state.sidebarCollapsed]);

  // Apply theme to document
  useEffect(() => {
    const root = window.document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Add current theme class
    if (state.theme === THEMES.SYSTEM) {
      const systemIsDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(systemIsDark ? 'dark' : 'light');
    } else {
      root.classList.add(state.theme);
    }

    // Apply color scheme
    Object.values(COLORS).forEach(color => {
      root.classList.remove(`color-${color}`);
    });
    root.classList.add(`color-${state.color}`);
  }, [state.theme, state.color]);

  // Listen for system theme changes
  useEffect(() => {
    if (state.theme !== THEMES.SYSTEM) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      dispatch({ type: 'SET_THEME', payload: THEMES.SYSTEM });
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [state.theme]);

  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      dispatch({ type: 'SET_THEME', payload: theme });
    }
  };

  const setColor = (color) => {
    if (Object.values(COLORS).includes(color)) {
      dispatch({ type: 'SET_COLOR', payload: color });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebar = (collapsed) => {
    dispatch({ type: 'SET_SIDEBAR', payload: collapsed });
  };

  const resetSettings = () => {
    dispatch({ type: 'LOAD_SETTINGS', payload: initialState });
  };

  const value = {
    // State
    theme: state.theme,
    color: state.color,
    isDark: state.isDark,
    sidebarCollapsed: state.sidebarCollapsed,

    // Actions
    setTheme,
    setColor,
    toggleTheme,
    toggleSidebar,
    setSidebar,
    resetSettings,

    // Constants
    availableThemes: THEMES,
    availableColors: COLORS,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;
