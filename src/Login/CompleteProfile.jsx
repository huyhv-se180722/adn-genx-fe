import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CompleteProfile() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        fullName: "",
        phone: ""
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

        try {
            await axios.post("https://2642-2405-4802-8033-c420-6d55-f41-2cf0-d4b0.ngrok-free.app/api/v1/auth/google-register", formData);
            alert("Hoàn tất đăng ký. Chuyển về trang chủ...");
            localStorage.removeItem("googleUser");
            navigate("/");
        } catch (err) {
            alert("Lỗi gửi thông tin: " + (err.response?.data?.message || err.message));
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
                <input name="phone" required value={formData.phone} onChange={handleChange} className="auth-input" />

                <button type="submit" className="auth-btn main">HOÀN TẤT</button>
            </form>
        </div>
    );
}
