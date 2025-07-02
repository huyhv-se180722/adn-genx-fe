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

  // Load dashboard ban đầu

const fetchStats = async () => {
  try {
    const token = localStorage.getItem("authToken"); // Retrieve token from localStorage
    const res = await axiosClient.get("/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in the Authorization header
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
  fetchStats(); // Gọi API lấy dữ liệu ban đầu
}, []);
  // Gọi API khi đổi tháng/năm
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

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#2323a7] flex flex-col min-h-screen">
        <div className="flex items-center justify-center py-8">
          <img src="/src/assets/Admin/logo.png" alt="GeneX" className="w-[180px]" />
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-white font-semibold text-base px-6">
            <li className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
              <img src="/src/assets/Admin/home-icon.png" alt="" className="w-5 h-5" />
              TRANG CHỦ
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ TÀI KHOẢN
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
              localStorage.removeItem("accessToken"); // Key quan trọng cho AuthContext
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
              window.location.reload(); // Force reload để AuthContext cập nhật
            }}
          >
            <img src="/src/assets/Admin/dang-xuat.png" alt="" className="w-5 h-5" /><span>ĐĂNG XUẤT</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">TRANG CHỦ</h2>

          {/* Stats */}
          {dashboard && (
            <div className="grid grid-cols-3 gap-6 mb-10">
              <StatCard label="Tổng người dùng" value={dashboard.totalUsers} color="#cdeffd" />
              <StatCard label="Nhân viên" value={dashboard.totalStaff} color="#d1ffd6" />
              <StatCard label="Khách hàng" value={dashboard.totalCustomers} color="#fff0d0" />
              <StatCard label="Tổng dịch vụ" value={dashboard.totalServices} color="#e2dcff" />
              <StatCard label="Tổng blog" value={dashboard.totalBlogs} color="#ffd6d6" />
              <StatCard label="Đơn đã thanh toán" value={dashboard.totalPayments} color="#f3ffe2" />
              <StatCard label="Doanh thu hôm nay" value={formatCurrency(dashboard.todayRevenue)} color="#ccf2ff" />
              <StatCard
                label={
                  <div className="flex flex-col items-center">
                    <span>Doanh thu tháng</span>
                    <div className="flex gap-1 mt-1">
                      <select value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))} className="text-sm rounded px-1">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                          <option key={m} value={m}>{`Tháng ${m}`}</option>
                        ))}
                      </select>
                      <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="text-sm rounded px-1">
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                }
                value={formatCurrency(monthlyRevenue ?? 0)}
                color="#caffc7"
              />
              <StatCard label="Tổng doanh thu" value={formatCurrency(dashboard.totalRevenue)} color="#ffd8a9" />
            </div>
          )}

          {/* Pie Chart */}
          {pieData && (
            <div className="flex justify-center mt-12">
              <div className="bg-[#f8f8f8] rounded-2xl p-6 shadow" style={{ width: 380, height: 320 }}>
                <Pie data={pieData} />
                <div className="text-center mt-2 font-semibold text-[#2323a7]">Thống kê hệ thống (GeneX)</div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

// Component thống kê
const StatCard = ({ label, value, color }) => (
  <div className="rounded-lg shadow p-4 flex flex-col items-center" style={{ backgroundColor: color }}>
    <div className="text-3xl font-bold text-[#2323a7]">{value}</div>
    <div className="font-semibold text-[#2323a7] mt-1 text-center">{label}</div>
  </div>
);

// Format tiền VNĐ
const formatCurrency = (value) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
};

export default AdminDashboard;