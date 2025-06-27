import React, { useState, useEffect } from "react";
import axiosClient from "../config/AxiosClient";
import Header from "../Header/Header"; // đường dẫn đến Header tùy vào cấu trúc project của bạn

export default function ListPage() {
  const [orders, setOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadOrders();
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
    <Header>
      <div className="container py-4">
        <div className="bg-white shadow-sm rounded p-4">
          <h2 className="fw-bold mb-4">Danh sách đơn đăng ký</h2>

          {message && (
            <div
              className={`alert ${message.includes("thành công") ? "alert-success" : "alert-danger"
                } text-center`}
            >
              {message}
            </div>
          )}

          <div className="d-flex align-items-center gap-2 mb-4">
            <span className="fw-semibold">📊 Lọc theo trạng thái:</span>
            <div style={{ minWidth: 200 }}>
              <select
                className="form-select form-select-sm border-dark"
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
          </div>

          {loading ? (
            <div className="text-center my-4">Đang tải...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th className="text-muted">#</th>
                    <th className="text-muted">Mã đơn</th>
                    <th className="text-muted">Khách hàng</th>
                    <th className="text-muted">Dịch vụ</th>
                    <th className="text-muted">Ngày tạo</th>
                    <th className="text-muted">Trạng thái</th>
                    <th className="text-muted">Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(orders) && orders.length > 0 ? (
                    orders.map((order, index) => {
                      const status = order.paymentStatus;
                      const statusBadge = {
                        PAID: "success",
                        UNPAID: "danger",
                        PENDING: "primary",
                        FAILED: "secondary",
                        CANCELLED: "dark",
                      }[status] || "light";

                      const kitSent = isKitSent(order);
                      const disableCancel =
                        order.paymentStatus !== "PAID" || loading || hasKitCode(order);

                      return (
                        <tr key={order.id}>
                          <td>{index + 1}</td>
                          <td className="fw-semibold">#{order.code || order.id}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <div
                                className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center me-2"
                                style={{ width: 32, height: 32, fontSize: 14 }}
                              >
                                {order.customerName?.[0] ||
                                  order.participants?.[0]?.fullName?.[0] ||
                                  "?"}
                              </div>
                              <span className="fw-semibold">
                                {order.customerName ||
                                  order.participants?.[0]?.fullName ||
                                  "Không rõ"}
                              </span>
                            </div>
                          </td>
                          <td className="text-muted">
                            {order.serviceId === 1
                              ? "Dân sự"
                              : order.serviceId === 2
                                ? "Hành chính"
                                : "Khác"}
                          </td>
                          <td className="text-muted">
                            {order.createdAt
                              ? new Date(order.createdAt).toLocaleDateString("vi-VN")
                              : "Không rõ"}
                          </td>
                          <td>
                            <span className={`badge bg-${statusBadge}`}>
                              {formatStatus(order.paymentStatus)}
                            </span>
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
                                        className="btn btn-outline-info btn-sm me-2 mt-1"
                                        onClick={() =>
                                          (window.location.href = `/customer/enter-kit-info?participantId=${p.id}`)
                                        }
                                      >
                                        Điền kit: {p.fullName || p.id}
                                      </button>
                                    ) : (
                                      p.kitCode && (
                                        <span className="text-success fw-semibold d-inline-block mt-1">
                                          ✅ Đã nhập: {p.fullName}
                                        </span>
                                      )
                                    )}
                                  </div>
                                );
                              })}

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
                                  className={`btn btn-sm mt-2 ${disableCancel ? "btn-outline-danger" : "btn-danger"}`}
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
                      <td colSpan="7" className="text-center">
                        Không có đơn đăng ký nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Header>
  );
}
