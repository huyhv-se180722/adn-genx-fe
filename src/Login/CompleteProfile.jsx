import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios"; thay dong nay import axiosClient from "../config/AxiosClient";
import axiosClient from "../config/AxiosClient";
import { AuthContext } from "../Context/AuthContext"; // them dong nay no do thieu

export default function CompleteProfile() {
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        phoneNumber: ""
    });

    useEffect(() => {
        const googleUser = JSON.parse(localStorage.getItem("googleUser"));
        if (googleUser) {
            setFormData(prev => ({
                ...prev,
                email: googleUser.email || "",
                fullName: googleUser.fullName || ""
            }));
        } else {
            navigate("/login"); // nếu chưa login Google → quay lại login
        }
    }, [navigate]);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.username || !formData.phoneNumber) {
            alert("❌ Vui lòng điền đầy đủ thông tin!");
            return;
        }
        try {
            const res = await axiosClient.post("/api/v1/auth/google-register", formData);

            // Nếu backend trả user mới → đăng nhập lại
            if (res.data?.result) {
                // Optional: call login API lại nếu muốn auto đăng nhập
                alert("✅ Hoàn tất đăng ký. Vui lòng đăng nhập lại!");
                localStorage.removeItem("googleUser");
                navigate("/login");
            }
        } catch (err) {
            alert("❌Lỗi gửi thông tin: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="auth-root">
            <h2>Hoàn tất hồ sơ</h2>
            <form className="auth-box" onSubmit={handleSubmit}>
                <label>Tên người dùng</label>
                <input name="username" required value={formData.username} onChange={handleChange} className="auth-input" />

                <label>Họ và tên</label>
                <input name="fullName" required value={formData.fullName} onChange={handleChange} className="auth-input" />

                <label>Email</label>
                <input name="email" required value={formData.email} disabled className="auth-input" />

                <label>Số điện thoại</label>
                <input name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} className="auth-input" />

                <button type="submit" className="auth-btn main">HOÀN TẤT</button>
            </form>
        </div>
    );
}
