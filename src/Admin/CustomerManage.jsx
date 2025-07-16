import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import "./index.css";

const CustomerManage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "Admin";

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);

  useEffect(() => {
    fetchCustomers(page);
  }, [page]);

  const fetchCustomers = async (pageNumber) => {
    try {
      const res = await axiosClient.get("/api/admin/users/filter", {
        params: { page: pageNumber, size: 10, role: "CUSTOMER" },
      });
      const data = res.data;
      setCustomers(data.content || []);
      setTotalPages(data.totalPages || 1);
    } catch (err) {
      console.error("Lỗi khi tải danh sách khách hàng:", err);
      setCustomers([]);
    }
  };

  const handleDelete = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) return;
  try {
    await axiosClient.delete(`/api/admin/users/${id}`);
    setCustomers((prev) => prev.filter((user) => user.id !== id));
  } catch (err) {
    console.error("Xoá thất bại:", err);
    alert("Không thể xoá khách hàng.");
  }
};

  const handleToggleLock = async (user) => {
    try {
      await axiosClient.put(`/api/admin/status/${user.id}`, null, {
        params: {
          enabled: true,
          accountNonLocked: !user.accountNonLocked,
        },
      });

      setCustomers((prev) =>
        prev.map((u) =>
          u.id === user.id
            ? { ...u, accountNonLocked: !u.accountNonLocked }
            : u
        )
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật trạng thái khóa:", err);
      alert("Không thể thay đổi trạng thái tài khoản.");
    }
  };

  const handleLogout = () => {
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
  };

  const filteredCustomers = customers.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex flex-col items-center py-10 px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 mb-8 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <img src="/src/assets/Admin/avt-customer.png" alt="avatar" className="w-16 h-16 rounded-full border-2 border-white/30" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-4 py-1 rounded-full text-sm font-bold w-fit mb-2 shadow-lg">
                ADMIN
              </div>
              <h1 className="text-2xl font-bold text-white mb-1">{fullName}</h1>
              <p className="text-white/70 text-sm">Quản lý tài khoản khách hàng</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Hoạt động</span>
            </div>
            <button
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right"></i>
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mb-8 relative z-10">
        <div className="flex items-center justify-center gap-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="bi bi-house-door"></i>
            Trang chủ
          </button>
          
          <div className="relative group">
            <button
              className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg"
              onClick={() => setShowAccountDropdown(!showAccountDropdown)}
            >
              <i className="bi bi-people"></i>
              Quản lý tài khoản
            </button>
            <div className="absolute bottom-full left-0 mb-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-4 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => navigate("/account-manage")}
                className="w-full text-left text-white hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium border-b border-white/20"
              >
                Nhân viên
              </button>
              <button
                onClick={() => navigate("/customer-manage")}
                className="w-full text-left text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium underline"
              >
                Khách hàng
              </button>
            </div>
          </div>
          
          <div className="relative group">
            <button
              className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <i className="bi bi-gear"></i>
              Quản lý dịch vụ
            </button>
            <div className="absolute bottom-full left-0 mb-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-2xl p-4 min-w-[200px] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                onClick={() => navigate("/service-manage")}
                className="w-full text-left text-white hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium border-b border-white/20"
              >
                Gói dịch vụ
              </button>
              <button
                onClick={() => navigate("/kit-manage")}
                className="w-full text-left text-white hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium"
              >
                Quản lý KIT
              </button>
            </div>
          </div>
          
          <button
            onClick={() => navigate("/blog-manage")}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="bi bi-journal-text"></i>
            Quản lý blog
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-7xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            ✨ Quản lý tài khoản - Khách hàng ✨
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        {/* Search Section */}
        <div className="flex items-center justify-center mb-8">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm theo tên khách hàng..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl outline-none text-white placeholder-white/60 focus:border-cyan-400 focus:bg-white/20 transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <i className="bi bi-search text-white/60"></i>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-white font-semibold">HỌ VÀ TÊN</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">EMAIL</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">VAI TRÒ</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">TRẠNG THÁI</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((u, idx) => (
                  <tr key={u.id || idx} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                    <td className="px-6 py-4 text-white">{u.fullName}</td>
                    <td className="px-6 py-4 text-white/90 font-medium">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className="bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span
                          className={`px-3 py-1 rounded-full font-semibold text-sm ${
                            u.accountNonLocked
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : "bg-red-500/20 text-red-400 border border-red-500/30"
                          }`}
                        >
                          {u.accountNonLocked ? "Hoạt động" : "Bị khóa"}
                        </span>
                        <button
                          onClick={() => {
                            const action = u.accountNonLocked ? "khóa" : "mở khóa";
                            const confirmMsg = `Bạn có muốn ${action} người dùng này không?`;
                            if (window.confirm(confirmMsg)) {
                              handleToggleLock(u);
                            }
                          }}
                          className={`px-3 py-1 rounded-full font-semibold text-sm transition-all duration-300 transform hover:scale-105 ${
                            u.accountNonLocked
                              ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30"
                              : "bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30"
                          }`}
                        >
                          {u.accountNonLocked ? "Khóa" : "Mở khóa"}
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                      >
                        <i className="bi bi-trash"></i>
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredCustomers.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-people text-white/60 text-3xl"></i>
            </div>
            <p className="text-white/70 text-lg">
              {search ? "Không tìm thấy khách hàng nào" : "Chưa có khách hàng nào"}
            </p>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center items-center gap-6">
          <button
            disabled={page <= 0}
            onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            <i className="bi bi-chevron-left"></i>
            Trang trước
          </button>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 border border-white/20">
            <span className="text-white font-semibold">
              Trang {page + 1} / {totalPages}
            </span>
          </div>
          
          <button
            disabled={page >= totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
          >
            Trang sau
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 font-semibold">Tổng khách hàng</p>
                <p className="text-3xl font-bold text-white">{customers.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/30 rounded-full flex items-center justify-center">
                <i className="bi bi-people text-cyan-400 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-semibold">Trang hiện tại</p>
                <p className="text-3xl font-bold text-white">{page + 1}</p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                <i className="bi bi-file-earmark-text text-green-400 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 font-semibold">Tổng trang</p>
                <p className="text-3xl font-bold text-white">{totalPages}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                <i className="bi bi-files text-purple-400 text-xl"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
      <div className="absolute bottom-10 left-10 w-16 h-16 border-2 border-purple-400/30 rounded-full animate-spin" style={{animationDuration: '15s'}}></div>
    </div>
  );
};

export default CustomerManage;