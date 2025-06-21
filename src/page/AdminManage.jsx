import React from "react";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const stats = [
  {
    label: "Đặt hàng",
    value: 22,
    color: "#5caaff",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M3 3h18v2H3V3zm0 4h18v2H3V7zm0 4h18v2H3v-2zm0 4h18v2H3v-2zm0 4h18v2H3v-2z" />
      </svg>
    ),
  },
  {
    label: "Nhân viên",
    value: 11,
    color: "#aaffc3",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      </svg>
    ),
  },
  {
    label: "Khách hàng",
    value: 22,
    color: "#ffe0b2",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M12 12c2.7 0 8 1.34 8 4v2H4v-2c0-2.66 5.3-4 8-4zm0-2a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
      </svg>
    ),
  },
  {
    label: "Blog",
    value: 1,
    color: "#ffb3b3",
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path d="M4 4h16v16H4V4zm4 4h8v2H8V8zm0 4h8v2H8v-2zm0 4h5v2H8v-2z" />
      </svg>
    ),
  },
];

const AdminManage = () => {
  const navigate = useNavigate();

  const pieData = {
    labels: stats.map((s) => s.label),
    datasets: [
      {
        data: stats.map((s) => s.value),
        backgroundColor: stats.map((s) => s.color),
        borderWidth: 1,
      },
    ],
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
            <li className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/admin-manage")}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0h6" />
              </svg>
              TRANG CHỦ
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
              <img src="/src/assets/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ TÀI KHOẢN
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
    onClick={() => navigate("/")}
  >
            <img src="/src/assets/dang-xuat.png" alt="" className="w-5 h-5" /><span>ĐĂNG XUẤT</span>
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">TRANG CHỦ</h2>
          {/* Stats */}
          <div className="flex gap-6 mb-8">
            {stats.map((s, idx) => (
              <div key={idx} className={`flex-1 rounded-lg`} style={{ background: s.color }}>
                <div className="flex flex-col items-center py-5 shadow-md">
                  <div className="mb-2 text-[#2323a7]">{s.icon}</div>
                  <div className="text-3xl font-bold mb-1">{s.value}</div>
                  <div className="font-semibold">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Chart */}
          <div className="flex justify-center mt-12">
            <div className="bg-[#f8f8f8] rounded-2xl p-6 shadow" style={{ width: 380, height: 320 }}>
              <Pie data={pieData} />
              <div className="text-center mt-2 font-semibold text-[#2323a7]">Thống kê hệ thống (GeneX)</div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminManage;