import React, { useState, useEffect } from 'react';
import axiosClient from '../../config/AxiosClient';
import '../StaffDashboard.css';
import StaffSidebarNav from '../../Staff/StaffSidebarNav';

const sampleStatusLabels = {
  PENDING: 'Chờ xử lý',
  WAITING_FOR_COLLECTION: 'Chờ lấy mẫu',
  CONFIRMED: 'Đã lấy mẫu',
  REJECTED: 'Bị từ chối',
  NEED_RECOLLECT: 'Cần lấy lại mẫu',
};

const sampleStatusColors = {
  PENDING: 'secondary',
  WAITING_FOR_COLLECTION: 'warning',
  CONFIRMED: 'success',
  REJECTED: 'danger',
  NEED_RECOLLECT: 'info',
};

const collectionStatusLabels = {
  COLLECTING: 'Đang thu mẫu',
  SENT_TO_LAB: 'Đã gửi lab',
  COMPLETED: 'Hoàn tất',
  CANCELED: 'Đã hủy',
};

const collectionStatusColors = {
  COLLECTING: 'staff-status-pending',
  SENT_TO_LAB: 'staff-status-confirmed',
  COMPLETED: 'staff-status-collected',
  CANCELED: 'staff-status-canceled',
};

const collectionMethodLabels = {
  HOSPITAL: 'Tại bệnh viện',
  HOME: 'Tại nhà',
};

export default function CollectionHistory() {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [historyBookings, setHistoryBookings] = useState([]);

  useEffect(() => {
    axiosClient.get('/api/v1/staff/sample-collection/history')
      .then((res) => {
        setHistoryBookings(res.data);
      })
      .catch((err) => {
        console.error('Lỗi khi tải lịch sử thu mẫu:', err);
      });
  }, []);

  const filteredBookings = historyBookings.filter(booking => {
    const matchesSearch = booking.bookingCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.collectedByName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="staff-bg">
      <div className="container-fluid">
        <div className="row">
          <aside className="col-md-2 d-none d-md-block staff-sidebar">
            <StaffSidebarNav />
          </aside>
          <main className="col-md-10 ms-sm-auto px-4 py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="fw-bold mb-3">
                <i className="bi bi-clock-history me-2"></i>
                Lịch sử thu mẫu
              </h4>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control staff-search-input"
                  style={{ minWidth: 260 }}
                  placeholder="🔍 Tìm mã đơn, tên khách hoặc người thu mẫu"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <select
                  className="form-control"
                  style={{ minWidth: 170 }}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="SENT_TO_LAB">Đã gửi lab</option>
                  <option value="COMPLETED">Hoàn tất</option>
                  <option value="CANCELED">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover table-borderless shadow-sm rounded bg-white">
                <thead className="thead-light">
                  <tr>
                    <th style={{ minWidth: 90 }}>Mã đơn</th>
                    <th style={{ minWidth: 160 }}>Khách hàng</th>
                    <th>Hình thức</th>
                    <th>Người thu mẫu</th>
                    <th>Thời gian</th>
                    <th>Trạng thái</th>
                    <th>Số mẫu</th>
                    <th className="text-center" style={{ minWidth: 120 }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                    <tr key={booking.collectionId} className="align-middle">
                      <td className="fw-semibold">{booking.bookingCode}</td>
                      <td>{booking.customerName}</td>
                      <td>{collectionMethodLabels[booking.collectionOption] || booking.collectionOption}</td>
                      <td>{booking.collectedByName}</td>
                      <td>{booking.collectedAt}</td>
                      <td>
                        <span className={`staff-status-badge ${collectionStatusColors[booking.status]}`}>
                          {collectionStatusLabels[booking.status]}
                        </span>
                      </td>
                      <td>{booking.participants.length}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <i className="bi bi-eye me-1"></i>Chi tiết
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="8" className="text-center py-3 text-muted">
                        Không tìm thấy lịch sử thu mẫu.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {selectedBooking && (
              <div className="staff-modal-overlay">
                <div className="staff-modal-container">
                  <div className="staff-modal-header">
                    <div className="staff-modal-title">
                      <i className="bi bi-file-earmark-text"></i>
                      <span>Chi tiết lịch sử #{selectedBooking.bookingCode}</span>
                    </div>
                    <button className="staff-modal-close" onClick={() => setSelectedBooking(null)}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>

                  <div className="staff-modal-body">
                    <div className="staff-booking-info">
                      <div className="staff-info-grid">
                        <div className="staff-info-item">
                          <span className="staff-info-label">Tên khách hàng:</span>
                          <span className="staff-info-value">{selectedBooking.customerName}</span>
                        </div>
                        <div className="staff-info-item">
                          <span className="staff-info-label">Người thu mẫu:</span>
                          <span className="staff-info-value">{selectedBooking.collectedByName}</span>
                        </div>
                        <div className="staff-info-item">
                          <span className="staff-info-label">Hình thức lấy mẫu:</span>
                          <span className="staff-info-value">{collectionMethodLabels[selectedBooking.collectionOption] || selectedBooking.collectionOption}</span>
                        </div>
                        <div className="staff-info-item">
                          <span className="staff-info-label">Thời gian thu mẫu:</span>
                          <span className="staff-info-value">{selectedBooking.collectedAt}</span>
                        </div>
                        <div className="staff-info-item">
                          <span className="staff-info-label">Trạng thái:</span>
                          <span className={`staff-status-badge ${collectionStatusColors[selectedBooking.status]}`}>
                            {collectionStatusLabels[selectedBooking.status]}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="staff-participants-section">
                      <h6 className="staff-section-title">
                        <i className="bi bi-people"></i>
                        Danh sách mẫu đã thu
                      </h6>
                      <div className="staff-table-container">
                        <table className="staff-participants-table">
                          <thead>
                            <tr>
                              <th>Họ tên</th>
                              <th>CMND/CCCD</th>
                              <th>Mã kit</th>
                              <th>Trạng thái mẫu</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedBooking.participants.map((p) => (
                              <tr key={p.id}>
                                <td>{p.fullName}</td>
                                <td>{p.identityNumber}</td>
                                <td>{p.kitCode}</td>
                                <td>
                                  <span className={`staff-status-badge bg-${sampleStatusColors[p.sampleStatus]}`}>
                                    {sampleStatusLabels[p.sampleStatus]}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  <div className="staff-modal-footer">
                    <button className="staff-btn-close" onClick={() => setSelectedBooking(null)}>
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
