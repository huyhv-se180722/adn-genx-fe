import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const initialBlogs = [
  {
    id: 1,
    title: "TIÊU ĐỀ",
    date: "19/6/2025",
    status: "Công khai",
    link: "https://yourdomain.com/blog/1"
  },
  {
    id: 2,
    title: "TIÊU ĐỀ",
    date: "20/6/2025",
    status: "Công khai",
    link: "https://yourdomain.com/blog/2"
  }
];

const BlogManage = () => {
  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [showLink, setShowLink] = useState({ open: false, link: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("blogs") || "null");
    if (data && Array.isArray(data)) setBlogs(data);
    else setBlogs(initialBlogs);
  }, []);

  // Xóa blog
  const handleDelete = (id) => {
    const newBlogs = blogs.filter((b) => b.id !== id);
    setBlogs(newBlogs);
    localStorage.setItem("blogs", JSON.stringify(newBlogs));
  };

  // Lọc blog theo tiêu đề
  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  // Copy link
  const handleCopy = (link) => {
    navigator.clipboard.writeText(link);
    setShowLink({ open: false, link: "" });
    alert("Đã sao chép link!");
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
            <li className="flex items-center gap-2 py-3 px-3 rounded hover:bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/service-manage")}>
              <img src="/src/assets/setting-thu-muc.png" alt="" className="w-5 h-5" />
              QUẢN LÝ DỊCH VỤ
            </li>
            <li className="flex items-center gap-2 py-3 px-3 rounded bg-[#1a1a7a] cursor-pointer" onClick={() => navigate("/blog-manage")}>
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
          {/* Blog List */}
          <div className="flex flex-col gap-4">
            {[...filteredBlogs].reverse().map((b) => (
              <div key={b.id} className="bg-[#f3f3f3] rounded-lg shadow flex flex-col p-4 relative">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-lg">{b.title}</span>
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button
                      className="text-[#2323a7] hover:text-blue-700"
                      title="Sửa"
                      onClick={() => navigate(`/blog-edit/${b.id}`)}
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M16.732 3.732a2.5 2.5 0 013.536 3.536l-12 12a2 2 0 01-.878.513l-4 1a1 1 0 01-1.213-1.213l1-4a2 2 0 01.513-.878l12-12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    {/* Delete */}
                    <button
                      className="text-red-500 hover:text-red-700"
                      title="Xóa"
                      onClick={() => handleDelete(b.id)}
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M8 7V5a2 2 0 012-2h2a2 2 0 012 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    {/* Share */}
                    <button
                      className="text-[#009fe3] hover:text-blue-700"
                      title="Chia sẻ"
                      onClick={() => setShowLink({ open: true, link: b.link })}
                    >
                      <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M15 8a5 5 0 00-9.584 1.667M15 8h6m0 0v6M9 16a5 5 0 009.584-1.667M9 16H3m0 0V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
                <div className="mt-2 text-base font-semibold">
                  {b.content
                    ? b.content.length > 60
                      ? b.content.slice(0, 60) + "..."
                      : b.content
                    : ""}
                </div>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-700">
                  <span>{b.status}</span>
                  <span>•</span>
                  <span>{b.date}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Share Link Modal */}
          {showLink.open && (
            <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg p-6 shadow-lg flex flex-col items-center gap-4">
                <div className="font-semibold">Link bài viết:</div>
                <input
                  className="w-[300px] px-3 py-2 border rounded"
                  value={showLink.link}
                  readOnly
                />
                <div className="flex gap-2">
                  <button
                    className="bg-[#009fe3] text-white px-4 py-1 rounded font-semibold"
                    onClick={() => handleCopy(showLink.link)}
                  >
                    Sao chép
                  </button>
                  <button
                    className="bg-gray-300 text-[#2323a7] px-4 py-1 rounded font-semibold"
                    onClick={() => setShowLink({ open: false, link: "" })}
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BlogManage;