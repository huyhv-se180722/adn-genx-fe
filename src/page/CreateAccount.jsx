import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const CreateAccount = () => {
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirm: "",
    email: "",
    role: "Nhân viên xét nghiệm",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Lấy danh sách tài khoản hiện tại từ localStorage
    const accounts = JSON.parse(localStorage.getItem("accounts") || "[]");
    // Thêm tài khoản mới
    accounts.push({
      name: form.username,
      email: form.email,
      role: form.role,
    });
    // Lưu lại vào localStorage
    localStorage.setItem("accounts", JSON.stringify(accounts));
    // Chuyển hướng sang trang AccountManage
    navigate("/account-manage");
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#2323a7] flex flex-col min-h-screen">
        <div className="flex items-center justify-center py-8">
          <img src="/src/assets/logo.png" alt="GeneX" className="w-[180px]" />
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-white font-semibold text-base px-6">
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/admin-manage")}>
              <img src="/src/assets/home-icon.png" alt="" className="w-5 h-5" />
              TRANG CHỦ
            </li>
            <li>
              <div className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
                <img src="/src/assets/setting-thu-muc.png" alt="" className="w-5 h-5" />
                QUẢN LÝ TÀI KHOẢN
              </div>
              <ul className="ml-8 mt-1 text-sm font-normal">
                <li className="py-1 text-white cursor-pointer underline" onClick={() => navigate("/account-manage")}>Nhân viên</li>
                <li className="py-1 text-white cursor-pointer hover:underline" onClick={() => navigate("/customer-manage")}>Khách hàng</li>
              </ul>
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/service-manage")}>
              <img src="/src/assets/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ DỊCH VỤ
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/blog-manage")}>
              <img src="/src/assets/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ BLOG
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center bg-[#f3f3f3] px-8 py-4">
          <img src="/src/assets/avt-customer.png" alt="avatar" className="w-16 h-16 rounded-full border-2 border-[#2323a7]" />
          <div className="ml-4 flex flex-col">
            <span className="bg-[#009fe3] text-white px-4 py-1 rounded-full text-xs font-bold w-fit mb-1">ADMIN</span>
            <span className="font-bold text-lg text-[#2323a7]">NGUYỄN VĂN ADMIN</span>
          </div>
          <div className="flex-1"></div>
          <button
            className="bg-[#009fe3] text-white flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow hover:bg-[#007bbd] transition"
            onClick={() => navigate("/login")}
          >
            <img src="/src/assets/dang-xuat.png" alt="" className="w-5 h-5" />
            <span>ĐĂNG XUẤT</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 flex items-center justify-center bg-white">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[48px] shadow-2xl px-16 py-10 w-[600px] max-w-full"
            style={{ boxShadow: "10px 10px 40px 0 #bbb" }}
          >
            <h2 className="text-3xl font-extrabold text-center mb-8">TẠO TÀI KHOẢN</h2>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="font-semibold block mb-2">
                  Tên người dùng <span className="text-red-500">(*)</span>
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold block mb-2">Vai trò:</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                >
                  <option>Nhân viên xét nghiệm</option>
                  <option>Nhân viên ghi nhận</option>
                </select>
                <div className="text-xs text-gray-500 mt-1">
                  Lưu ý: chỉ có thể thêm tài khoản nhân viên xét nghiệm hoặc ghi nhận
                </div>
              </div>
            </div>
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                Mật khẩu <span className="text-red-500">(*)</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
            </div>
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                Xác nhận mật khẩu <span className="text-red-500">(*)</span>
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
            </div>
            <div className="mb-8">
              <label className="font-semibold block mb-2">
                Email <span className="text-red-500">(*)</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
            </div>
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-[#009fe3] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#007bbd] transition"
              >
                TẠO TÀI KHOẢN
              </button>
              <button
                type="button"
                className="bg-gray-300 text-[#2323a7] px-8 py-2 rounded-full font-semibold shadow hover:bg-gray-400 transition"
                onClick={() => navigate("/account-manage")}
              >
                HỦY BỎ
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateAccount;