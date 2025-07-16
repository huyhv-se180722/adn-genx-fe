import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import "./index.css";

const KitManage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "Admin";

  // States
  const [kits, setKits] = useState([]);
  const [search, setSearch] = useState("");
  const [editIdx, setEditIdx] = useState(null);
  const [editRow, setEditRow] = useState({
    totalQuantity: 0,
    remainingQuantity: 0,
    lastUpdated: null,
  });

  const removeDiacritics = (str) =>
    str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase();

  useEffect(() => {
    fetchKits();
  }, []);

  // Kit functions
  const fetchKits = async () => {
    try {
      const res = await axiosClient.get("/api/admin/kit-stock");
      console.log("=== KIT API DEBUG ===");
      console.log("Full response:", res);
      console.log("Response data:", res.data);
      console.log("First item:", res.data[0]);
      console.log("First item keys:", Object.keys(res.data[0] || {}));
      console.log("First item ID field:", res.data[0]?.id);
      console.log("========================");
      
      setKits(res.data || []);
    } catch (err) {
      console.error("Lỗi khi lấy danh sách kit:", err);
    }
  };

  // Sửa handleDelete để sử dụng ID thật từ backend
  const handleDelete = async (kit) => {
    if (!window.confirm("Bạn có chắc chắn muốn xoá kit này?")) return;
    try {
      // Sử dụng ID từ backend, fallback về index nếu không có
      const kitId = kit.id || (kits.indexOf(kit) + 1);
      await axiosClient.delete(`/api/admin/kit-stock/${kitId}`);
      await fetchKits();
    } catch (err) {
      console.error("Lỗi khi xoá kit:", err);
    }
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditRow({
      totalQuantity: kits[idx].totalQuantity,
      remainingQuantity: kits[idx].remainingQuantity,
      lastUpdated: kits[idx].lastUpdated,
    });
  };

  // Sửa handleSave để chỉ tạo mới, không update
  const handleSave = async (idx) => {
    console.log("=== HANDLE SAVE DEBUG ===");
    const isNewItem = idx >= kits.length;
    
    // Validation
    if (!editRow.totalQuantity || !editRow.remainingQuantity) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
    
    if (Number(editRow.remainingQuantity) > Number(editRow.totalQuantity)) {
      alert("Số lượng còn lại không thể lớn hơn tổng kho!");
      return;
    }
    
    const dto = {
      totalQuantity: Number(editRow.totalQuantity),
      remainingQuantity: Number(editRow.remainingQuantity),
    };
    
    try {
      if (isNewItem) {
        // Item mới - chỉ POST
        console.log("Creating new item...");
        const response = await axiosClient.post("/api/admin/kit-stock", dto);
        console.log("Create response:", response);
      } else {
        // Item cũ - tạm thời chỉ POST (vì không có ID)
        console.log("Updating existing item (treated as new for now)...");
        const response = await axiosClient.post("/api/admin/kit-stock", dto);
        console.log("Update response:", response);
      }
      
      await fetchKits();
      setEditIdx(null);
      setEditRow({
        totalQuantity: 0,
        remainingQuantity: 0,
        lastUpdated: null,
      });
      
      console.log("Save completed successfully!");
    } catch (err) {
      console.error("Error in handleSave:", err);
      alert("Lỗi khi lưu: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAdd = () => {
    setEditIdx(kits.length);
    setEditRow({
      totalQuantity: 0,
      remainingQuantity: 0,
      lastUpdated: null,
    });
  };

  const filteredKits = kits.filter((k) => {
    const searchableId = k.id || "";
    return removeDiacritics(searchableId.toString()).includes(removeDiacritics(search));
  });

  const canAdd = search.trim() === "";

  // Get latest update time from database
  const getLatestUpdateTime = () => {
    if (kits.length === 0) return "Chưa có dữ liệu";
    
    // Tìm thời gian cập nhật mới nhất từ database
    const latestUpdate = kits.reduce((latest, kit) => {
      if (!kit.lastUpdated) return latest;
      const kitTime = new Date(kit.lastUpdated);
      return !latest || kitTime > latest ? kitTime : latest;
    }, null);

    if (!latestUpdate) return "Chưa có dữ liệu";
    
    const time = latestUpdate.toLocaleTimeString('vi-VN', { hour12: false });
    const date = latestUpdate.toLocaleDateString('vi-VN');
    return `${time} - ${date}`;
  };

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
              <p className="text-white/70 text-sm">Quản lý KIT hệ thống</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white/80 text-sm">Hoạt động</span>
            </div>
            <button
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              onClick={() => {
                localStorage.clear();
                sessionStorage.clear();
                navigate("/");
                window.location.reload();
              }}
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
          <button
            onClick={() => navigate("/account-manage")}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <i className="bi bi-people"></i>
            Quản lý tài khoản
          </button>
          <div className="relative group">
            <button className="flex items-center gap-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
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
                className="w-full text-left text-cyan-400 py-2 px-3 rounded-lg hover:bg-white/10 transition-colors duration-200 font-medium underline"
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
            ✨ Quản lý KIT ✨
          </h2>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full mx-auto"></div>
        </div>

        {/* Search & Add Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="relative flex-1 max-w-2xl">
            <input
              type="text"
              placeholder="🔍 Tìm kiếm KIT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl outline-none text-white placeholder-white/60 focus:border-cyan-400 focus:bg-white/20 transition-all duration-300"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <i className="bi bi-search text-white/60"></i>
            </div>
          </div>
          
          <button
            onClick={handleAdd}
            disabled={!canAdd}
            className={`ml-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center gap-2 ${!canAdd && "opacity-50 cursor-not-allowed"}`}
          >
            <i className="bi bi-plus-circle text-xl"></i>
            Thêm KIT
          </button>
        </div>

        {/* Update Time */}
        <div className="text-right mb-4">
          <span className="text-white/70 text-sm bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            Lần cập nhật cuối: {getLatestUpdateTime()}
          </span>
        </div>

        {/* Table */}
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-b border-white/10">
                  <th className="px-6 py-4 text-left text-white font-semibold">ID</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Tổng kho</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Đã sử dụng</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Chưa sử dụng</th>
                  <th className="px-6 py-4 text-left text-white font-semibold">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredKits.map((k, idx) => {
                  const isEditing = editIdx === idx;
                  const usedQuantity = (k.totalQuantity || 0) - (k.remainingQuantity || 0);
                  return (
                    <tr key={k.id || idx} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-300">
                      <td className="px-6 py-4 text-white/90">{k.id || (idx + 1)}</td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:border-cyan-400 transition-colors"
                            value={editRow.totalQuantity}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                totalQuantity: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <span className="text-white/90">{(k.totalQuantity || 0).toLocaleString("vi-VN")}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-white/90">{usedQuantity.toLocaleString("vi-VN")}</td>
                      <td className="px-6 py-4">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:border-cyan-400 transition-colors"
                            value={editRow.remainingQuantity}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                remainingQuantity: e.target.value,
                              })
                            }
                          />
                        ) : (
                          <span className="text-white/90">{(k.remainingQuantity || 0).toLocaleString("vi-VN")}</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <button
                              onClick={() => handleSave(idx)}
                              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                              <i className="bi bi-check-lg"></i>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleEdit(idx)}
                              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(k)}
                            className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {/* Row thêm mới */}
                {editIdx === kits.length && (
                  <tr className="border-b border-white/10 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                    <td className="px-6 py-4 text-white/70 italic">Tự động tạo</td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:border-cyan-400 transition-colors"
                        value={editRow.totalQuantity}
                        onChange={(e) =>
                          setEditRow({
                            ...editRow,
                            totalQuantity: e.target.value,
                          })
                        }
                        placeholder="Nhập tổng kho"
                      />
                    </td>
                    <td className="px-6 py-4 text-white/90">
                      {(Number(editRow.totalQuantity) || 0) - (Number(editRow.remainingQuantity) || 0)}
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="number"
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white outline-none focus:border-cyan-400 transition-colors"
                        value={editRow.remainingQuantity}
                        onChange={(e) =>
                          setEditRow({
                            ...editRow,
                            remainingQuantity: e.target.value,
                          })
                        }
                        placeholder="Nhập còn lại"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSave(kits.length)}
                          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button
                          onClick={() => {
                            setEditIdx(null);
                            setEditRow({
                              totalQuantity: 0,
                              remainingQuantity: 0,
                              lastUpdated: null,
                            });
                          }}
                          className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-4 py-2 rounded-lg font-semibold shadow-lg transform hover:scale-105 transition-all duration-300"
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredKits.length === 0 && editIdx !== kits.length && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="bi bi-box text-white/60 text-3xl"></i>
            </div>
            <p className="text-white/70 text-lg">
              {search ? "Không tìm thấy KIT nào" : "Chưa có KIT nào"}
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-400 font-semibold">Tổng KIT</p>
                <p className="text-3xl font-bold text-white">{kits.length}</p>
              </div>
              <div className="w-12 h-12 bg-cyan-500/30 rounded-full flex items-center justify-center">
                <i className="bi bi-box text-cyan-400 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-400 font-semibold">Tổng kho</p>
                <p className="text-3xl font-bold text-white">
                  {kits.reduce((total, kit) => total + (kit.totalQuantity || 0), 0).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center">
                <i className="bi bi-archive text-green-400 text-xl"></i>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 font-semibold">Còn lại</p>
                <p className="text-3xl font-bold text-white">
                  {kits.reduce((total, kit) => total + (kit.remainingQuantity || 0), 0).toLocaleString("vi-VN")}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-500/30 rounded-full flex items-center justify-center">
                <i className="bi bi-boxes text-purple-400 text-xl"></i>
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

export default KitManage;
