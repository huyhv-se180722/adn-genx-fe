// import axios from "axios";
// import { refreshAccessToken } from "../Components/Service/refreshAccessToken";


// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true //  dùng cookie
// });

// // Gắn token tự động vào mọi request nếu có
// axiosClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken"); // hoặc sessionStorage
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // (Tuỳ chọn) Bắt lỗi hết hạn token
// axiosClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Nếu token hết hạn và chưa retry
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const newToken = await refreshAccessToken();
//         localStorage.setItem("accessToken", newToken);
//         originalRequest.headers.Authorization = `Bearer ${newToken}`;
//         return axiosClient(originalRequest); // Retry request cũ
//       } catch (refreshErr) {
//         alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
//         window.location.href = "/login";
//         return Promise.reject(refreshErr);
//       }
//     }

//     // Các lỗi khác
//     return Promise.reject(error);
//   }
// );


// export default axiosClient;
/////////////////////////////////////////////////////////////////////
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Import jwt-decode
import { refreshAccessToken } from "../Components/Service/refreshAccessToken";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true
});

// Helper function để check token hết hạn
const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    
    // Kiểm tra exp claim (thời gian hết hạn)
    if (decoded.exp && decoded.exp < currentTime) {
      console.log('Token expired:', new Date(decoded.exp * 1000));
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true; // Nếu decode lỗi thì coi như hết hạn
  }
};

// Helper function để check token sắp hết hạn (trong 5 phút)
const isTokenNearExpiry = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    const timeUntilExpiry = decoded.exp - currentTime;
    
    // Nếu còn ít hơn 5 phút (300 giây) thì refresh
    return timeUntilExpiry < 300;
  } catch (error) {
    return true;
  }
};

// Request interceptor với token validation
axiosClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("accessToken");
    
    if (token) {
      // Kiểm tra token hết hạn trước khi gửi request
      if (isTokenExpired(token)) {
        console.log('Token expired before request, attempting refresh...');
        
        try {
          const newToken = await refreshAccessToken();
          localStorage.setItem("accessToken", newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (refreshErr) {
          console.error('Token refresh failed in request interceptor');
          localStorage.removeItem('accessToken');
          localStorage.removeItem('user');
          window.location.href = "/login";
          return Promise.reject(new Error('Token expired and refresh failed'));
        }
      } else if (isTokenNearExpiry(token)) {
        // Token sắp hết hạn, refresh nó trong background
        console.log('Token near expiry, refreshing in background...');
        
        try {
          const newToken = await refreshAccessToken();
          localStorage.setItem("accessToken", newToken);
          config.headers.Authorization = `Bearer ${newToken}`;
        } catch (refreshErr) {
          console.warn('Background token refresh failed, using current token');
          config.headers.Authorization = `Bearer ${token}`;
        }
      } else {
        // Token còn hạn, dùng bình thường
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - giữ nguyên như fallback
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('401 error, attempting token refresh...');
        const newToken = await refreshAccessToken();
        
        if (newToken) {
          localStorage.setItem("accessToken", newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosClient(originalRequest);
        }
      } catch (refreshErr) {
        console.error('Token refresh failed on 401:', refreshErr);
        
        alert("Phiên đăng nhập session của bạn đã hết. Vui lòng đăng nhập lại.");

        // Clear auth data và redirect
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Lưu current path
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/') {
          localStorage.setItem('redirectUrl', currentPath);
        }
        
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    // Handle 403 - Forbidden
    if (error.response?.status === 403) {
      console.error('403 Forbidden:', error.response.data);
      
      // Kiểm tra xem có phải do token hết hạn không
      const token = localStorage.getItem("accessToken");
      if (token && isTokenExpired(token)) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = "/login";
        return Promise.reject(error);
      }
      
      // Không phải do token, là do quyền hạn
      console.warn('Access denied - insufficient permissions');
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
