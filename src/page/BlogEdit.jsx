import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const BlogEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({ title: "", content: "", date: "", status: "Công khai", link: "" });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    const found = blogs.find((b) => String(b.id) === String(id));
    if (found) {
      setBlog({
        ...found,
        content: found.content || "",
      });
    }
  }, [id]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const blogs = JSON.parse(localStorage.getItem("blogs") || "[]");
    // Xóa bài cũ
    const newBlogs = blogs.filter((b) => String(b.id) !== String(id));
    // Tạo id mới (giống NewBlog)
    const newId = newBlogs.length > 0 ? Math.max(...newBlogs.map(b => +b.id)) + 1 : 1;
    const today = new Date();
    const dateStr = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
    const newBlog = {
      id: newId,
      title: blog.title,
      content: blog.content || "",
      date: dateStr,
      status: "Công khai",
      link: `https://yourdomain.com/blog/${newId}`
    };
    newBlogs.push(newBlog);
    localStorage.setItem("blogs", JSON.stringify(newBlogs));
    setSuccess(true);
    setTimeout(() => {
      // Chuyển về trang quản lý blog sau khi lưu
      navigate("/blog-manage");
    }, 1200);
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
          <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">CHỈNH SỬA BLOG</h2>
          <div className="bg-[#f3f3f3] rounded-lg shadow p-6 max-w-3xl">
            <div className="mb-4">
              <label className="block font-bold mb-2">TIÊU ĐỀ</label>
              <input
                type="text"
                name="title"
                value={blog.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="mb-4">
              <textarea
                name="content"
                value={blog.content}
                onChange={handleChange}
                placeholder="Nội dung..."
                className="w-full h-48 px-3 py-2 border rounded resize-none"
              />
            </div>
            <div className="flex items-center gap-4">
              <button
                className="bg-[#009fe3] text-white px-6 py-2 rounded font-semibold"
                onClick={handleSave}
              >
                LƯU THAY ĐỔI
              </button>
              {success && (
                <span className="text-green-600 font-semibold flex items-center gap-2">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  LƯU BÀI VIẾT THÀNH CÔNG!
                </span>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default BlogEdit;