import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

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
      const token = localStorage.getItem('token');
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

  // Hàm login gọi sau khi đăng nhập thành công
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function to clear auth state
  const API_BASE_URL = "https://your-backend-domain/api/v1/auth";

  const logout = async () => {
    try {
      // Gọi API logout để backend xóa refreshToken và cookie
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
    } catch (err) {
      // Có thể log lỗi hoặc bỏ qua nếu backend không phản hồi
      console.error("Logout backend error:", err);
    }
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('token');
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