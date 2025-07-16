// import axiosClient from "../../config/AxiosClient";

// // Hàm gọi API để lấy access token mới từ refresh token (đang nằm trong cookie)
// export async function refreshAccessToken() {
//   const res = await axiosClient.post("/api/v1/auth/refresh");
//   const accessToken = res.data.accessToken;

//   localStorage.setItem("accessToken", accessToken); // lưu lại token mới
//   return accessToken;
// }


export async function refreshAccessToken() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/v1/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    const accessToken = data.accessToken;

    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error('Refresh token failed:', error);
    throw error;
  }
}