import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";
import axiosClient from "../config/AxiosClient";
import logo from "../assets/logo.png";
import "./Auth.css";

// const API_BASE_URL = "https://4cd2-118-69-70-166.ngrok-free.app";
// const GOOGLE_REDIRECT_URI = "http://localhost:3000/oauth2/callback";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    fullName: "",
    phoneNumber: "",
    password: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, fullName, phoneNumber, password, confirmPassword } = formData;
    // Kiểm tra các trường bắt buộc
    if (!username || !email || !fullName || !phoneNumber || !password || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra mật khẩu khớp
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    // Kiểm tra độ dài mật khẩu
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Kiểm tra định dạng số điện thoại
    const phoneRegex = /^[0-9]{9,11}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("Số điện thoại không hợp lệ!");
      return;
    }

    setLoading(true);
    try {
      // Log dữ liệu gửi đi
      const dataToSend = {
        username: formData.username,
        email: formData.email,
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        password: formData.password
      };
      console.log("Dữ liệu gửi lên backend:", dataToSend);

      const response = await axiosClient.post("/api/v1/auth/register", dataToSend);


      alert("Đăng ký thành công!");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Đăng ký thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-root">
      <img src={logo} alt="GENEX MEDICAL CENTER" className="auth-logo" />
      <div className="auth-box">
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-columns">
            <div className="form-col">
              <label>
                Tên đăng nhập <span className="auth-required">*</span>
              </label>
              <input
                type="text"
                name="username"
                className="auth-input"
                value={formData.username}
                onChange={handleChange}
                required
              />

              <label>Họ và tên</label>
              <input
                type="text"
                name="fullName"
                className="auth-input"
                value={formData.fullName}
                onChange={handleChange}
              />

              <label>
                Mật khẩu <span className="auth-required">*</span>
              </label>
              <input
                type="password"
                name="password"
                className="auth-input"
                value={formData.password}
                onChange={handleChange}
                required
                minLength={6}
              />
            </div>

            <div className="form-col">
              <label>
                Email <span className="auth-required">*</span>
              </label>
              <input
                type="email"
                name="email"
                className="auth-input"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <label>Số điện thoại</label>
              <input
                type="tel"
                name="phoneNumber"
                className="auth-input"
                value={formData.phoneNumber}
                onChange={handleChange}
              />

              <label>
                Xác nhận mật khẩu <span className="auth-required">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                className="auth-input"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="auth-btn main"
            disabled={loading}
          >
            {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
          </button>
        </form>

        <div className="auth-bottom">
          BẠN ĐÃ CÓ TÀI KHOẢN?{" "}
          <a href="/login" className="auth-link">
            ĐĂNG NHẬP
          </a>
        </div>
      </div>
    </div>
  );
}
