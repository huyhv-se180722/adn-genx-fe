import { useEffect, useState } from "react";
import axiosClient from "../../config/AxiosClient";

export default function HanhChinhForm() {
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
    appointmentDate: "",
    participants: [
      {
        fullName: "",
        gender: "",
        identityNumber: "",
        issueDate: "",
        issuePlace: "",
        yearOfBirth: "",
        relationship: "",
      },
    ],
  });

  useEffect(() => {
    const num = parseInt(formData.numberOfParticipants);
    const updated = Array.from(
      { length: num },
      (_, i) =>
        formData.participants[i] || {
          fullName: "",
          gender: "",
          identityNumber: "",
          issueDate: "",
          issuePlace: "",
          yearOfBirth: "",
          relationship: "",
        }
    );
    setFormData((prev) => ({ ...prev, participants: updated }));
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
    if (!formData.phoneNumber)
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!formData.address) errors.address = "Vui lòng nhập địa chỉ";
    if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!formData.appointmentDate || formData.appointmentDate <= today) {
      errors.appointmentDate = "Ngày hẹn phải sau hôm nay";
    }
    formData.participants.forEach((p, i) => {
      if (!p.fullName) errors[`participant_${i}_fullName`] = "Nhập tên";
      if (!p.gender) errors[`participant_${i}_gender`] = "Chọn giới tính";
      if (!p.identityNumber)
        errors[`participant_${i}_identityNumber`] = "Nhập CCCD";
      if (!p.issueDate) errors[`participant_${i}_issueDate`] = "Nhập ngày cấp";
      if (!p.issuePlace) errors[`participant_${i}_issuePlace`] = "Nhập nơi cấp";
      if (!p.yearOfBirth)
        errors[`participant_${i}_yearOfBirth`] = "Nhập năm sinh";
      if (!p.relationship)
        errors[`participant_${i}_relationship`] = "Nhập quan hệ";
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
        numberOfParticipants: parseInt(formData.numberOfParticipants),
        collectionMethod: "HOSPITAL",
        appointmentDate: formData.appointmentDate,
        serviceId: 2,
        participants: formData.participants,
      };

      const res = await axiosClient.post("/api/registrations", data);
      const reg = res.data;

      const payRes = await axiosClient.post("/api/vnpay", { id: reg.id });
      const payData = payRes.data;

      if (!payData.paymentUrl)
        throw new Error("Không nhận được URL thanh toán");

      sessionStorage.setItem("registrationId", reg.id);
      sessionStorage.setItem("paymentUrl", payData.paymentUrl);
      setMessage(
        "Đăng ký thành công! Đang chuyển hướng đến trang thanh toán..."
      );
      setTimeout(() => {
        window.location.href = payData.paymentUrl;
      }, 1200);
    } catch (err) {
      console.error("❌ Đã xảy ra lỗi khi đăng ký:", err);
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
            background: message.startsWith("Đăng ký thành công")
              ? "#e0f7fa"
              : "#ffebee",
            color: message.startsWith("Đăng ký thành công")
              ? "#00796b"
              : "#c62828",
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
      {/* Phần còn lại giữ nguyên như cũ: các trường input */}
    </form>
  );
}
