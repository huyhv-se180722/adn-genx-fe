import React, { useEffect, useState } from "react";
import axiosClient from "../config/AxiosClient";
import { useLocation, useNavigate } from "react-router-dom";
import LabSidebarNav from "../Lab/LabSidebarNav";

const LOCUS_LIST = [
  "Amelogenin", "D3S1358", "D1S1656", "D2S441", "D10S1248", "D13S317", "Penta E",
  "D16S539", "D18S51", "D2S1338", "CSF1PO", "Penta D", "TH01", "vWA", "D21S11",
  "D7S820", "D5S818", "TPOX", "DYS391", "D8S1179", "D12S391", "D19S433", "FGA", "D22S1045"
];

export default function EnterResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const bookingId = location.state?.bookingId || sessionStorage.getItem("bookingId");

  const [participants, setParticipants] = useState([]);
  const [conclusion, setConclusion] = useState("");
  const [lociData, setLociData] = useState({});
  const [showForm, setShowForm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    document.body.style.overflow = showConfirmModal ? "hidden" : "auto";
  }, [showConfirmModal]);

  useEffect(() => {
    const load = async () => {
      if (!bookingId) {
        alert("Không tìm thấy mã đơn.");
        navigate("/lab/dashboard");
        return;
      }

      try {
        const res = await axiosClient.get(`/api/adn-results/booking/${bookingId}/participants`);
        setParticipants(res.data);
        setShowForm(true);
      } catch (err) {
        alert("Không thể tải dữ liệu người tham gia.");
        console.error("Lỗi khi tải participants:", err);
      }
    };

    load();
  }, [bookingId, navigate]);

  const handleLocusChange = (locus, kitCode, value) => {
    setLociData((prev) => ({
      ...prev,
      [`${locus}_${kitCode}`]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      axiosClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }

    const lociResults = {};
    LOCUS_LIST.forEach((locus) => {
      const values = participants.map((p) => lociData[`${locus}_${p.kitCode}`] || "");
      if (values.every((v) => v.trim() !== "")) {
        lociResults[locus] = values.join(" - ");
      }
    });

    const body = {
      bookingId: Number(bookingId),
      conclusion:
        conclusion === "yes"
          ? "Có quan hệ huyết thống"
          : "Không đủ bằng chứng xác nhận quan hệ huyết thống",
      lociResults,
    };

    try {
      await axiosClient.post("/api/adn-results", body);
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/adn-results/complete-sample/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          credentials: "include",
        }
      );
      alert("✅ Kết quả đã được lưu và trạng thái đơn đã cập nhật!");
      setIsSaved(true);
    } catch (err) {
      console.error("🔥 Lỗi khi gọi API:", err.response || err);
      alert("❌ Lỗi khi lưu kết quả hoặc cập nhật trạng thái.");
    }
  };

  // ✅ HÀM GỬI LẠI MÃ TRA CỨU
  const handleResendTrackingInfo = async () => {
    try {
      await axiosClient.post(`/api/adn-results/resend-tracking-info/${bookingId}`);
      alert("📨 Mã tra cứu đã được gửi lại cho khách hàng.");
    } catch (err) {
      console.error("❌ Lỗi khi gửi lại mã tra cứu:", err);
      alert("Không thể gửi lại mã tra cứu.");
    }
  };

  const handleExport = async () => {
    try {
      const res = await axiosClient.get(`/api/adn-results/export/${bookingId}`, {
        responseType: "blob",
      });
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("Lỗi khi xuất PDF.");
      console.error(err);
    }
  };

  return (
    <div className="d-flex">
      <div className="p-3 border-end" style={{ width: "260px", minHeight: "100vh", background: "#f8f9fa" }}>
        <LabSidebarNav />
      </div>

      <div className="p-4 flex-grow-1 container">
        <h4 className="fw-bold mb-3">Nhập kết quả xét nghiệm ADN</h4>

        {participants.length > 0 && (
          <div className="mb-3">
            <p><strong>Số người tham gia:</strong> {participants.length}</p>
            <ul className="list-group mb-3">
              {participants.map((p, i) => (
                <li key={p.kitCode} className="list-group-item">
                  Người {i + 1}: <strong>{p.fullName}</strong> ({p.relationship}) – <code>{p.kitCode}</code>
                </li>
              ))}
            </ul>
          </div>
        )}

        {showForm && (
          <>
            <div className="table-responsive mb-4">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Locus</th>
                    {participants.map((p) => (
                      <th key={p.kitCode}>
                        {p.fullName}<br /><small>{p.relationship} – {p.kitCode}</small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOCUS_LIST.map((locus) => (
                    <tr key={locus}>
                      <td><strong>{locus}</strong></td>
                      {participants.map((p) => (
                        <td key={`${locus}_${p.kitCode}`}>
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            disabled={isSaved}
                            value={lociData[`${locus}_${p.kitCode}`] || ""}
                            onChange={(e) => handleLocusChange(locus, p.kitCode, e.target.value)}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Kết luận:</label>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="conclusion"
                  value="yes"
                  id="yes"
                  disabled={isSaved}
                  onChange={(e) => setConclusion(e.target.value)}
                />
                <label className="form-check-label" htmlFor="yes">
                  Có quan hệ huyết thống
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="conclusion"
                  value="no"
                  id="no"
                  disabled={isSaved}
                  onChange={(e) => setConclusion(e.target.value)}
                />
                <label className="form-check-label" htmlFor="no">
                  Không đủ bằng chứng xác nhận quan hệ huyết thống
                </label>
              </div>
            </div>

            {/* 🔄 ĐÃ SỬA: Thêm nút gửi lại mã tra cứu vào đây */}
            <div className="mb-4 d-flex gap-2 flex-wrap">
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isSaved}
                className={`btn ${isSaved ? "btn-secondary" : "btn-primary"}`}
              >
                💾 {isSaved ? "Đã lưu" : "Lưu kết quả"}
              </button>

              <button
                onClick={handleExport}
                className="btn btn-outline-primary"
              >
                📄 Xuất PDF
              </button>

              {isSaved && (
                <button
                  onClick={handleResendTrackingInfo}
                  className="btn btn-outline-success"
                >
                  📩 Gửi lại mã tra cứu
                </button>
              )}
            </div>
          </>
        )}

        {showConfirmModal && (
          <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Xác nhận lưu kết quả</h5>
                </div>
                <div className="modal-body">
                  <p>
                    ⚠️ Mọi thông tin sẽ được lưu và không thể thay đổi. <br />
                    Bạn có chắc muốn tiếp tục?
                  </p>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowConfirmModal(false)}>
                    Huỷ
                  </button>
                  <button className="btn btn-primary" onClick={() => {
                    setShowConfirmModal(false);
                    handleSave();
                  }}>
                    Xác nhận
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
