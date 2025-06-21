import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialServices = [
  { name: "ADN DÂN SỰ", price: "1.999.000", promo: "1.500.000" },
  { name: "ADN HÀNH CHÍNH", price: "2.499.000", promo: "2.000.000" },
];

const ServiceManage = () => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({ name: "", price: "", promo: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("services") || "null");
    if (data && Array.isArray(data)) setServices(data);
    else setServices(initialServices);
  }, []);

  // Xóa dịch vụ
  const handleDelete = (idx) => {
    const newServices = services.filter((_, i) => i !== idx);
    setServices(newServices);
    localStorage.setItem("services", JSON.stringify(newServices));
  };

  // Bắt đầu sửa
  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow({ ...services[idx] });
  };

  // Lưu chỉnh sửa
  const handleSave = (idx) => {
    const newServices = services.map((s, i) => (i === idx ? editRow : s));
    setServices(newServices);
    setEditIdx(null);
    setEditRow({ name: "", price: "", promo: "" });
    localStorage.setItem("services", JSON.stringify(newServices));
  };

  // Thêm dịch vụ mới
  const handleAdd = () => {
    setServices([
      ...services,
      { name: "", price: "", promo: "" }
    ]);
    setEditIdx(services.length);
    setEditRow({ name: "", price: "", promo: "" });
  };

  // Lọc dịch vụ theo tên
  const filteredServices = services.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  // Nếu đang search thì không cho thêm mới (để tránh nhầm lẫn)
  const canAdd = search.trim() === "";

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
              <div className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
                <img src="/src/assets/setting-thu-muc.png" alt="" className="w-5 h-5" />
                QUẢN LÝ TÀI KHOẢN
              </div>
              <ul className="ml-8 mt-1 text-sm font-normal">
                <li className="py-1 text-white cursor-pointer hover:underline" onClick={() => navigate("/account-manage")}>Nhân viên</li>
                <li className="py-1 text-white cursor-pointer hover:underline" onClick={() => navigate("/customer-manage")}>Khách hàng</li>
              </ul>
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/service-manage")}>
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
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">QUẢN LÝ DỊCH VỤ</h2>
          {/* Search + Add */}
          <div className="flex items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-[400px] px-5 py-3 rounded-xl shadow text-black outline-none border border-gray-200"
            />
            <button
              className={`ml-2 rounded-full bg-[#009fe3] hover:bg-[#007bbd] text-white w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition ${!canAdd && "opacity-50 pointer-events-none"}`}
              onClick={handleAdd}
              disabled={!canAdd}
              title="Thêm dịch vụ"
            >
              +
            </button>
          </div>
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border border-gray-400 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-4 py-2 text-left">TÊN GÓI DỊCH VỤ</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">GIÁ GỐC (VND)</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">GIÁ KHUYẾN MÃI (VND)</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((s, idx) => {
                  // Tìm index thực trong mảng services
                  const realIdx = services.findIndex(
                    (item) => item === s
                  );
                  const isEditing = editIdx === realIdx;
                  return (
                    <tr key={realIdx} className="border-b border-gray-300">
                      <td className="border border-gray-400 px-4 py-2">
                        {isEditing ? (
                          <input
                            className="w-full px-2 py-1 border rounded"
                            value={editRow.name}
                            onChange={e => setEditRow({ ...editRow, name: e.target.value })}
                          />
                        ) : (
                          s.name
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {isEditing ? (
                          <input
                            className="w-full px-2 py-1 border rounded"
                            value={editRow.price}
                            onChange={e => setEditRow({ ...editRow, price: e.target.value })}
                          />
                        ) : (
                          s.price
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {isEditing ? (
                          <input
                            className="w-full px-2 py-1 border rounded"
                            value={editRow.promo}
                            onChange={e => setEditRow({ ...editRow, promo: e.target.value })}
                          />
                        ) : (
                          s.promo
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 flex gap-2">
                        {isEditing ? (
                          <button
                            className="bg-green-500 text-white px-4 py-1 rounded font-semibold"
                            onClick={() => handleSave(realIdx)}
                          >
                            LƯU
                          </button>
                        ) : (
                          <button
                            className="bg-yellow-400 text-white px-4 py-1 rounded font-semibold"
                            onClick={() => handleEdit(realIdx)}
                          >
                            SỬA
                          </button>
                        )}
                        <button
                          className="bg-red-500 text-white px-4 py-1 rounded font-semibold"
                          onClick={() => handleDelete(realIdx)}
                        >
                          XÓA
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ServiceManage;