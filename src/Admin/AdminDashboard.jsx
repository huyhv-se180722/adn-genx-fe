import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import axiosClient from "../config/AxiosClient";
import "./index.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const AdminDashboard = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "Admin";
  const [dashboard, setDashboard] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [monthlyRevenue, setMonthlyRevenue] = useState(null);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axiosClient.get("/api/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDashboard(res.data);

      if (selectedMonth === currentMonth && selectedYear === currentYear) {
        setMonthlyRevenue(res.data.monthlyRevenue);
      }
    } catch (err) {
      console.error("Lỗi lấy thống kê:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (!dashboard) return;

    if (selectedMonth === currentMonth && selectedYear === currentYear) {
      setMonthlyRevenue(dashboard.monthlyRevenue);
      return;
    }

    const fetchMonthlyRevenue = async () => {
      try {
        const res = await axiosClient.get(
          `/api/admin/dashboard/revenue?month=${selectedMonth}&year=${selectedYear}`
        );
        setMonthlyRevenue(res.data.monthlyRevenue);
      } catch (err) {
        console.error("Lỗi lấy doanh thu tháng:", err);
        setMonthlyRevenue(0);
      }
    };

    fetchMonthlyRevenue();
  }, [selectedMonth, selectedYear, dashboard]);

  const pieData = dashboard
    ? {
        labels: [
          "Tổng người dùng",
          "Nhân viên",
          "Khách hàng",
          "Blog",
          "Dịch vụ",
          "Đơn đã thanh toán",
        ],
        datasets: [
          {
            data: [
              dashboard.totalUsers,
              dashboard.totalStaff,
              dashboard.totalCustomers,
              dashboard.totalBlogs,
              dashboard.totalServices,
              dashboard.totalPayments,
            ],
            backgroundColor: [
              "#5caaff",
              "#aaffc3",
              "#ffe0b2",
              "#ffb3b3",
              "#ffd966",
              "#c4b5fd",
            ],
            borderWidth: 1,
          },
        ],
      }
    : null;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("userData");
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("accessToken");
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  // Format tiền VNĐ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

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

      {/* Sidebar Navigation */}
      <div className="w-80 bg-gradient-to-b from-purple-900 to-blue-900 border-r border-white/20 p-6 relative z-10 flex flex-col">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">GeneX</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"></div>
        </div>

        {/* User Info */}
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
              className="w-full flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold shadow-lg"
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
              className="w-full flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-4 py-3 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
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
              <h1 className="text-3xl font-bold text-white mb-2">TRANG CHỦ</h1>
              <p className="text-white/70">Bảng điều khiển quản trị</p>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Hoạt động</span>
            </div>
          </div>
        </div>

        {/* Stats Cards Container */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8 relative z-10 mb-8">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              ✨ Bảng điều khiển Admin ✨
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
          </div>

          {/* Main Stats Cards - 4 columns */}
          {dashboard && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-400/20 backdrop-blur-sm rounded-2xl border border-blue-400/30 p-6 hover:bg-blue-400/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-blue-500/30 p-4 rounded-full mb-4 mx-auto w-fit">
                    <i className="bi bi-cart text-blue-200 text-3xl"></i>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{dashboard.totalPayments}</div>
                  <div className="text-blue-200 font-semibold">Đặt hàng</div>
                </div>
              </div>
              <div className="bg-green-400/20 backdrop-blur-sm rounded-2xl border border-green-400/30 p-6 hover:bg-green-400/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-green-500/30 p-4 rounded-full mb-4 mx-auto w-fit">
                    <i className="bi bi-person-badge text-green-200 text-3xl"></i>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{dashboard.totalStaff}</div>
                  <div className="text-green-200 font-semibold">Nhân viên</div>
                </div>
              </div>
              <div className="bg-orange-400/20 backdrop-blur-sm rounded-2xl border border-orange-400/30 p-6 hover:bg-orange-400/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-orange-500/30 p-4 rounded-full mb-4 mx-auto w-fit">
                    <i className="bi bi-person-heart text-orange-200 text-3xl"></i>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{dashboard.totalCustomers}</div>
                  <div className="text-orange-200 font-semibold">Khách hàng</div>
                </div>
              </div>
              <div className="bg-red-400/20 backdrop-blur-sm rounded-2xl border border-red-400/30 p-6 hover:bg-red-400/30 transition-all duration-300">
                <div className="text-center">
                  <div className="bg-red-500/30 p-4 rounded-full mb-4 mx-auto w-fit">
                    <i className="bi bi-journal-text text-red-200 text-3xl"></i>
                  </div>
                  <div className="text-4xl font-bold text-white mb-2">{dashboard.totalBlogs}</div>
                  <div className="text-red-200 font-semibold">Blog</div>
                </div>
              </div>
            </div>
          )}

          {/* Additional Stats Cards */}
          {dashboard && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-blue-500/20 p-4 rounded-full mr-4">
                    <i className="bi bi-people text-blue-400 text-3xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{dashboard.totalUsers}</div>
                    <div className="text-blue-400 font-semibold">Tổng người dùng</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-cyan-500/20 p-4 rounded-full mr-4">
                    <i className="bi bi-gear text-cyan-400 text-3xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{dashboard.totalServices}</div>
                    <div className="text-cyan-400 font-semibold">Tổng dịch vụ</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-blue-500/20 p-4 rounded-full mr-4">
                    <i className="bi bi-calendar-day text-blue-400 text-3xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{dashboard.todayRevenue ? formatCurrency(dashboard.todayRevenue) : '0 ₫'}</div>
                    <div className="text-blue-400 font-semibold">Doanh thu hôm nay</div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-yellow-500/20 p-4 rounded-full mr-4">
                    <i className="bi bi-calendar-month text-yellow-400 text-3xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatCurrency(monthlyRevenue ?? 0)}</div>
                    <div className="text-yellow-400 font-semibold">
                      Doanh thu tháng
                      <div className="flex gap-1 mt-1">
                        <select 
                          value={selectedMonth} 
                          onChange={(e) => setSelectedMonth(Number(e.target.value))} 
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-white backdrop-blur-sm"
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                            <option key={m} value={m} className="bg-gray-800 text-white">{`Tháng ${m}`}</option>
                          ))}
                        </select>
                        <select 
                          value={selectedYear} 
                          onChange={(e) => setSelectedYear(Number(e.target.value))} 
                          className="px-2 py-1 bg-white/10 border border-white/20 rounded text-sm text-white backdrop-blur-sm"
                        >
                          {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                            <option key={y} value={y} className="bg-gray-800 text-white">{y}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-6 hover:bg-white/20 transition-all duration-300">
                <div className="flex items-center">
                  <div className="bg-green-500/20 p-4 rounded-full mr-4">
                    <i className="bi bi-currency-dollar text-green-400 text-3xl"></i>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{dashboard.totalRevenue ? formatCurrency(dashboard.totalRevenue) : '0 ₫'}</div>
                    <div className="text-green-400 font-semibold">Tổng doanh thu</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie Chart */}
        {pieData && (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 p-8 hover:bg-white/20 transition-all duration-300">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                <i className="bi bi-pie-chart mr-2"></i>
                Thống kê hệ thống (GeneX)
              </h3>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
            </div>
            <div className="flex justify-center">
              <div style={{ width: 380, height: 320 }}>
                <Pie 
                  data={pieData} 
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: 'white',
                          font: {
                            size: 14
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-10 right-10 w-20 h-20 border-2 border-cyan-400/30 rounded-full animate-spin" style={{animationDuration: '20s'}}></div>
    </div>
  );
};

export default AdminDashboard;