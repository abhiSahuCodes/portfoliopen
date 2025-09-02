import { createSlice } from "@reduxjs/toolkit";

// Initialize state from localStorage
const getInitialState = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const userData = JSON.parse(user);
      return {
        isAuthenticated: true,
        user: userData,
        subscription: userData.subscription || "free",
      };
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
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.subscription = "free";
    },
    register: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.subscription = action.payload.subscription || "free";
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
