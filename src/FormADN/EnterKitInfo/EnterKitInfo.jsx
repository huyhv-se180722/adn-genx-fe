import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axiosClient from "../../config/AxiosClient";
import { useAuth } from "../../Context/AuthContext";

export default function EnterKitInfo() {
  const [searchParams] = useSearchParams();
  const participantId = searchParams.get("participantId");

  const [kitCode, setKitCode] = useState("");
  const [message, setMessage] = useState("");
  const [participant, setParticipant] = useState(null);
  const [loading, setLoading] = useState(false);

  const { accessToken } = useAuth();
  const navigate = useNavigate(); // 👈 Thêm hook điều hướng

  useEffect(() => {
    const fetchParticipant = async () => {
      try {
        const res = await axiosClient.get(
          `/api/v1/customer/sample-collection/participants/${participantId}`,
          {
            headers: {
              Authorization: "Bearer " + accessToken,
            },
          }
        );
        setParticipant(res.data);
      } catch (err) {
        setMessage("Không thể lấy thông tin người tham gia.");
        console.error(err);
      }
    };

    if (participantId && accessToken) {
      fetchParticipant();
    }
  }, [participantId, accessToken]);

  const handleSubmit = async () => {
    if (!kitCode.trim()) {
      setMessage("Vui lòng nhập mã kit.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      await axiosClient.put(
        `/api/v1/customer/sample-collection/participants/${participantId}/kit-code`,
        { kitCode },
        {
          headers: {
            Authorization: "Bearer " + accessToken,
          },
        }
      );
      setMessage("✅ Gửi mã kit thành công!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Gửi mã kit thất bại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <h3>Nhập mã kit</h3>
      {participant && (
        <p>
          Người tham gia: <strong>{participant.fullName}</strong>
        </p>
      )}

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Nhập mã kit..."
        value={kitCode}
        onChange={(e) => setKitCode(e.target.value)}
      />
      <button
        className="btn btn-primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        Gửi mã kit
      </button>

      {message && <div className="mt-3 alert alert-info">{message}</div>}

      {/* ✅ Nút quay lại chỉ hiển thị khi gửi thành công */}
      {message.includes("✅") && (
        <button
          className="btn btn-outline-secondary mt-3"
          onClick={() => navigate("/test/list")}
        >
          ← Quay lại danh sách đơn
        </button>
      )}
    </div>
  );
}
