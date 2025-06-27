import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../Context/AuthContext";
import iconSearch from "../assets/icon-search.png";
import iconMail from "../assets/icon-mail.png";
import iconPhone from "../assets/icon-phone.png";
import iconlogo from "../assets/icon-logo.png";
import Notification from "./Notification";
import './Header.css';

const userDefaultAvatar = "https://i.pravatar.cc/32";

const Header = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, user, logout } = useAuth();

  const handleNavLogin = () => navigate("/login");
  const handleNavRegister = () => navigate("/register");
  const handleProfile = () => navigate("/customer/profile");

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleClickAdnRegister = () => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById("adn-pricing-section");
        el?.scrollIntoView({ behavior: "smooth" });
      }, 500);
    } else {
      const el = document.getElementById("adn-pricing-section");
      el?.scrollIntoView({ behavior: "smooth" });
    }
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
          <img src={iconlogo} alt="GeneX Logo" className="home-logo-img" />
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
          {[
            { path: "/", label: "TRANG CHỦ" },
            { path: "/service", label: "DỊCH VỤ" },
            { path: "/pricing", label: "BẢNG GIÁ" },
            { path: "/guide", label: "HƯỚNG DẪN" },
            { path: "/knowledge", label: "KIẾN THỨC Y KHOA" },
            { path: "/result", label: "TRA CỨU KẾT QUẢ" }
          ].map(({ path, label }) => (
            <span
              key={path}
              className={`home-nav-link${location.pathname === path ? ' active' : ''}`}
              onClick={() => navigate(path)}
            >
              {label}
            </span>
          ))}
          <span className="home-nav-link" onClick={handleClickAdnRegister}>
            ĐĂNG KÝ XÉT NGHIỆM ADN
          </span>
        </div>

        <div className="home-nav-actions">
          {isLoggedIn ? (
            <div className="home-user-menu">
              <Notification/>
              <img
                src={user?.avatar || userDefaultAvatar}
                alt="avatar"
                className="home-avatar"
                onClick={handleProfile}
              />
              <span className="home-user-name" onClick={handleProfile}>
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