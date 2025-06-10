import React from "react";
import logo from "../assets/logo.png"; // Đổi đúng đường dẫn logo
import "./Auth.css"; // Đổi đúng đường dẫn CSS
export default function Register() {
  return (
    <div className="auth-root">
      <img src={logo} alt="GENEX MEDICAL CENTER" className="auth-logo" />
      <div className="auth-box">
        <form>
          <label>
            Tên người dùng <span className="auth-required">*</span>
          </label>
          <input type="text" className="auth-input" />
          <label>
            Mật khẩu <span className="auth-required">*</span>
          </label>
          <input type="password" className="auth-input" />
          <label>
            Xác nhận mật khẩu <span className="auth-required">*</span>
          </label>
          <input type="password" className="auth-input" />
          <label>
            Email <span className="auth-required">*</span>
          </label>
          <input type="email" className="auth-input" />
          <button type="submit" className="auth-btn main">ĐĂNG KÝ</button>
        </form>
        <div className="auth-bottom">
          BẠN ĐÃ CÓ TÀI KHOẢN? <a href="/login" className="auth-link">ĐĂNG NHẬP</a>
        </div>
      </div>
    </div>
  );
}