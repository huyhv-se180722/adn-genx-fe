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
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#2323a7] flex flex-col min-h-screen">
        <div className="flex items-center justify-center py-8">
          <img
            src="/src/assets/Admin/logo.png"
            alt="GeneX"
            className="w-[180px]"
          />
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-white font-semibold text-base px-6">
            <li
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/admin/dashboard")}
            >
              <img
                src="/src/assets/Admin/home-icon.png"
                alt=""
                className="w-5 h-5"
              />
              TRANG CHỦ
            </li>
            <li
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/account-manage")}
            >
              <img
                src="/src/assets/Admin/setting-thu-muc.png"
                alt=""
                className="w-5 h-5"
              />
              QUẢN LÝ TÀI KHOẢN
            </li>


            <li>
            <div
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/service-manage")}
            >
              <img
                src="/src/assets/Admin/setting-thu-muc.png"
                alt=""
                className="w-5 h-5"
              />
              QUẢN LÝ DỊCH VỤ
            </div>

            <ul className="ml-8 mt-1 text-sm font-normal">
                <li
                  className="py-1 text-white cursor-pointer hover:underline"
                  onClick={() => navigate("/service-manage")}
                >
                  Gói dịch vụ
                </li>
                <li
                  className="py-1 text-white cursor-pointer underline"
                  onClick={() => navigate("/kit-manage")}
                >
                  Quản lý KIT
                </li>
              </ul>
            </li>


            <li
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/blog-manage")}
            >
              <img
                src="/src/assets/Admin/setting-thu-muc.png"
                alt=""
                className="w-5 h-5"
              />
              QUẢN LÝ BLOG
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="flex items-center bg-[#f3f3f3] px-8 py-4">
          <img
            src="/src/assets/Admin/avt-customer.png"
            alt="avatar"
            className="w-16 h-16 rounded-full border-2 border-[#2323a7]"
          />
          <div className="ml-4 flex flex-col">
            <span className="bg-[#009fe3] text-white px-4 py-1 rounded-full text-xs font-bold w-fit mb-1">
              ADMIN
            </span>
            <span className="font-bold text-lg text-[#2323a7]">{fullName}</span>
          </div>
          <div className="flex-1" />
          <button
            className="bg-[#009fe3] text-white flex items-center gap-2 px-6 py-2 rounded-full font-semibold shadow hover:bg-[#007bbd] transition"
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              navigate("/");
              window.location.reload();
            }}
          >
            <img
              src="/src/assets/Admin/dang-xuat.png"
              alt=""
              className="w-5 h-5"
            />
            <span>ĐĂNG XUẤT</span>
          </button>
        </header>

        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">
            QUẢN LÝ KIT
          </h2>

          <div className="flex items-center mb-6 gap-4">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[400px] px-5 py-3 rounded-xl shadow text-black outline-none border border-gray-200"
            />
            <button
              className={`ml-2 rounded-full bg-[#009fe3] hover:bg-[#007bbd] text-white w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition ${
                !canAdd && "opacity-50 pointer-events-none"
              }`}
              onClick={handleAdd}
              disabled={!canAdd}
              title="Thêm kit"
            >
              +
            </button>
          </div>

          <div className="text-right mb-4">
            <span className="text-sm text-gray-600">
              Lần cập nhật cuối cùng: {getLatestUpdateTime()}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[800px] w-full border border-gray-400 bg-white">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-4 py-2 text-center">
                    ID
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-center">
                    Tổng kho
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-center">
                    Đã sử dụng
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-center">
                    Chưa sử dụng
                  </th>
                  <th className="border border-gray-400 px-4 py-2 text-center">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredKits.map((k, idx) => {
                  const isEditing = editIdx === idx;
                  const usedQuantity = (k.totalQuantity || 0) - (k.remainingQuantity || 0); // Tính toán
                  return (
                    <tr key={k.id || idx} className="border-b border-gray-300">
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        {/* ID luôn readonly, không cho edit */}
                        {k.id || (idx + 1)}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded text-center"
                            value={editRow.totalQuantity}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                totalQuantity: e.target.value,
                              })
                            }
                          />
                        ) : (
                          (k.totalQuantity || 0).toLocaleString("vi-VN")
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        {usedQuantity.toLocaleString("vi-VN")} {/* Chỉ hiển thị, không edit */}
                      </td>
                      <td className="border border-gray-400 px-4 py-2 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            className="w-full px-2 py-1 border rounded text-center"
                            value={editRow.remainingQuantity}
                            onChange={(e) =>
                              setEditRow({
                                ...editRow,
                                remainingQuantity: e.target.value,
                              })
                            }
                          />
                        ) : (
                          (k.remainingQuantity || 0).toLocaleString("vi-VN")
                        )}
                      </td>
                      <td className="border border-gray-400 px-4 py-2">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {isEditing ? (
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded font-semibold text-sm hover:bg-green-600 transition"
                              onClick={() => handleSave(idx)}
                            >
                              LƯU
                            </button>
                          ) : (
                            <button
                              className="bg-yellow-400 text-white px-3 py-1 rounded font-semibold text-sm hover:bg-yellow-500 transition"
                              onClick={() => handleEdit(idx)}
                            >
                              SỬA
                            </button>
                          )}
                          <button
                            className="bg-red-500 text-white px-3 py-1 rounded font-semibold text-sm hover:bg-red-600 transition"
                            onClick={() => handleDelete(k)}
                          >
                            XÓA
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                
                {/* Row thêm mới - CHUYỂN VÀO TRONG TBODY */}
                {editIdx === kits.length && (
                  <tr className="border-b border-gray-300 bg-yellow-50">
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      <span className="text-gray-500 italic">Tự động tạo</span>
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border rounded text-center"
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
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      {(Number(editRow.totalQuantity) || 0) - (Number(editRow.remainingQuantity) || 0)}
                    </td>
                    <td className="border border-gray-400 px-4 py-2 text-center">
                      <input
                        type="number"
                        className="w-full px-2 py-1 border rounded text-center"
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
                    <td className="border border-gray-400 px-4 py-2">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          className="bg-green-500 text-white px-3 py-1 rounded font-semibold text-sm hover:bg-green-600 transition"
                          onClick={() => handleSave(kits.length)}
                        >
                          LƯU
                        </button>
                        <button
                          className="bg-gray-500 text-white px-3 py-1 rounded font-semibold text-sm hover:bg-gray-600 transition"
                          onClick={() => {
                            setEditIdx(null);
                            setEditRow({
                              totalQuantity: 0,
                              remainingQuantity: 0,
                              lastUpdated: null,
                            });
                          }}
                        >
                          HỦY
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filteredKits.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {search ? "Không tìm thấy kit nào" : "Chưa có kit nào"}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default KitManage;
