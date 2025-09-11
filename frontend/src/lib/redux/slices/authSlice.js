import { createSlice } from "@reduxjs/toolkit";

// Helper function to validate JWT token
const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 > Date.now();
  } catch (error) {
    return false;
  }
};

// Initialize state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user && isTokenValid(token)) {
      const userData = JSON.parse(user);
      return {
        isAuthenticated: true,
        user: userData,
        subscription: userData.subscription || "free",
      };
    } else if (token || user) {
      // Token exists but is invalid, clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error parsing user data from localStorage:', error);
    // Clear corrupted data
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return {
    isAuthenticated: false,
    user: null,
    subscription: "free", // 'free' or 'pro'
  };
};

const initialState = getInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.subscription = action.payload.subscription || "free";
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.subscription = "free";
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    register: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.subscription = action.payload.subscription || "free";
      // Save user data to localStorage
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    upgradeToPro: (state) => {
      state.subscription = "pro";
      // Update localStorage with new subscription
      if (state.user) {
        const updatedUser = { ...state.user, subscription: "pro" };
        state.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
    downgradeToFree: (state) => {
      state.subscription = "free";
      // Update localStorage with new subscription
      if (state.user) {
        const updatedUser = { ...state.user, subscription: "free" };
        state.user = updatedUser;
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
    },
    refreshUser: (state, action) => {
      // Action to refresh user data from backend
      state.user = action.payload;
      state.subscription = action.payload.subscription || "free";
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
});

export const { login, logout, register, upgradeToPro, downgradeToFree, refreshUser } = authSlice.actions;
export default authSlice.reducer;
