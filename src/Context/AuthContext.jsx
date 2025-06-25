import React, { createContext, useState, useContext, useEffect } from 'react';
//import axios from 'axios'; thay bang import axiosClient from "../config/axiosClient"; // <-- Thêm dòng này
import axiosClient from '../config/AxiosClient';

// Export AuthContext so it can be imported in other components
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check trạng thái đăng nhập khi app load
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        const userData = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUser(userData);
        setRole(userData.role);
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setRole(null);
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  // Hàm login gọi sau khi đăng nhập thành công, sua ten bien
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function to clear auth state
  // const API_BASE_URL = "https://4cd2-118-69-70-166.ngrok-free.app/api/v1/auth"; xoa dong nay

  const logout = async () => {

    try {
      console.log("Gọi hàm logout");
    // Gọi API logout dùng axiosClient có withCredentials
    await axiosClient.post("/api/v1/auth/logout");
  } catch (err) {
    console.error("Logout backend error:", err);
  }
  
  setIsLoggedIn(false);
  setUser(null);
  setRole(null);
  localStorage.removeItem('accessToken');
  localStorage.removeItem('user');
  localStorage.removeItem('redirectUrl');
};

  // Check if user is authenticated
  const checkAuthentication = () => {
    return isLoggedIn && user !== null;
  };

  // Check login status and save redirect path
  const checkLogin = (redirectPath) => {
    if (!isLoggedIn) {
      localStorage.setItem('redirectUrl', redirectPath);
      return false;
    }
    return true;
  };

  if (loading) {
    return <div>Loading...</div>; // You can replace this with a spinner component
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        role, // Thêm role ở đây
        loading,
        login,
        logout,
        checkLogin,
        checkAuthentication
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for using auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};