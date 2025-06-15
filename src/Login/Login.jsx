import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";
import logo from "../assets/logo.png";
import logogoogle from "../assets/logogoogle.png";
import "./Auth.css";

const API_BASE_URL = "https://2642-2405-4802-8033-c420-6d55-f41-2cf0-d4b0.ngrok-free.app";
const GOOGLE_REDIRECT_URI = "https://accounts.google.com/o/oauth2/v2/auth?client_id=443615178916-5p9djk25jon368lljhovev11s40p19j1.apps.googleusercontent.com&redirect_uri=http://localhost:3000/oauth2/callback&response_type=code&scope=openid%20email%20profile&access_type=offline&prompt=consent";
export default function Login() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    username: "",
    password: ""
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

    if (!formData.username || !formData.password) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/v1/auth/login`, formData);

      // Lưu token và thông tin user vào context
      login(response.data);

      // Kiểm tra và xử lý redirect
      const redirectUrl = localStorage.getItem("redirectUrl");
      navigate(redirectUrl || "/");
      localStorage.removeItem("redirectUrl");
    } catch (err) {
      setError(err.response?.data?.message || "Tên đăng nhập hoặc mật khẩu không chính xác!");
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
          <label>Tên đăng nhập</label>
          <input
            type="text"
            name="username"
            className="auth-input"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            name="password"
            className="auth-input"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <div className="auth-forgot">
            <a href="/forgot" className="auth-link">QUÊN MẬT KHẨU?</a>
          </div>

          <div className="auth-btn-row">
            <button
              type="submit"
              className="auth-btn main"
              disabled={loading}
            >
              {loading ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
            </button>
            <span>Hoặc</span>
            <a
              href={GOOGLE_REDIRECT_URI}
              className="auth-btn google"
            >
              <img src={logogoogle} alt="Google" className="google-icon" />
              GOOGLE
            </a>
          </div>
        </form>

        <div className="auth-bottom">
          CHƯA CÓ TÀI KHOẢN? <a href="/register" className="auth-link">ĐĂNG KÝ</a>
        </div>
      </div>
    </div>
  );
}
