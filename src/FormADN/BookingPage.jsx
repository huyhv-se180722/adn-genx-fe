import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../FormADN/FormADN.css";

export default function BookingPage() {
  const [type, setType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

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
    if (type === "CIVIL") {
      navigate("/customer/dansu?caseType=CIVIL");
    } else if (type === "ADMINISTRATIVE") {
      navigate("/customer/hanhchinh?caseType=ADMINISTRATIVE");
    }
  };

  return (
    <div className="gradient-background-blue">
      <div className="booking-container container py-4">
        {message && (
          <div
            className={`alert ${message.includes("thành công") ? "alert-success" : "alert-danger"
              }`}
          >
            {message}
          </div>
        )}

        <div className="card mb-4">
          <div className="card-body">
            <h4 className="card-title text-center mb-4 text-primary fw-bold">
              Vui lòng xác nhận loại yêu cầu xét nghiệm
            </h4>

            <div className="option-cards d-flex justify-content-center gap-4 flex-wrap">
              <div
                className={`option-card dan-su ${type === "CIVIL" ? "selected" : ""}`}
                onClick={() => setType("CIVIL")}
              >
                <h5 className="fw-bold mb-1">💼 Dân sự</h5>
                <p className="small text-muted mb-0">Mục đích cá nhân, gia đình</p>
              </div>

              <div
                className={`option-card hanh-chinh ${type === "ADMINISTRATIVE" ? "selected" : ""}`}
                onClick={() => setType("ADMINISTRATIVE")}
              >
                <h5 className="fw-bold mb-1">📄 Hành chính</h5>
                <p className="small text-muted mb-0">Phục vụ thủ tục pháp lý</p>
              </div>
            </div>

            <div className="text-center mt-4">
              <button className="btn btn-primary px-4 py-2 fw-bold" onClick={handleNext}>
                Tiếp theo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
