import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";

const CustomerManage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const fullName = user.fullName || user.username || "Admin";

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

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

  const filteredCustomers = customers.filter((u) =>
    u.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-white">
      {/* Sidebar */}
      <aside className="w-[260px] bg-[#2323a7] flex flex-col min-h-screen">
        <div className="flex items-center justify-center py-8">
          <img src="/src/assets/Admin/logo.png" alt="GeneX" className="w-[180px]" />
        </div>
        <nav className="flex-1">
          <ul className="flex flex-col gap-2 text-white font-semibold text-base px-6">
            <li
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/admin/dashboard")}
            >
              <img src="/src/assets/Admin/home-icon.png" alt="" className="w-5 h-5" />
              TRANG CHỦ
            </li>
            <li>
              <div
className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer"
                onClick={() => navigate("/account-manage")}
              >
                <img
                  src="/src/assets/Admin/setting-thu-muc.png"
                  alt=""
                  className="w-5 h-5"
                />
                QUẢN LÝ TÀI KHOẢN
              </div>
              <ul className="ml-8 mt-1 text-sm font-normal">
                <li
                  className="py-1 text-white cursor-pointer hover:underline"
                  onClick={() => navigate("/account-manage")}
                >
                  Nhân viên
                </li>
                <li
                  className="py-1 text-white cursor-pointer underline"
                  onClick={() => navigate("/customer-manage")}
                >
                  Khách hàng
                </li>
              </ul>
            </li>
            <li
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/service-manage")}
            >
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ DỊCH VỤ
            </li>
            <li
              className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer"
              onClick={() => navigate("/blog-manage")}
            >
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
          <div className="flex-1"></div>
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

        {/* Content */}
        <main className="flex-1 px-10 py-8 bg-white">
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">KHÁCH HÀNG</h2>

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
placeholder="Tìm kiếm..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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
                  <th className="border border-gray-400 px-4 py-2 text-left">TRẠNG THÁI</th>
                  <th className="border border-gray-400 px-4 py-2 text-left">QUẢN LÝ</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.map((u, idx) => (
                  <tr key={u.id || idx} className="border-b border-gray-300">
                    <td className="border border-gray-400 px-4 py-2">{u.fullName}</td>
                    <td className="border border-gray-400 px-4 py-2 font-bold">{u.email}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      <span className="text-white px-3 py-1 rounded-full font-semibold bg-[#009fe3]">
                        {u.role}
                      </span>
                    </td>
                    <td className="border border-gray-400 px-4 py-2 flex gap-2">
                      {/* Nút hiển thị trạng thái hiện tại */}
                      <button
                        disabled
                        className={`px-3 py-1 rounded-full font-semibold cursor-default ${
                          u.accountNonLocked
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {u.accountNonLocked ? "Đang hoạt động" : "Đang bị khóa"}
                      </button>

                      {/* Nút hành động */}
                      <button
                        onClick={() => {
                          const action = u.accountNonLocked ? "khóa" : "mở khóa";
                          const confirmMsg = `Bạn có muốn ${action} người dùng này không?`;
                          if (window.confirm(confirmMsg)) {
                            handleToggleLock(u);
                          }
                        }}
                        className="px-3 py-1 rounded-full font-semibold transition bg-gray-200 text-gray-800 hover:bg-gray-300"
                      >
                        {u.accountNonLocked ? "Khóa" : "Mở khóa"}
                      </button>
                    </td>
<td className="border border-gray-400 px-4 py-2">
                      <button
                        className="bg-[#ff4d4d] text-white px-6 py-1 rounded font-semibold hover:bg-red-600"
                        onClick={() => handleDelete(u.id)}
                      >
                        XÓA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-8 gap-3">
            <button
              disabled={page <= 0}
              onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Trang trước
            </button>
            <span className="text-gray-700 font-medium self-center">
              Trang {page + 1} / {totalPages}
            </span>
            <button
              disabled={page >= totalPages - 1}
              onClick={() => setPage((prev) => prev + 1)}
              className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50"
            >
              Trang sau
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CustomerManage;