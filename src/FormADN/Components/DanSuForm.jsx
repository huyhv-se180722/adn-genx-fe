import { useEffect, useState } from "react";
// import axios from "axios"; thay dong nay banng import axiosClient from "../../config/AxiosClient";
import axiosClient from "../../config/AxiosClient";
import { useAuth } from "../../Context/AuthContext";

export default function DanSuForm() {
  const today = new Date().toISOString().split("T")[0];
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    address: "",
    email: "",
    numberOfParticipants: 1,
    collectionMethod: "",
    appointmentDate: "",
    participants: [{ fullName: "", gender: "", yearOfBirth: "", relationship: "" }],
  });

  // Lấy accessToken từ AuthContext hoặc localStorage
  const { user } = useAuth();
  const token = user?.accessToken || localStorage.getItem("token");

  useEffect(() => {
    const num = parseInt(formData.numberOfParticipants);
    const updated = Array.from({ length: num }, (_, i) =>
      formData.participants[i] || {
        fullName: "",
        gender: "",
        yearOfBirth: "",
        relationship: "",
      }
    );
    setFormData((prev) => ({ ...prev, participants: updated }));
    // eslint-disable-next-line
  }, [formData.numberOfParticipants]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...formData.participants];
    updated[index][field] = value;
    setFormData((prev) => ({ ...prev, participants: updated }));
    setFieldErrors((prev) => ({
      ...prev,
      [`participant_${index}_${field}`]: undefined,
    }));
  };

  const validate = () => {
    let errors = {};
    if (!formData.fullName) errors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phoneNumber) errors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!formData.address) errors.address = "Vui lòng nhập địa chỉ";
    if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!formData.collectionMethod) errors.collectionMethod = "Vui lòng chọn hình thức lấy mẫu";
    if (
      formData.collectionMethod === "HOSPITAL" &&
      (!formData.appointmentDate || new Date(formData.appointmentDate) <= new Date(today))
    ) {
      errors.appointmentDate = "Ngày hẹn phải sau hôm nay";
    }
    formData.participants.forEach((p, i) => {
      if (!p.fullName) errors[`participant_${i}_fullName`] = "Nhập tên";
      if (!p.gender) errors[`participant_${i}_gender`] = "Chọn giới tính";
      if (!p.yearOfBirth) errors[`participant_${i}_yearOfBirth`] = "Nhập năm sinh";
      if (!p.relationship) errors[`participant_${i}_relationship`] = "Nhập quan hệ";
    });
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!validate()) {
      setMessage("Vui lòng kiểm tra lại thông tin!");
      return;
    }

    try {
      setLoading(true);
      const data = {
        fullName: formData.fullName,
        phoneNumber: formData.phoneNumber,
        address: formData.address,
        email: formData.email,
        collectionMethod: formData.collectionMethod,
        numberOfParticipants: parseInt(formData.numberOfParticipants),
        serviceId: 1,
        participants: formData.participants.map(p => ({
          fullName: p.fullName,
          gender: p.gender,
          yearOfBirth: Number(p.yearOfBirth),
          relationship: p.relationship
        }))
      };
      if (formData.collectionMethod === "HOSPITAL") {
        data.appointmentDate = formData.appointmentDate;
      }
      console.log("Token gửi đi:", token);

      // Gửi token cho cả 2 request
      const res = await axiosClient.post(
        "/api/registrations/register",
        data,
        // {
        //   headers: {
        //     Authorization: "Bearer " + token,
        //   }
        // }bo cai nay di vi da cau hinh trong axiosClient
      );
      const reg = res.data;

      // Gửi token cho create-payment
      const payRes = await axiosClient.post(
        "/api/vnpay/create-payment",
        { id: reg.id },
        // {
        //   headers: {
        //     Authorization: "Bearer " + token,
        //   }
        // } bo cai nay di vi da cau hinh trong axiosClient
      );
      const payData = payRes.data;

      if (!payData.paymentUrl) throw new Error("Không nhận được URL thanh toán");

      sessionStorage.setItem("registrationId", reg.id);
      sessionStorage.setItem("paymentUrl", payData.paymentUrl);
      setMessage("Đăng ký thành công! Đang chuyển hướng đến trang thanh toán...");
      setTimeout(() => {
        window.location.href = payData.paymentUrl;
      }, 1200);
    } catch (err) {
      console.error("❌ Đã xảy ra lỗi khi gửi đơn:", err);
      console.log("Status code:", err.response?.status);
      setMessage("Lỗi: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="form-container"
      onSubmit={handleSubmit}
      style={{
        opacity: loading ? 0.7 : 1,
        pointerEvents: loading ? "none" : "auto",
      }}
    >
      {message && (
        <div
          style={{
            background: message.startsWith("Đăng ký thành công") ? "#e0f7fa" : "#ffebee",
            color: message.startsWith("Đăng ký thành công") ? "#00796b" : "#c62828",
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}

      <label>Họ và tên:</label>
      <input type="text" name="fullName" required value={formData.fullName} onChange={handleChange} />
      {fieldErrors.fullName && <div className="error">{fieldErrors.fullName}</div>}

      <label>SĐT:</label>
      <input type="text" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} />
      {fieldErrors.phoneNumber && <div className="error">{fieldErrors.phoneNumber}</div>}

      <label>Địa chỉ:</label>
      <input type="text" name="address" required value={formData.address} onChange={handleChange} />
      {fieldErrors.address && <div className="error">{fieldErrors.address}</div>}

      <label>Email:</label>
      <input type="email" name="email" required value={formData.email} onChange={handleChange} />
      {fieldErrors.email && <div className="error">{fieldErrors.email}</div>}

      <label>Số người tham gia:</label>
      <input
        type="number"
        name="numberOfParticipants"
        min="1"
        required
        value={formData.numberOfParticipants}
        onChange={handleChange}
      />

      {formData.participants.map((p, i) => (
        <div className="participant" key={i}>
          <h4>Người {String.fromCharCode(65 + i)}</h4>
          <label>Họ tên:</label>
          <input type="text" value={p.fullName} onChange={(e) => handleParticipantChange(i, "fullName", e.target.value)} />
          {fieldErrors[`participant_${i}_fullName`] && <div className="error">{fieldErrors[`participant_${i}_fullName`]}</div>}

          <label>Giới tính:</label>
          <select value={p.gender} onChange={(e) => handleParticipantChange(i, "gender", e.target.value)}>
            <option value="">--Chọn--</option>
            <option value="NAM">Nam</option>
            <option value="NU">Nữ</option>
          </select>
          {fieldErrors[`participant_${i}_gender`] && <div className="error">{fieldErrors[`participant_${i}_gender`]}</div>}

          <label>Năm sinh:</label>
          <input
            type="number"
            min="1900"
            max={new Date().getFullYear()}
            value={p.yearOfBirth}
            onChange={(e) => handleParticipantChange(i, "yearOfBirth", e.target.value)}
          />
          {fieldErrors[`participant_${i}_yearOfBirth`] && <div className="error">{fieldErrors[`participant_${i}_yearOfBirth`]}</div>}

          <label>Quan hệ:</label>
          <input type="text" value={p.relationship} onChange={(e) => handleParticipantChange(i, "relationship", e.target.value)} />
          {fieldErrors[`participant_${i}_relationship`] && <div className="error">{fieldErrors[`participant_${i}_relationship`]}</div>}
        </div>
      ))}

      <label>Hình thức lấy mẫu:</label>
      <select
        name="collectionMethod"
        required
        value={formData.collectionMethod}
        onChange={handleChange}
      >
        <option value="">--Chọn--</option>
        <option value="HOME">Tại nhà</option>
        <option value="HOSPITAL">Tại bệnh viện</option>
      </select>
      {fieldErrors.collectionMethod && <div className="error">{fieldErrors.collectionMethod}</div>}

      {formData.collectionMethod === "HOSPITAL" && (
        <>
          <label>Ngày hẹn:</label>
          <input
            type="date"
            name="appointmentDate"
            min={today}
            required
            value={formData.appointmentDate}
            onChange={handleChange}
          />
          {fieldErrors.appointmentDate && <div className="error">{fieldErrors.appointmentDate}</div>}
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Đang xử lý..." : "Nộp và thanh toán"}
      </button>
    </form>
  );
}