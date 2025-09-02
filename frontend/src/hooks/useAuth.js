import { useSelector, useDispatch } from "react-redux";
import {
  login as loginAction,
  logout as logoutAction,
} from "../lib/redux/slices/authSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, user, subscription } = useSelector(
    (state) => state.auth
  );

  const login = (userData, token) => {
    // Store token in localStorage
    if (token) {
      localStorage.setItem("token", token);
    }

    // Store user data in localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    // Update Redux store
    dispatch(loginAction(userData));
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Update Redux store
    dispatch(logoutAction());
  };

  const getToken = () => {
    return localStorage.getItem("token");
  };

  const isTokenValid = () => {
    const token = getToken();
    if (!token) return false;

    try {
      // Basic token validation - check if it's not expired
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  return {
    isAuthenticated,
    user,
    subscription,
    login,
    logout,
    getToken,
    isTokenValid,
  };
};
