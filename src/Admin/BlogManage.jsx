import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";


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

  const filteredBlogs = blogs.filter((b) =>
  removeVietnameseTones(b.title || "").includes(removeVietnameseTones(search))
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
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/admin/dashboard")}>
              <img src="/src/assets/Admin/home-icon.png" alt="" className="w-5 h-5" />
              TRANG CHỦ
            </li>
            <li>
              <div className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/account-manage")}>
                <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
                QUẢN LÝ TÀI KHOẢN
              </div>
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/service-manage")}>
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ DỊCH VỤ
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/blog-manage")}>
              <img src="/src/assets/Admin/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ BLOG
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main */}
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
          <div className="flex items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-[#2323a7] flex-1">QUẢN LÝ BLOG</h2>
            <button
              className="rounded-full bg-[#009fe3] hover:bg-[#007bbd] text-white w-10 h-10 flex items-center justify-center text-2xl font-bold shadow transition"
              onClick={() => navigate("/new-blog")}
              title="Thêm blog mới"
            >
              +
            </button>
          </div>

          <div className="mb-6">
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-[400px] px-5 py-3 rounded-xl shadow text-black outline-none border border-gray-200"
            />
          </div>

          <div className="flex flex-col gap-4">
            {[...filteredBlogs]
              .filter(b => b.blogId)
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((b) => (
                <div key={b.blogId} className="bg-[#f3f3f3] rounded-lg shadow flex flex-col p-4 relative">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">{b.title}</span>
                    <div className="flex items-center gap-2">
                      <button
                        className="text-[#2323a7] hover:text-blue-700"
                        title="Sửa"
                        onClick={() => navigate(`/blog-edit/${b.blogId}`)}
                      >
                        ✎
                      </button>
                      <button
                        className="text-red-500 hover:text-red-700"
                        title="Xoá"
                        onClick={() => handleDelete(b.blogId)}
                      >
                        🗑
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 text-base font-semibold">
                    {b.content ? (b.content.length > 60 ? b.content.slice(0, 60) + "..." : b.content) : ""}
                  </div>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                    <span>{b.authorName}</span>
                    <span>•</span>
                    <span>{b.createdAt?.slice(0, 10)}</span>
                  </div>
                </div>
              ))}
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

export default BlogManage;