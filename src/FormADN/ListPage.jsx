import React, { useState, useEffect } from "react";
import axiosClient from "../config/AxiosClient";

export default function ListPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line
  }, [statusFilter]);

  const loadOrders = async () => {
    setLoading(true);
    setMessage("");
    try {
      const url = `/api/registrations${statusFilter ? `?status=${statusFilter}` : ""}`;
      const res = await axiosClient.get(url);
      let data = [];

      if (Array.isArray(res.data)) {
        data = res.data;
      } else if (res.data && Array.isArray(res.data.data)) {
        data = res.data.data;
      }

      setOrders(data);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách đơn:", err);
      setMessage("Lỗi khi tải danh sách đơn đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn hủy đơn đăng ký này?")) return;
    setLoading(true);
    setMessage("");
    try {
      await axiosClient.put(`/api/registrations/${id}/cancel`);
      setMessage("✅ Hủy đơn thành công");
      loadOrders();
    } catch (err) {
      console.error("❌ Lỗi khi hủy đơn:", err);
      setMessage("Lỗi khi hủy đơn đăng ký");
    } finally {
      setLoading(false);
    }
  };

  const formatStatus = (status) => {
    const map = {
      PAID: "Đã thanh toán",
      UNPAID: "Chưa thanh toán",
      PENDING: "Đang chờ",
      FAILED: "Thất bại",
      CANCELLED: "Đã hủy",
    };
    return map[status] || status;
  };

  const isKitSent = (order) =>
    order.collectionMethod === "HOME" &&
    order.paymentStatus === "PAID" &&
    Array.isArray(order.participants) &&
    order.participants.some((p) => p.sampleStatus === "KIT_SENT");

  const hasKitCode = (order) =>
    Array.isArray(order.participants) &&
    order.participants.some((p) => p.kitCode && p.kitCode.trim() !== "");

  return (
    <div className="container py-4">
      <h2>Danh sách đơn đăng ký</h2>

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

      <div className="filters mb-3">
        <label className="me-2">Lọc theo trạng thái:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          disabled={loading}
        >
          <option value="">Tất cả</option>
          <option value="PAID">Đã thanh toán</option>
          <option value="UNPAID">Chưa thanh toán</option>
          <option value="PENDING">Đang chờ</option>
          <option value="FAILED">Thất bại</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center my-4">Đang tải...</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>Mã đơn</th>
                <th>Họ tên</th>
                <th>Loại dịch vụ</th>
                <th>Ngày đăng ký</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(orders) && orders.length > 0 ? (
                orders.map((order) => {
                  const kitSent = isKitSent(order);
                  const disableCancel =
                    order.paymentStatus !== "PAID" || loading || hasKitCode(order);

                  return (
                    <tr key={order.id}>
                      <td>{order.code || order.id}</td>
                      <td>{order.participants?.[0]?.fullName || "Không rõ"}</td>
                      <td>
                        {order.serviceId === 1
                          ? "Dân sự"
                          : order.serviceId === 2
                            ? "Hành chính"
                            : "Khác"}
                      </td>
                      <td>
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                          : "Không rõ"}
                      </td>
                      <td className={`status-${order.paymentStatus}`}>
                        {formatStatus(order.paymentStatus)}
                      </td>
                      <td>
                        {order.paymentStatus === "PAID" &&
                          Array.isArray(order.participants) &&
                          order.participants.map((p) => {
                            const shouldShowEnterKitButton =
                              p.sampleStatus === "KIT_SENT" &&
                              order.collectionMethod === "HOME" &&
                              (!p.kitCode || p.kitCode.trim() === "");

                            return (
                              <div key={p.id} className="mb-1">
                                {shouldShowEnterKitButton ? (
                                  <button
                                    className="btn btn-info btn-sm"
                                    style={{ marginRight: 4 }}
                                    onClick={() =>
                                      window.location.href = `/customer/enter-kit-info?participantId=${p.id}`
                                    }
                                  >
                                    Điền thông tin kit: {p.fullName || p.id}
                                  </button>
                                ) : (
                                  
                                  p.kitCode && (
                                    <span className="text-success fw-semibold">
                                      ✅ Đã nhập kit: {p.fullName}
                                    </span>
                                  )
                                )}
                              </div>
                            );
                          })}

                        {/* Nút Hủy đơn nếu không còn ai cần điền kit */}
                        {!(
                          Array.isArray(order.participants) &&
                          order.participants.some(
                            (p) =>
                              p.sampleStatus === "KIT_SENT" &&
                              order.collectionMethod === "HOME" &&
                              (!p.kitCode || p.kitCode.trim() === "")
                          )
                        ) && (
                            <button
                              className="btn btn-danger btn-sm"
                              disabled={disableCancel}
                              onClick={() => cancelOrder(order.id)}
                            >
                              Hủy đơn
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="text-center">
                    Không có đơn đăng ký nào.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
