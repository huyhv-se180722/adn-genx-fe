import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import "./index.css";

const AccountManage = () => {
  const [accounts, setAccounts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
  axiosClient
    .get(`/api/admin/users/filter?page=${page}&size=10`)
    .then((res) => {
      const filtered = (res.data.content || []).filter(
        (acc) => acc.role !== "CUSTOMER"
      );
      setAccounts(filtered);
      setTotalPages(res.data.totalPages || 1);
    })
    .catch(() => setAccounts([]));
}, [page]);

  const handleDelete = async (id) => {
    try {
      await axiosClient.delete(`/api/admin/users/${id}`);
      const updated = accounts.filter((acc) => acc.id !== id);
      setAccounts(updated);
    } catch (err) {
      console.error("Xoá thất bại:", err);
    }
  };

  const filteredAccounts = accounts.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase())
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "ADMIN";

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#2323a7] flex flex-col min-h-screen">
        <div className="flex items-center justify-center py-8">
          <img src="/src/assets/Admin/logo.png" alt="GeneX" className="w-[180px]" />
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-white font-semibold text-base px-6">
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
              <img src="/src/assets/Admin/home-icon.png" alt="" className="w-5 h-5" />
              TRANG CHỦ
            </li>
            <li>
              <div className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
                <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
                QUẢN LÝ TÀI KHOẢN
              </div>
              <ul className="ml-8 mt-1 text-sm font-normal">
                <li className="py-1 text-white cursor-pointer underline" onClick={() => navigate("/account-manage")}>Nhân viên</li>
                <li className="py-1 text-white cursor-pointer hover:underline" onClick={() => navigate("/customer-manage")}>Khách hàng</li>
              </ul>
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/service-manage")}>
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ DỊCH VỤ
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/blog-manage")}>
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ BLOG
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="flex items-center bg-[#f3f3f3] px-8 py-4">
          <img src="/src/assets/Admin/avt-customer.png" alt="avatar" className="w-16 h-16 rounded-full border-2 border-[#2323a7]" />
          <div className="ml-4 flex flex-col">
            <span className="bg-[#009fe3] text-white px-4 py-1 rounded-full text-xs font-bold w-fit mb-1">ADMIN</span>
            <span className="font-bold text-lg text-[#2323a7]">{fullName}</span>
          </div>
          <div className="flex-1"></div>
          <button
            className="bg-[#009fe3] text-white flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow hover:bg-[#007bbd] transition"
            onClick={() => {
              // Clear all user data from localStorage
              localStorage.removeItem("user");
              localStorage.removeItem("authToken");
              localStorage.removeItem("refreshToken");
              localStorage.removeItem("token");
              localStorage.removeItem("accessToken");
              localStorage.removeItem("userInfo");
              localStorage.removeItem("userData");
              // Also clear sessionStorage if used
              sessionStorage.removeItem("user");
              sessionStorage.removeItem("authToken");
              sessionStorage.removeItem("refreshToken");
              sessionStorage.removeItem("token");
              sessionStorage.removeItem("accessToken");
              sessionStorage.clear();
              // Navigate to home page and force reload
              navigate("/");
              window.location.reload();
            }}
          >
            <img src="/src/assets/Admin/dang-xuat.png" alt="" className="w-5 h-5" />
            <span>ĐĂNG XUẤT</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">NHÂN VIÊN</h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên đăng nhập..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[400px] px-5 py-3 rounded-xl shadow text-black outline-none border border-gray-200"
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border border-gray-400 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-4 py-2 text-left">TÊN ĐĂNG NHẬP</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">EMAIL</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">VAI TRÒ</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">QUẢN LÝ</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((u, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="border border-gray-400 px-4 py-2">{u.username}</td>
                    <td className="border border-gray-400 px-4 py-2 font-bold">{u.email}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      <span className="text-white px-3 py-1 rounded-full font-semibold bg-[#009fe3]">{u.role}</span>
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <button
                        className="bg-[#ff4d4d] text-white px-6 py-1 rounded font-semibold hover:bg-red-600"
                        onClick={() => handleDelete(u.id)}
                      >
                        XÓA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={page <= 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-gray-700 font-medium self-center">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>

          {/* Create Account Button */}
          <div className="flex justify-end mt-8">
            <button
              className="bg-[#009fe3] text-white px-8 py-2 rounded-full font-semibold shadow"
              onClick={() => navigate("/create-account")}
            >
              TẠO TÀI KHOẢN
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AccountManage;
