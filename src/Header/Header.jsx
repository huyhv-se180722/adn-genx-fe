import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import iconSearch from "../assets/icon-search.png";
import iconMail from "../assets/icon-mail.png";
import iconPhone from "../assets/icon-phone.png";
import iconlogo from "../assets/icon-logo.png";
import './Header.css';

const Header = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuth();

  const handleNavLogin = () => {
    navigate("/login");
  };

  const handleNavRegister = () => {
    navigate("/register");
  };

  // const handleServiceClick = () => {
  //   navigate("/service");
  // };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
  await logout();
  navigate("/login");
};

  return (
    <>
      <div className="header">
        <div className="header-left">
          <div className="search-box">
            <input placeholder="Tìm kiếm" />
            <img src={iconSearch} alt="search" />
          </div>
        </div>
        <div className="header-center">
          <img src={iconlogo} alt="GeneX Logo" className="logo-img" />
        </div>
        <div className="header-right">
          <div className="header-contact">
            <img src={iconMail} alt="mail" />
            <span>
              <span className="mail-red">gen</span>
              <span className="mail-blue">e</span>
              <span className="mail-black">x@gmail.com</span>
            </span>
          </div>
          <div className="header-contact">
            <img src={iconPhone} alt="phone" />
            <span className="phone-bold">+98 0123456789</span>
          </div>
        </div>
      </div>

      <div className="navbar">
        <div className="nav-links">
          <span className="nav-link active" onClick={() => navigate("/")}>TRANG CHỦ</span>
          <span className="nav-link" onClick={() => navigate("/service")}>DỊCH VỤ</span>
          <span className="nav-link" onClick={() => navigate("/pricing")}>BẢNG GIÁ</span>
          <span className="nav-link" onClick={() => navigate("/guide")}>HƯỚNG DẪN</span>
          <span className="nav-link" onClick={() => navigate("/knowledge")}>KIẾN THỨC Y KHOA</span>
          <span className="nav-link" onClick={() => navigate("/result")}>TRA CỨU KẾT QUẢ</span>
        </div>
        <div className="nav-actions">
          {isLoggedIn ? (
            <div className="user-menu">
              <span
                className="user-name"
                onClick={handleProfile}
                style={{ cursor: "pointer", marginRight: 16 }}
              >
                {user?.fullName || user?.username}
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Đăng xuất
              </button>
            </div>
          ) : (
            <>
              <button className="btn-login" onClick={handleNavLogin}>
                Đăng nhập
              </button>
              <button className="btn-register" onClick={handleNavRegister}>
                Đăng ký
              </button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;