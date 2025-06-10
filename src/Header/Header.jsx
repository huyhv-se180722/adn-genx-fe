import React from 'react';
import { useNavigate } from 'react-router-dom';
import iconSearch from "../assets/icon-search.png";
import iconMail from "../assets/icon-mail.png";
import iconPhone from "../assets/icon-phone.png";
import iconlogo from "../assets/icon-logo.png";
import './Header.css';
const Header = () => {
  const navigate = useNavigate();

  const handleNavLogin = () => {
    navigate("/login");
  };

  const handleNavRegister = () => {
    navigate("/register");
  };

  const handleServiceClick = () => {
    navigate("/service");
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
          <span className="nav-link active">TRANG CHỦ</span>
          <span className="nav-link" onClick={handleServiceClick}>DỊCH VỤ</span>
          <span className="nav-link">BẢNG GIÁ</span>
          <span className="nav-link">HƯỚNG DẪN</span>
          <span className="nav-link">KIẾN THỨC Y KHOA</span>
          <span className="nav-link">TRA CỨU KẾT QUẢ</span>
        </div>
        <div className="nav-actions">
          <button className="btn-login" onClick={handleNavLogin}>
            Đăng nhập
          </button>
          <button className="btn-register" onClick={handleNavRegister}>
            Đăng ký
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;