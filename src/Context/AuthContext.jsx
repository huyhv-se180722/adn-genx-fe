// import React, { createContext, useState, useContext, useEffect } from 'react';
// //import axios from 'axios'; thay bang import axiosClient from "../config/axiosClient"; // <-- Thêm dòng này
// import axiosClient from '../config/AxiosClient';

// // Export AuthContext so it can be imported in other components
// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Check trạng thái đăng nhập khi app load
//   useEffect(() => {
//     const checkAuth = () => {
//       const token = localStorage.getItem('accessToken');
//       const storedUser = localStorage.getItem('user');

//       if (token && storedUser) {
//         const userData = JSON.parse(storedUser);
//         setIsLoggedIn(true);
//         setUser(userData);
//         setRole(userData.role);
//       } else {
//         setIsLoggedIn(false);
//         setUser(null);
//         setRole(null);
//       }

//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Hàm login gọi sau khi đăng nhập thành công, sua ten bien
//   const login = (userData) => {
//     setIsLoggedIn(true);
//     setUser(userData);
//     setRole(userData.role);
//     localStorage.setItem('accessToken', userData.accessToken);
//     localStorage.setItem('user', JSON.stringify(userData));
//   };

//   // Logout function to clear auth state
//   // const API_BASE_URL = "https://4cd2-118-69-70-166.ngrok-free.app/api/v1/auth"; xoa dong nay

//   const logout = async () => {

//     try {
//       console.log("Gọi hàm logout");
//     // Gọi API logout dùng axiosClient có withCredentials
//     await axiosClient.post("/api/v1/auth/logout");
//   } catch (err) {
//     console.error("Logout backend error:", err);
//   }
  
//   setIsLoggedIn(false);
//   setUser(null);
//   setRole(null);
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('user');
//   localStorage.removeItem('redirectUrl');
// };

//   // Check if user is authenticated
//   const checkAuthentication = () => {
//     return isLoggedIn && user !== null;
//   };

//   // Check login status and save redirect path
//   const checkLogin = (redirectPath) => {
//     if (!isLoggedIn) {
//       localStorage.setItem('redirectUrl', redirectPath);
//       return false;
//     }
//     return true;
//   };

//   if (loading) {
//     return <div>Loading...</div>; // You can replace this with a spinner component
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         user,
//         role, // Thêm role ở đây
//         loading,
//         login,
//         logout,
//         checkLogin,
//         checkAuthentication
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// // Custom hook for using auth context
// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };

////////////////////////////////////////////////////////////////////////////////
// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { jwtDecode } from 'jwt-decode';
// import axiosClient from '../config/AxiosClient';

// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState(null);
//   const [role, setRole] = useState(null);
//   const [loading, setLoading] = useState(true);

//   // Validate token với jwt-decode
//   const validateToken = (token) => {
//     try {
//       const decoded = jwtDecode(token);
//       const currentTime = Date.now() / 1000;
      
//       // Kiểm tra token có hết hạn không
//       if (decoded.exp && decoded.exp > currentTime) {
//         return decoded; // Token hợp lệ, trả về decoded data
//       } else {
//         console.log('Token expired:', new Date(decoded.exp * 1000));
//         return null;
//       }
//     } catch (error) {
//       console.error('Invalid token:', error);
//       return null;
//     }
//   };

//   // Check trạng thái đăng nhập khi app load
//   useEffect(() => {
//     const checkAuth = async () => {
//       const token = localStorage.getItem('accessToken');
//       const storedUser = localStorage.getItem('user');

//       if (token && storedUser) {
//         // Validate token with jwt-decode first
//         const decodedToken = validateToken(token);
        
//         if (decodedToken) {
//           try {
//             const userData = JSON.parse(storedUser);
            
//             // Double check với backend nếu cần
//             // const verifiedUser = await axiosClient.get('/api/v1/auth/verify');
            
//             setIsLoggedIn(true);
//             setUser(userData);
//             setRole(userData.role);
            
//             console.log('Token valid, user logged in:', userData.username);
//           } catch (error) {
//             console.error('Error parsing stored user:', error);
//             await handleInvalidToken();
//           }
//         } else {
//           // Token hết hạn hoặc không hợp lệ
//           await handleInvalidToken();
//         }
//       } else {
//         setIsLoggedIn(false);
//         setUser(null);
//         setRole(null);
//       }

//       setLoading(false);
//     };

//     checkAuth();
//   }, []);

//   // Xử lý token không hợp lệ
//   const handleInvalidToken = async () => {
//     console.log('Invalid token, logging out...');
//     setIsLoggedIn(false);
//     setUser(null);
//     setRole(null);
//     localStorage.removeItem('accessToken');
//     localStorage.removeItem('user');
//     localStorage.removeItem('redirectUrl');
//   };

//   // Check token expiry
//   const checkTokenExpiry = () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) return false;
    
//     const decodedToken = validateToken(token);
//     return !!decodedToken; // true nếu token còn hạn
//   };

//   // Get token expiry time
//   const getTokenExpiryTime = () => {
//     const token = localStorage.getItem('accessToken');
//     if (!token) return null;
    
//     try {
//       const decoded = jwtDecode(token);
//       return decoded.exp ? new Date(decoded.exp * 1000) : null;
//     } catch (error) {
//       return null;
//     }
//   };

//   // Login function
//   const login = (userData) => {
//     setIsLoggedIn(true);
//     setUser(userData);
//     setRole(userData.role);
//     localStorage.setItem('accessToken', userData.accessToken);
//     localStorage.setItem('user', JSON.stringify(userData));
    
//     console.log('User logged in:', userData.username);
    
//     // Log token expiry time
//     const expiryTime = getTokenExpiryTime();
//     if (expiryTime) {
//       console.log('Token expires at:', expiryTime);
//     }
//   };

//   // Logout function
//   const logout = async () => {
//   try {
//     console.log("🔄 Bắt đầu gọi API logout...");

//     const response = await axiosClient.post("/api/v1/auth/logout");
//     console.log("✅ Logout thành công:", response.data);
//   } catch (err) {
//     console.error("❌ Lỗi khi gọi API logout:", err);

//     if (err.response) {
//       console.error("↪️ Response error:", {
//         status: err.response.status,
//         data: err.response.data,
//         headers: err.response.headers
//       });
//     } else if (err.request) {
//       console.error("⚠️ Không nhận được phản hồi từ server:", err.request);
//     } else {
//       console.error("❗ Lỗi khác:", err.message);
//     }
//   }

//   console.log("🧹 Đang xóa thông tin đăng nhập ở localStorage...");
//   setIsLoggedIn(false);
//   setUser(null);
//   setRole(null);
//   localStorage.removeItem('accessToken');
//   localStorage.removeItem('user');
//   localStorage.removeItem('redirectUrl');

//   console.log("🔁 Điều hướng về trang chủ...");
//   window.location.href = '/';
// };


//   const checkAuthentication = () => {
//     return isLoggedIn && user !== null && checkTokenExpiry();
//   };

//   const checkLogin = (redirectPath) => {
//     if (!checkAuthentication()) {
//       localStorage.setItem('redirectUrl', redirectPath);
//       return false;
//     }
//     return true;
//   };

//   if (loading) {
//     return (
//       <div style={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         height: '100vh',
//         fontSize: '18px'
//       }}>
//         Đang kiểm tra đăng nhập...
//       </div>
//     );
//   }

//   return (
//     <AuthContext.Provider
//       value={{
//         isLoggedIn,
//         user,
//         role,
//         loading,
//         login,
//         logout,
//         checkLogin,
//         checkAuthentication,
//         checkTokenExpiry,
//         getTokenExpiryTime,
//         handleInvalidToken
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// };
/////////////////////////////////////////////////////////////////////////////////
import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axiosClient from '../config/AxiosClient';
import { refreshAccessToken } from '../Components/Service/refreshAccessToken';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Validate token với jwt-decode
  const validateToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp > currentTime) {
        return decoded;
      } else {
        console.log('Token expired:', new Date(decoded.exp * 1000));
        return null;
      }
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  };

  // ✅ Hàm refresh token từ cookie
const refreshFromCookie = async () => {
  try {
    console.log('🔄 Attempting to refresh token from cookie...');
    console.log("🌍 API URL = ", import.meta.env.VITE_API_BASE_URL);

    // Gọi API để lấy accessToken mới từ cookie chứa refreshToken
    const newAccessToken = await refreshAccessToken(); // hàm đã viết sẵn

    if (newAccessToken) {
      // ✅ Giải mã access token (chỉ để kiểm tra thời hạn, sub, role, v.v.)
      const decoded = jwtDecode(newAccessToken);
      const expiry = decoded.exp ? new Date(decoded.exp * 1000) : null;
      console.log("⏰ Token expires at:", expiry);

      // ✅ Lấy thông tin user từ server
      const response = await axiosClient.get('/api/v1/account/profile');
      const userData = response.data;

      if (userData) {
        setIsLoggedIn(true);
        setUser(userData);
        // getUser(userData);
        setRole(userData.role);
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('user', JSON.stringify(userData));

        console.log('✅ Token refreshed successfully, user restored:', userData);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('❌ Refresh from cookie failed:', error);
    return false;
  }
};


  // ✅ LOGIC HOÀN TOÀN MỚI - xử lý tất cả trường hợp
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const storedUser = localStorage.getItem('user');

        // ✅ Trường hợp 1: Có token và user trong localStorage
        if (token && storedUser) {
          const decodedToken = validateToken(token);
          
          if (decodedToken) {
            // Token còn hạn, khôi phục user
            try {
              const userData = JSON.parse(storedUser);
              setIsLoggedIn(true);
              setUser(userData);
              setRole(userData.role);
              console.log('✅ User restored from localStorage:', userData.username);
            } catch (parseError) {
              console.error('❌ Error parsing stored user:', parseError);
              await handleInvalidToken();
            }
          } else {
            // Token hết hạn, thử refresh
            console.log('⏰ Token expired, attempting refresh...');
            const refreshSuccess = await refreshFromCookie();
            
            if (!refreshSuccess) {
              await handleInvalidToken();
            }
          }
        }
        // ✅ Trường hợp 2: Không có token (F5, reload) nhưng có thể có refreshToken
        else {
          console.log('🔍 No token in localStorage, checking cookie...');
          const refreshSuccess = await refreshFromCookie();
          
          if (!refreshSuccess) {
            // Không có gì cả hoặc refresh fail
            console.log('👤 No valid session found');
            setIsLoggedIn(false);
            setUser(null);
            setRole(null);
          }
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        await handleInvalidToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Xử lý token không hợp lệ
  const handleInvalidToken = async () => {
    console.log('🧹 Cleaning up invalid session...');
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectUrl');
  };

  // Check token expiry
  const checkTokenExpiry = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return false;
    
    const decodedToken = validateToken(token);
    return !!decodedToken;
  };

  // Get token expiry time
  const getTokenExpiryTime = () => {
    const token = localStorage.getItem('accessToken');
    if (!token) return null;
    
    try {
      const decoded = jwtDecode(token);
      return decoded.exp ? new Date(decoded.exp * 1000) : null;
    } catch (error) {
      return null;
    }
  };

  // Login function
  const login = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
    setRole(userData.role);
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    
    console.log('✅ User logged in:', userData.username);
    
    const expiryTime = getTokenExpiryTime();
    if (expiryTime) {
      console.log('⏰ Token expires at:', expiryTime);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      console.log("🔄 Calling logout API...");
      await axiosClient.post("/api/v1/auth/logout");
      console.log("✅ Logout API success");
    } catch (err) {
      console.error("❌ Logout API error:", err);
    }
    
    setIsLoggedIn(false);
    setUser(null);
    setRole(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('redirectUrl');
    
    console.log("🔁 Redirecting to home...");
    window.location.href = '/';
  };

  const checkAuthentication = () => {
    return isLoggedIn && user !== null && checkTokenExpiry();
  };

  const checkLogin = (redirectPath) => {
    if (!checkAuthentication()) {
      localStorage.setItem('redirectUrl', redirectPath);
      return false;
    }
    return true;
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px'
      }}>
        Đang kiểm tra đăng nhập...
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        user,
        role,
        loading,
        login,
        logout,
        checkLogin,
        checkAuthentication,
        checkTokenExpiry,
        getTokenExpiryTime,
        handleInvalidToken
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};