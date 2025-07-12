import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";

// Upload ảnh lên Cloudinary
const uploadToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "blog_unsigned");
  formData.append("folder", "blog-thumbnails");

  try {
    const res = await fetch("https://api.cloudinary.com/v1_1/dbihuiif1/image/upload", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error(`Upload thất bại với status ${res.status}`);
    const data = await res.json();
    return data.secure_url;
  } catch (err) {
    console.error("Upload ảnh thất bại:", err);
    return null;
  }
};

const CreateAccount = () => {
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    password: "",
    confirm: "",
    email: "",
    phoneNumber: "",
    gender: "Nam",
    role: "Nhân viên xét nghiệm",
  });

  const [fingerprintFile, setFingerprintFile] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (form.password !== form.confirm) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    const mappedRole = form.role === "Nhân viên ghi nhận" ? "RECORDER_STAFF" : "LAB_STAFF";

    // Upload fingerprint if exists
    let fingerprintUrl = null;
    if (fingerprintFile) {
      fingerprintUrl = await uploadToCloudinary(fingerprintFile);
      if (!fingerprintUrl) {
        alert("Tải ảnh vân tay thất bại. Vui lòng thử lại.");
        return;
      }
    }

    try {
      const response = await axiosClient.post("/api/admin/staff", {
        username: form.username,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: mappedRole,
        phoneNumber: form.phoneNumber,
        gender: form.gender,
        authProvider: "SYSTEM",
        fingerprintImageUrl: fingerprintUrl,
      });
      
      alert("Tạo tài khoản thành công!");
      navigate("/account-manage");
      
    } catch (error) {
      console.error("Error creating account:", error);
      
      // Handle different error cases
      if (error.response?.status === 409) {
        alert("Tên đăng nhập hoặc email đã tồn tại!");
      } else if (error.response?.status === 403) {
        alert("Bạn không có quyền thực hiện hành động này!");
      } else if (error.response?.status === 400) {
        alert("Dữ liệu không hợp lệ!");
      } else {
        alert("Tạo tài khoản thất bại. Vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 flex items-center justify-center bg-white">
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-[48px] shadow-2xl px-16 py-10 w-[600px] max-w-full"
            style={{ boxShadow: "10px 10px 40px 0 #bbb" }}
          >
            <h2 className="text-3xl font-extrabold text-center mb-8">TẠO TÀI KHOẢN</h2>

            {/* Họ và tên */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                Họ và tên <span className="text-red-500">(*)</span>
</label>
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
            </div>

            {/* Username + Role */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="font-semibold block mb-2">
                  Tên người dùng <span className="text-red-500">(*)</span>
                </label>
                <input
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                  required
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold block mb-2">Vai trò:</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                >
                  <option>Nhân viên xét nghiệm</option>
                  <option>Nhân viên ghi nhận</option>
                </select>
              </div>
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                Mật khẩu <span className="text-red-500">(*)</span>
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                Xác nhận mật khẩu <span className="text-red-500">(*)</span>
              </label>
              <input
                type="password"
                name="confirm"
                value={form.confirm}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="font-semibold block mb-2">
                Email <span className="text-red-500">(*)</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                required
              />
</div>

            {/* Phone + Gender */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="font-semibold block mb-2">Số điện thoại</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                />
              </div>
              <div className="flex-1">
                <label className="font-semibold block mb-2">Giới tính</label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
                >
                  <option>Nam</option>
                  <option>Nữ</option>
                  <option>Khác</option>
                </select>
              </div>
            </div>

            {/* Ảnh vân tay */}
            <div className="mb-8">
              <label className="font-semibold block mb-2">Ảnh vân tay</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFingerprintFile(e.target.files[0])}
                className="w-full px-4 py-2 rounded bg-gray-100 border border-gray-300"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-center gap-4">
              <button
                type="submit"
                className="bg-[#009fe3] text-white px-8 py-2 rounded-full font-semibold shadow hover:bg-[#007bbd] transition"
              >
                TẠO TÀI KHOẢN
              </button>
              <button
                type="button"
                className="bg-gray-300 text-[#2323a7] px-8 py-2 rounded-full font-semibold shadow hover:bg-gray-400 transition"
                onClick={() => navigate("/account-manage")}
              >
                HỦY BỎ
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

export default CreateAccount;