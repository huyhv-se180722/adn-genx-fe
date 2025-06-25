import React, { useState } from "react";
import axiosClient from "../config/AxiosClient";

const LOCUS_LIST = [
  "Amelogenin",
  "D3S1358",
  "D1S1656",
  "D2S441",
  "D10S1248",
  "D13S317",
  "Penta E",
  "D16S539",
  "D18S51",
  "D2S1338",
  "CSF1PO",
  "Penta D",
  "TH01",
  "vWA",
  "D21S11",
  "D7S820",
  "D5S818",
  "TPOX",
  "DYS391",
  "D8S1179",
  "D12S391",
  "D19S433",
  "FGA",
  "D22S1045",
];

const AdnResultForm = () => {
  const [bookingId, setBookingId] = useState("");
  const [participants, setParticipants] = useState([]);
  const [conclusion, setConclusion] = useState("");
  const [lociData, setLociData] = useState({});
  const [info, setInfo] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleLoadParticipants = async () => {
    try {
      const res = await axiosClient.get(
        `/api/adn-results/booking/${bookingId}/participants`
      );
      setParticipants(res.data);
      setShowForm(true);

      const resInfo = await axiosClient.get(
        `/api/adn-results/booking/${bookingId}/info`
      );
      setInfo(resInfo.data);
    } catch (err) {
      alert("Không thể tải dữ liệu.");
      console.error(err);
    }
  };

  const handleLocusChange = (locus, kitCode, value) => {
    setLociData((prev) => ({
      ...prev,
      [`${locus}_${kitCode}`]: value,
    }));
  };

  const handleSave = async () => {
    const lociResults = {};
    LOCUS_LIST.forEach((locus) => {
      const values = participants.map(
        (p) => lociData[`${locus}_${p.kitCode}`] || ""
      );
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
      const res = await axiosClient.post("/api/adn-results", body);
      alert("Đã lưu: " + res.data);
    } catch (err) {
      alert("Lỗi khi lưu kết quả.");
      console.error(err);
    }
  };

  const handleExport = async () => {
    try {
      const res = await axiosClient.get(
        `/api/adn-results/export/${bookingId}`,
        {
          responseType: "blob",
        }
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      alert("Lỗi khi xuất PDF.");
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Nhập kết quả xét nghiệm ADN</h2>
      <div className="space-y-4">
        <label>
          Booking ID:
          <input
            type="number"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            onBlur={handleLoadParticipants}
            className="border p-2 ml-2"
            required
          />
        </label>

        {info && (
          <div className="bg-gray-100 p-4 rounded shadow-sm">
            <p>
              <strong>Loại đơn:</strong>{" "}
              {info.type === "CIVIL" ? "Dân sự" : "Hành chính"}
            </p>
            <p>
              <strong>Người đăng ký:</strong> {info.registrantName}
            </p>
            <p>
              <strong>Thông tin thêm:</strong> {info.description}
            </p>
          </div>
        )}

        {participants.length > 0 && (
          <div className="space-y-2">
            <p>
              <strong>Số người tham gia:</strong> {participants.length}
            </p>
            {participants.map((p, i) => (
              <div key={p.kitCode} className="bg-white p-2 border rounded">
                <p>
                  Người {i + 1}: {p.fullName} ({p.relationship}) - {p.kitCode}
                </p>
              </div>
            ))}
          </div>
        )}

        {showForm && (
          <>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full text-sm border">
                <thead>
                  <tr>
                    <th className="border p-1">Locus</th>
                    {participants.map((p) => (
                      <th key={p.kitCode} className="border p-1">
                        {p.fullName}
                        <br />
                        <small>
                          {p.relationship} - {p.kitCode}
                        </small>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {LOCUS_LIST.map((locus) => (
                    <tr key={locus}>
                      <td className="border p-1">{locus}</td>
                      {participants.map((p) => (
                        <td key={p.kitCode} className="border p-1">
                          <input
                            type="text"
                            className="w-full border px-1"
                            onChange={(e) =>
                              handleLocusChange(
                                locus,
                                p.kitCode,
                                e.target.value
                              )
                            }
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 space-y-2">
              <label className="block">Kết luận:</label>
              <label>
                <input
                  type="radio"
                  name="conclusion"
                  value="yes"
                  onChange={(e) => setConclusion(e.target.value)}
                />{" "}
                Có quan hệ huyết thống
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="conclusion"
                  value="no"
                  onChange={(e) => setConclusion(e.target.value)}
                />{" "}
                Không có quan hệ huyết thống
              </label>
            </div>

            <div className="mt-4 space-x-2">
              <button
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                💾 Lưu kết quả
              </button>
              <button
                onClick={handleExport}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                📄 Xuất PDF
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdnResultForm;
