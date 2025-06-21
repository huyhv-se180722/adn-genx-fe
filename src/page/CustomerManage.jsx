import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialCustomers = [
  { name: "NGUYỄN VĂN A", email: "XXX@gmail.com.vn", role: "CUSTOMER" },
  { name: "NGUYỄN VĂN B", email: "XXX@gmail.com.vn", role: "CUSTOMER" },
  { name: "NGUYỄN VĂN C", email: "XXX@gmail.com.vn", role: "CUSTOMER" },
  { name: "NGUYỄN VĂN D", email: "XXX@gmail.com.vn", role: "CUSTOMER" },
];

const CustomerManage = () => {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Nếu muốn lưu vào localStorage thì lấy từ localStorage, còn không thì dùng dữ liệu mẫu
    const data = JSON.parse(localStorage.getItem("customers") || "null");
    if (data && Array.isArray(data)) setCustomers(data);
    else setCustomers(initialCustomers);
  }, []);

  // Xóa khách hàng theo index
  const handleDelete = (idx) => {
    const newCustomers = customers.filter((_, i) => i !== idx);
    setCustomers(newCustomers);
    localStorage.setItem("customers", JSON.stringify(newCustomers));
  };

  // Lọc khách hàng theo họ và tên
  const filteredCustomers = customers.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

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
                <li className="py-1 text-white cursor-pointer hover:underline" onClick={() => navigate("/account-manage")}>Nhân viên</li>
                <li className="py-1 text-white cursor-pointer underline" onClick={() => navigate("/customer-manage")}>Khách hàng</li>
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
        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">KHÁCH HÀNG</h2>
          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-[400px] px-5 py-3 rounded-xl shadow text-black outline-none border border-gray-200"
            />
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border border-gray-400 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-4 py-2 text-left">HỌ VÀ TÊN</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">EMAIL</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">VAI TRÒ</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">QUẢN LÝ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((u, idx) => (
                  <tr key={idx} className="border-b border-gray-300">
                    <td className="border border-gray-400 px-4 py-2">{u.name}</td>
                    <td className="border border-gray-400 px-4 py-2 font-bold">{u.email}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      <span className="text-white px-3 py-1 rounded-full font-semibold bg-[#009fe3]">{u.role}</span>
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      <button
                        className="bg-[#009fe3] text-white px-6 py-1 rounded font-semibold"
                        onClick={() => {
                          const realIdx = customers.findIndex(
                            (a) => a.name === u.name && a.email === u.email && a.role === u.role
                          );
                          if (realIdx !== -1) handleDelete(realIdx);
                        }}
                      >
                        XÓA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerManage;