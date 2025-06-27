import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../FormADN/FormADN.css";

export default function BookingPage() {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // 👈 Thêm hook điều hướng

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

    if (type === "dan_su") {
      navigate("/test/dansu"); // 👈 Chuyển sang trang dân sự
    } else if (type === "hanh_chinh") {
      navigate("/test/hanhchinh"); // 👈 Chuyển sang hành chính
    }
  };

  return (
    <div className="booking-container container py-4">
      {message && (
        <div
          className={`alert ${
            message.includes("thành công") ? "alert-success" : "alert-danger"
          }`}
        >
          {message}
        </div>
      )}

      <div className="card mb-4">
        <div className="card-body">
          <h4 className="card-title text-center mb-3 text-primary">Chọn loại yêu cầu</h4>
          <div className="d-flex justify-content-center align-items-center">
            <select
              className="form-select me-2 w-50"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-- Chọn loại --</option>
              <option value="dan_su">Dân sự</option>
              <option value="hanh_chinh">Hành chính</option>
            </select>
            <button className="btn btn-primary" type="button" onClick={handleNext}>
              Tiếp theo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
