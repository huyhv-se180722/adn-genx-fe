
import logo from "../assets/logo.png"; // Đổi đúng đường dẫn logo
import logogoogle from "../assets/logogoogle.png"; // Đổi đúng đường dẫn logo Google
import "./Auth.css"; // Đổi đúng đường dẫn CSS

export default function Login({ onGoogleLogin }) {
  return (
    <div className="auth-root">
      <img src={logo} alt="GENEX MEDICAL CENTER" className="auth-logo" />
      <div className="auth-box">
        <form>
          <label>Email</label>
          <input type="email" className="auth-input" />
          <label>Mật khẩu</label>
          <input type="password" className="auth-input" />
          <div className="auth-forgot">
            <a href="/forgot" className="auth-link">QUÊN MẬT KHẨU ?</a>
          </div>
          <div className="auth-btn-row">
            <button type="submit" className="auth-btn main">ĐĂNG NHẬP</button>
            <span>Hoặc</span>
            <a
  href="https://accounts.google.com/o/oauth2/v2/auth?scope=email%20profile&access_type=offline&include_granted_scopes=true&response_type=code&redirect_uri=http://localhost:8080/oauth2/callback&client_id=443615178916-5p9djk25jon368lljhovev11s40p19j1.apps.googleusercontent.com"
  className="auth-btn google"
>
  <img src={logogoogle} alt="Google" className="google-icon" />
  Google
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