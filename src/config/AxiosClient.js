import axios from "axios";
import { refreshAccessToken } from "../Service/refreshAccessToken";


const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true //  dùng cookie
});

// Gắn token tự động vào mọi request nếu có
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken"); // hoặc sessionStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// (Tuỳ chọn) Bắt lỗi hết hạn token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        localStorage.setItem("accessToken", newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosClient(originalRequest); // Retry request cũ
      } catch (refreshErr) {
        alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }

    // Các lỗi khác
    return Promise.reject(error);
  }
);


export default axiosClient;
