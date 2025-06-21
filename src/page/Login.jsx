import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Xử lý đăng nhập ở đây
    navigate("/admin-manage");
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center relative">
      {/* Top icons */}
      <div className="absolute left-6 top-4 flex gap-4">
        <button>
          <img src="/src/assets/avt-customer.png" alt="User" className="w-6 h-6" />
        </button>
      </div>
      <div className="absolute right-6 top-4 flex gap-4">
        <button>
          <img src="/src/assets/email-lien-he.png" alt="Email" className="w-6 h-6" />
        </button>
        <button>
          <img src="/src/assets/phone.png" alt="Phone" className="w-6 h-6" />
        </button>
      </div>
      {/* Logo */}
      <div className="flex flex-col items-center mt-4 mb-2">
        <img src="/src/assets/logo-login.png" alt="GENEX" className="w-40 h-28 object-contain" />
        <span className="text-[#2323a7] font-bold text-lg -mt-2">GENEX</span>
        <span className="text-gray-500 text-xs tracking-widest">MEDICAL CENTER</span>
      </div>
      {/* Login Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-[40px] shadow-2xl px-10 py-8 w-[480px] max-w-full flex flex-col items-center"
        style={{ boxShadow: "10px 10px 40px 0 #bbb" }}
      >
        <h2 className="text-2xl font-extrabold text-center mb-6">ĐĂNG NHẬP</h2>
        <div className="w-full mb-4">
          <label className="block font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
            required
          />
        </div>
        <div className="w-full mb-2">
          <label className="block font-semibold mb-1">Mật khẩu</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
            required
          />
        </div>
        <div className="w-full text-right mb-4">
          <a href="#" className="text-[#2323a7] text-sm font-semibold hover:underline">
            QUÊN MẬT KHẨU ?
          </a>
        </div>
        <div className="w-full flex items-center justify-center mb-2 gap-2">
          <button
            type="submit"
            className="bg-[#009fe3] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#007bbd] transition"
          >
            ĐĂNG NHẬP
          </button>
          <span className="font-semibold">Hoặc</span>
          <div className="flex items-center">
            <GoogleLogin
              onSuccess={credentialResponse => {
                navigate("/admin-manage");
              }}
              onError={() => {
                alert("Đăng nhập Google thất bại!");
              }}
              width="200"
              theme="filled_blue"
              text="signin_with"
              shape="pill"
              logo_alignment="center"
            />
          </div>
        </div>
        <div className="w-full text-center mt-2">
          <span className="text-sm">CHƯA CÓ TÀI KHOẢN? </span>
          <a href="#" className="text-[#2323a7] font-semibold hover:underline">
            ĐĂNG KÝ
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;