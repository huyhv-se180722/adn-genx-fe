import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import "./index.css";

const ServiceManage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "Admin";

  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({ name: "", price: 0, caseType: "ADMINISTRATIVE" });

  const removeDiacritics = (str) =>
    str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axiosClient.get("/api/admin/services");
      const formatted = res.data.map((s) => ({
        id: s.id,
        name: s.name || "Không tên",
        price: s.price || 0,
        caseType: s.caseType || "ADMINISTRATIVE"
      }));
      setServices(formatted);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách dịch vụ:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá dịch vụ này?")) return;
    try {
      await axiosClient.delete(`/api/admin/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error("Lỗi khi xoá dịch vụ:", err);
    }
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow({ ...services[idx] });
  };

  const handleSave = async (idx) => {
    const row = services[idx];
    const dto = {
      name: editRow.name,
      price: Number(editRow.price),
      caseType: editRow.caseType
    };
    try {
      if (row.id) {
        await axiosClient.put(`/api/admin/services/${row.id}`, dto);
      } else {
        const res = await axiosClient.post("/api/admin/services", dto);
        dto.id = res.data.id;
      }
      const updated = [...services];
      updated[idx] = { ...dto, id: row.id || dto.id };
      setServices(updated);
      setEditIdx(null);
      setEditRow({ name: "", price: 0, caseType: "ADMINISTRATIVE" });
    } catch (err) {
      console.error("Lỗi khi lưu dịch vụ:", err);
    }
  };

  const handleAdd = () => {
    setServices([...services, { id: null, name: "", price: 0, caseType: "ADMINISTRATIVE" }]);
    setEditIdx(services.length);
    setEditRow({ name: "", price: 0, caseType: "ADMINISTRATIVE" });
  };

  const filteredServices = services.filter((s) =>
    removeDiacritics(s.name).includes(removeDiacritics(search))
  );

  const canAdd = search.trim() === "";

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
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ TÀI KHOẢN
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/service-manage")}>
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

      <div className="flex-1 flex flex-col">
        <header className="flex items-center bg-[#f3f3f3] px-8 py-4">
          <img src="/src/assets/Admin/avt-customer.png" alt="avatar" className="w-16 h-16 rounded-full border-2 border-[#2323a7]" />
          <div className="ml-4 flex flex-col">
            <span className="bg-[#009fe3] text-white px-4 py-1 rounded-full text-xs font-bold w-fit mb-1">ADMIN</span>
            <span className="font-bold text-lg text-[#2323a7]">{fullName}</span>
          </div>
          <div className="flex-1" />
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

        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">QUẢN LÝ DỊCH VỤ</h2>

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

          <div className="overflow-x-auto">
            <table className="min-w-[700px] w-full border border-gray-400 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-4 py-2 text-left">ID</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">TÊN GÓI DỊCH VỤ</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">GIÁ (VND)</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">PHÂN LOẠI</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((s, idx) => {
                  const isEditing = editIdx === idx;
                  return (
                    <tr key={s.id || idx} className="border-b border-gray-300">
                      <td className="border border-gray-400 px-4 py-2">{s.id || "-"}</td>
                      <td className="border border-gray-400 px-4 py-2">
                        {isEditing ? (
                          <input className="w-full px-2 py-1 border rounded" value={editRow.name} onChange={e => setEditRow({ ...editRow, name: e.target.value })} />
                        ) : (
                          s.name
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {isEditing ? (
                          <input className="w-full px-2 py-1 border rounded" value={editRow.price} onChange={e => setEditRow({ ...editRow, price: e.target.value })} />
                        ) : (
                          s.price.toLocaleString("vi-VN")
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        {isEditing ? (
                          <select className="w-full px-2 py-1 border rounded" value={editRow.caseType} onChange={e => setEditRow({ ...editRow, caseType: e.target.value })}>
                            <option value="ADMINISTRATIVE">Hành chính</option>
                            <option value="CIVIL">Dân sự</option>
                          </select>
                        ) : (
                          s.caseType === "ADMINISTRATIVE" ? "Hành chính" : "Dân sự"
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 flex gap-2">
                        {isEditing ? (
                          <button className="bg-green-500 text-white px-4 py-1 rounded font-semibold" onClick={() => handleSave(idx)}>LƯU</button>
                        ) : (
                          <button className="bg-yellow-400 text-white px-4 py-1 rounded font-semibold" onClick={() => handleEdit(idx)}>SỬA</button>
                        )}
                        <button className="bg-red-500 text-white px-4 py-1 rounded font-semibold" onClick={() => handleDelete(s.id)}>XÓA</button>
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