import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import iconSearch from "../assets/icon-search.png";
import iconMail from "../assets/icon-mail.png";
import iconPhone from "../assets/icon-phone.png";
import iconlogo from "../assets/icon-logo.png";
import './Header.css';

const Header = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const handleNavLogin = () => navigate("/login");
  const handleNavRegister = () => navigate("/register");
  const handleProfile = () => navigate("/profile");
  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <>
      <div className="home-header">
        <div className="home-header-left">
          <div className="home-search-box">
            <input placeholder="Tìm kiếm" />
            <img src={iconSearch} alt="search" />
          </div>
        </div>
        <div className="home-header-center">
          <img
            src={iconlogo}
            alt="GeneX Logo"
            className="home-logo-img"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          />
        </div>
        <div className="home-header-right">
          <div className="home-header-contact">
            <img src={iconMail} alt="mail" />
            <span>
              <span className="home-mail-red">gen</span>
              <span className="home-mail-blue">e</span>
              <span className="home-mail-black">x@gmail.com</span>
            </span>
          </div>
          <div className="home-header-contact">
            <img src={iconPhone} alt="phone" />
            <span className="home-phone-bold">+98 0123456789</span>
          </div>
        </div>
      </div>

      <div className="home-navbar">
        <div className="home-nav-links">
          <span className={`home-nav-link${location.pathname === '/' ? ' active' : ''}`} onClick={() => navigate("/")}>TRANG CHỦ</span>
          <span className={`home-nav-link${location.pathname === '/service' ? ' active' : ''}`} onClick={() => navigate("/service")}>DỊCH VỤ</span>
          <span className={`home-nav-link${location.pathname === '/pricing' ? ' active' : ''}`} onClick={() => navigate("/pricing")}>BẢNG GIÁ</span>
          <span className={`home-nav-link${location.pathname === '/guide' ? ' active' : ''}`} onClick={() => navigate("/guide")}>HƯỚNG DẪN</span>
          <span className={`home-nav-link${location.pathname === '/knowledge' ? ' active' : ''}`} onClick={() => navigate("/knowledge")}>KIẾN THỨC Y KHOA</span>
          <span className={`home-nav-link${location.pathname === '/result' ? ' active' : ''}`} onClick={() => navigate("/result")}>TRA CỨU KẾT QUẢ</span>
          <span
            className="home-nav-link"
            onClick={() => {
              if (location.pathname !== "/") {
                navigate("/", { replace: false });
                setTimeout(() => {
                  const el = document.getElementById("adn-pricing-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }, 300);
              } else {
                const el = document.getElementById("adn-pricing-section");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }
            }}
          >
            ĐĂNG KÝ XÉT NGHIỆM ADN
          </span>
        </div>
        <div className="home-nav-actions">
          {isLoggedIn ? (
            <div className="home-user-menu">
              <span
                className="home-user-name"
                onClick={handleProfile}
                style={{ cursor: "pointer", marginRight: 16 }}
              >
                {user?.fullName || user?.username}
              </span>
              <button onClick={handleLogout} className="home-logout-btn">
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <button className="home-btn-login" onClick={handleNavLogin}>
                Đăng nhập
              </button>
              <button className="home-btn-register" onClick={handleNavRegister}>
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
      <div className="main-content">
        {children}
      </div>
    </>
  );
};

export default Header;