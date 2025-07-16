import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import "./index.css";

const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")                      // Tách dấu khỏi chữ
    .replace(/[\u0300-\u036f]/g, "")      // Xóa dấu
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
};

const BlogManage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "Admin";
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    axiosClient
      .get(`/api/blogs?page=${page}&size=5`)
      .then((res) => {
        console.log("Fetched blogs:", res.data);
        setBlogs(res.data.content || []);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => {
        console.error("Lỗi khi gọi API blog:", err);
        setBlogs([]);
        setTotalPages(0);
      });
  }, [page]);

  const handleDelete = async (blogId) => {
    if (!window.confirm("Bạn có chắc muốn xóa blog này?")) return;
    try {
      await axiosClient.delete(`/api/blogs/${blogId}`);
      // Reload lại trang hiện tại sau khi xóa
      const res = await axiosClient.get(`/api/blogs?page=${page}&size=5`);
      setBlogs(res.data.content || []);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      alert("Lỗi khi xóa blog!");
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

  const filteredBlogs = blogs.filter((b) =>
    removeVietnameseTones(b.title || "").includes(removeVietnameseTones(search))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 flex relative overflow-hidden">
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

      {/* Sidebar */}
      <div className="w-80 bg-gradient-to-b from-purple-900 to-blue-900 border-r border-white/20 p-6 relative z-10 flex flex-col">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">GeneX</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
        </div>

        {/* User Profile */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-white/20">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg">
                <img src="/src/assets/Admin/avt-customer.png" alt="avatar" className="w-10 h-10 rounded-full border-2 border-white/30" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <div className="bg-gradient-to-r from-cyan-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold w-fit mb-1">
                ADMIN
              </div>
              <h2 className="text-lg font-bold text-white">{fullName}</h2>
            </div>
          </div>
          <button
            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 w-full justify-center"
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Đăng xuất
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1">
          <nav className="space-y-3">
            <button
              onClick={() => navigate("/admin/dashboard")}
              className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <i className="bi bi-house-door"></i>
              TRANG CHỦ
            </button>
            
            <div className="relative group">
              <button
                className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="bi bi-people"></i>
                QUẢN LÝ TÀI KHOẢN
                <i className="bi bi-chevron-down ml-auto group-hover:rotate-180 transition-transform duration-300"></i>
              </button>
              <div className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300 ease-in-out">
                <div className="p-3">
                  <button
                    onClick={() => navigate("/account-manage")}
                    className="w-full text-left text-white hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium border-b border-white/20"
                  >
                    Nhân viên
                  </button>
                  <button
                    onClick={() => navigate("/customer-manage")}
                    className="w-full text-left text-white hover:text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium"
                  >
                    Khách hàng
                  </button>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <button
                className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                <i className="bi bi-gear"></i>
                QUẢN LÝ DỊCH VỤ
                <i className="bi bi-chevron-down ml-auto group-hover:rotate-180 transition-transform duration-300"></i>
              </button>
              <div className="w-full bg-white/20 backdrop-blur-xl border border-white/30 rounded-xl shadow-2xl max-h-0 overflow-hidden group-hover:max-h-40 transition-all duration-300 ease-in-out">
                <div className="p-3">
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
            </div>
            
            <button
              onClick={() => navigate("/blog-manage")}
              className="w-full flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg"
            >
              <i className="bi bi-journal-text"></i>
              QUẢN LÝ BLOG
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-6 mb-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">QUẢN LÝ BLOG</h1>
              <p className="text-white/70">Quản lý blog hệ thống</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Hoạt động</span>
            </div>
          </div>
        </div>

        {/* Blog Management Content */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              ✨ Quản lý blog ✨
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          {/* Search & Add Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="relative flex-1 max-w-2xl">
              <input
                type="text"
                placeholder="🔍 Tìm kiếm blog..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl outline-none text-white placeholder-white/60 focus:border-cyan-400 focus:bg-white/20 transition-all duration-300"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <i className="bi bi-search text-white/60"></i>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/new-blog")}
              className="ml-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <i className="bi bi-plus-circle text-xl"></i>
              Tạo blog mới
            </button>
          </div>

          {/* Blog List */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl mb-8">
            <div className="space-y-4 p-6">
              {[...filteredBlogs]
                .filter(b => b.id)
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .map((b) => (
                  <div key={b.id} className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
                        <div className="text-white/80 mb-4 leading-relaxed">
                          {b.content ? (b.content.length > 150 ? b.content.slice(0, 150) + "..." : b.content) : ""}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-white/60">
                          <span className="flex items-center gap-2">
                            <i className="bi bi-person"></i>
                            {b.authorName}
                          </span>
                          <span className="flex items-center gap-2">
                            <i className="bi bi-calendar"></i>
                            {b.createdAt?.slice(0, 10)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 ml-6">
                        <button
                          onClick={() => navigate(`/blog-edit/${b.id}`)}
                          className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <i className="bi bi-pencil"></i>
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
                        >
                          <i className="bi bi-trash"></i>
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-6 mb-8">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-cyan-400 font-semibold">Tổng blog</p>
                  <p className="text-3xl font-bold text-white">{blogs.length}</p>
                </div>
                <div className="w-12 h-12 bg-cyan-500/30 rounded-full flex items-center justify-center">
                  <i className="bi bi-journal-text text-cyan-400 text-xl"></i>
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
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
    </div>
  );
};

export default BlogManage;