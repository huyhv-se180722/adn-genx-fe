import { useState, useEffect } from "react";
import DanSuForm from "../FormADN/Components/DanSuForm";
import HanhChinhForm from "../FormADN/Components/HanhChinhForm";
import "../FormADN/FormADN.css";
export default function BookingPage() {
  const [type, setType] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const vnp_ResponseCode = urlParams.get("vnp_ResponseCode");
    const vnp_TxnRef = urlParams.get("vnp_TxnRef");
    if (vnp_ResponseCode && vnp_TxnRef) {
      setMessage(
        vnp_ResponseCode === "00"
          ? "Thanh toán thành công!"
          : "Thanh toán thất bại!"
      );
    }
  }, []);

  const handleNext = () => {
    if (!type) {
      setMessage("Vui lòng chọn loại yêu cầu");
      return;
    }
    setMessage("");
    setShowForm(true);
  };

  return (
    <div className="booking-container">
      {message && (
        <div
          style={{
            background: message.includes("thành công") ? "#e0f7fa" : "#ffebee",
            color: message.includes("thành công") ? "#00796b" : "#c62828",
            padding: "8px 12px",
            borderRadius: 6,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          {message}
        </div>
      )}
      <h2>Chọn loại yêu cầu</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="">-- Chọn loại --</option>
        <option value="dan_su">Dân sự</option>
        <option value="hanh_chinh">Hành chính</option>
      </select>
      <button type="button" onClick={handleNext} style={{ marginLeft: 8 }}>
        Tiếp theo
      </button>

      {showForm && type === "dan_su" && <DanSuForm />}
      {showForm && type === "hanh_chinh" && <HanhChinhForm />}
    </div>
  );
}