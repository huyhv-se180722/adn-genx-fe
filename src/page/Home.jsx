import React from "react";
import { useNavigate } from "react-router-dom";

const services = [
  { img: "/src/assets/tu-van.jpg", label: "Tư vấn" },
  { img: "/src/assets/thu-mau.png", label: "Thu mẫu" },
  { img: "/src/assets/phan-tich.png", label: "Phân tích" },
  { img: "/src/assets/tra-ket-qua.jpg", label: "Trả kết quả" },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#2b2e4a] flex flex-col">
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 py-3 bg-[#fff]">
        {/* Search */}
        <div className="flex items-center w-[300px]">
          <input
            type="text"
            placeholder="Tìm kiếm"
            className="w-full px-3 py-2 rounded-l border border-gray-300 outline-none"
          />
          <button className="bg-[#4b3fa7] px-3 py-2 rounded-r">
            <svg width="20" height="20" fill="#fff" viewBox="0 0 20 20">
              <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l4.39 4.39-1.41 1.41-4.39-4.39zM8 14a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"/>
            </svg>
          </button>
        </div>
        {/* Logo */}
        <div>
          <span className="text-[48px] font-bold text-[#4b3fa7]">Gene<span className="text-[#ff6f3c]">X</span></span>
        </div>
        {/* Contact & Auth */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-3 text-sm">
            <img src="/src/assets/email-lien-he.png" alt="email" className="w-5 h-5" />
            <span className="text-[#ff6f3c] font-bold">genex@gmail.com</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <img src="/src/assets/phone.png" alt="phone" className="w-5 h-5" />
            <span className="text-[#4b3fa7] font-bold">+98 0123456789</span>
          </div>
          <div className="flex gap-2 mt-2">
            <button
              className="bg-[#fff] border border-[#4b3fa7] text-[#4b3fa7] px-4 py-1 rounded-full font-semibold hover:bg-[#4b3fa7] hover:text-white transition"
              onClick={() => navigate("/login")}
            >
              Đăng nhập
            </button>
            <button
              className="bg-[#fff] border border-[#ff6f3c] text-[#ff6f3c] px-4 py-1 rounded-full font-semibold hover:bg-[#ff6f3c] hover:text-white transition"
              onClick={() => navigate("/register")}
            >
              Đăng ký
            </button>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav className="flex items-center bg-[#23235b] py-2 px-0 border-b border-[#4b3fa7]">
        <ul className="flex-1 flex justify-center gap-8 text-base font-bold text-white">
          <li className="hover:text-[#ffb3b3] cursor-pointer">TRANG CHỦ</li>
          <li className="hover:text-[#ffb3b3] cursor-pointer">DỊCH VỤ</li>
          <li className="hover:text-[#ffb3b3] cursor-pointer">BẢNG GIÁ</li>
          <li className="hover:text-[#ffb3b3] cursor-pointer">HƯỚNG DẪN</li>
          <li className="hover:text-[#ffb3b3] cursor-pointer">KIẾN THỨC Y KHOA</li>
          <li className="hover:text-[#ffb3b3] cursor-pointer">TRA CỨU KẾT QUẢ</li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#2b2e4a]">
        <div className="flex flex-1">
          {/* Left content */}
          <div className="flex-1 flex flex-col justify-center items-center pt-10">
            <div className="max-w-xl text-center">
              <h2 className="text-[#fff] font-bold text-base mb-1">Xét Nghiệm ADN</h2>
              <h3 className="text-[#fff] font-bold text-base mb-2">Xác định quan hệ huyết thống</h3>
              <p className="text-[#fff] text-sm font-normal">
                Cho các mối quan hệ cha (mẹ) – con, ông (bà) – cháu, anh (chị) – em, họ hàng
                với mục đích giải tỏa nghi ngờ mối quan hệ cá nhân, bổ sung thủ tục hành chính
                pháp lý khi đăng ký giấy khai sinh, di chúc, nhận con, trước tòa, tranh chấp tại tòa
                hay nộp cho lãnh sự các nước để làm visa, hộ chiếu,...
              </p>
            </div>
          </div>
          {/* Right image */}
          <div className="flex-1 flex items-center justify-center">
            <img
              src="/src/assets/body-1.png"
              alt="Lab"
              className="w-[420px] max-w-full object-contain"
            />
          </div>
        </div>
        {/* Service Icons */}
        <div className="w-full flex justify-center gap-24 py-10 bg-[#23235b] border-t border-[#4b3fa7]">
          {services.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="bg-[#4b3fa7] rounded-full p-5 mb-2 shadow-lg">
                <img src={item.img} alt={item.label} className="w-16 h-16 object-contain" />
              </div>
              <span className="text-white font-semibold text-base mt-1">{item.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;