// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services/api"; // Adjust the import path as necessary

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(() => {
    // Get user data from local storage if available
    const storedUser  = localStorage.getItem("user");
    return storedUser  ? JSON.parse(storedUser ) : null;
  });

  const [token, setToken] = useState(() => {
    // Get token from local storage if available
    return localStorage.getItem("token") || null;
  });

  const login = async (credentials) => {
    try {

        
      const response = await authService.login(credentials);
      const { token, user } = response.data;

      // Store token and user in local storage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setToken(token);
      setUser (user);
    } catch (error) {
      console.error("Login failed:", error);
      throw error; // Rethrow the error for further handling
    }
  };

  const logout = () => {
    // Remove token and user from local storage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser (null);
  };

  const getProfile = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data;

      // Update user state
      setUser (userData);
      localStorage.setItem("user", JSON.stringify(userData)); // Update local storage
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  };

  useEffect(() => {
    // Fetch user profile on initial load if token exists
    if (token) {
      getProfile();
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
