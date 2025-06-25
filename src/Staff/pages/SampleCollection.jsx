import React, { useState, useEffect } from 'react';
import axiosClient from '../../config/AxiosClient';
import '../StaffDashboard.css';
import StaffSidebarNav from '../../Staff/StaffSidebarNav';

const sampleStatusLabels = {
  PENDING: 'Chờ xử lý',
  KIT_SENT: 'Đã gửi bộ kit',
  WAITING_FOR_COLLECTION: 'Chờ lấy mẫu',
  CONFIRMED: 'Đã lấy mẫu',
  REJECTED: 'Bị từ chối',
  NEED_RECOLLECT: 'Cần lấy lại mẫu',
};

const sampleStatusColors = {
  PENDING: 'secondary',
  KIT_SENT: 'primary',
  WAITING_FOR_COLLECTION: 'warning',
  CONFIRMED: 'success',
  REJECTED: 'danger',
  NEED_RECOLLECT: 'info',
};

export default function SampleCollection() {
  const [bookings, setBookings] = useState([]);
  const [kitInputs, setKitInputs] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [size] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const fetchBookings = () => {
    axiosClient
      .get(`/api/v1/staff/booking/all?page=${page - 1}&size=${size}`)
      .then((res) => {
        const content = res.data.content || [];
        const safe = content.map((b) => ({
          ...b,
          participants: Array.isArray(b.participants) ? b.participants : [],
        }));
        setBookings(safe);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchBookings();
  }, [page]);

  const handleKitInput = (participantId, value) => {
    setKitInputs((prev) => ({ ...prev, [participantId]: value }));
  };

  const handleConfirm = async (booking, participant) => {
    const isHospital = booking.collectionMethod === 'HOSPITAL';
    const kitCode = kitInputs[participant.id];

    try {
      if (isHospital) {
        if (!kitCode) return;
        await axiosClient.put(
          `/api/v1/staff/sample-collection/participants/${participant.id}/kit-code`,
          { kitCode }
        );
      } else if (
        booking.collectionMethod === 'HOME' &&
        participant.sampleStatus === 'PENDING'
      ) {
        await axiosClient.put(
          `/api/v1/staff/sample-collection/participants/${participant.id}/send-kit`
        );
      } else if (
        booking.collectionMethod === 'HOME' &&
        participant.sampleStatus === 'KIT_SENT'
      ) {
        await axiosClient.put(
          `/api/v1/staff/sample-collection/${participant.id}/confirm`
        );
      }

      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendToLab = async (bookingId) => {
    try {
      await axiosClient.put(
        `/api/v1/staff/sample-collection/bookings/${bookingId}/send-to-lab`
      );
      fetchBookings();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="staff-bg">
      <div className="container-fluid">
        <div className="row">
          <aside className="col-md-2 d-none d-md-block staff-sidebar">
            <StaffSidebarNav />
          </aside>
          <main className="col-md-10 ms-sm-auto px-4 py-4">
            <h4 className="fw-bold mb-3">🧪 Ghi nhận mẫu</h4>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Tìm kiếm theo mã đơn hoặc tên khách hàng"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {bookings.map((booking) => {
              const allConfirmed =
                Array.isArray(booking.participants) &&
                booking.participants.length > 0 &&
                booking.participants.every(
                  (p) => p.sampleStatus === 'CONFIRMED'
                );

              return (
                <div key={booking.id} className="card mb-4 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      Đơn #{booking.code} – {booking.customerName}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      Hình thức lấy mẫu:{' '}
                      <strong>
                        {booking.collectionMethod === 'HOME'
                          ? 'TỰ THU TẠI NHÀ'
                          : 'TẠI BỆNH VIỆN'}
                      </strong>
                    </h6>
                    <p>
                      Trạng thái đơn:{' '}
                      <span className="badge bg-info">
                        {booking.sampleCollectionStatus || 'COLLECTING'}
                      </span>
                    </p>

                    <div className="table-responsive">
                      <table className="table table-bordered table-sm">
                        <thead className="table-light">
                          <tr>
                            <th>Họ tên</th>
                            <th>CMND/CCCD</th>
                            <th>Trạng thái mẫu</th>
                            <th>Mã kit</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {booking.participants.map((p) => {
                            const color =
                              sampleStatusColors[p.sampleStatus] || 'secondary';
                            const label =
                              sampleStatusLabels[p.sampleStatus] || 'Không xác định';

                            const showInput =
                              booking.collectionMethod === 'HOSPITAL' &&
                              p.sampleStatus === 'PENDING';

                            const showButton =
                              ['PENDING', 'KIT_SENT'].includes(p.sampleStatus);

                            return (
                              <tr key={p.id}>
                                <td>{p.fullName}</td>
                                <td>{p.identityNumber || '—'}</td>
                                <td>
                                  <span className={`badge bg-${color}`}>{label}</span>
                                </td>
                                <td>
                                  {showInput ? (
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={kitInputs[p.id] || ''}
                                      onChange={(e) =>
                                        handleKitInput(p.id, e.target.value)
                                      }
                                      placeholder="Nhập mã kit"
                                    />
                                  ) : (
                                    p.kitCode || <i>—</i>
                                  )}
                                </td>
                                <td>
                                  {showButton && (
                                    <button
                                      className="btn btn-primary btn-sm"
                                      onClick={() => handleConfirm(booking, p)}
                                    >
                                      {booking.collectionMethod === 'HOME'
                                        ? p.sampleStatus === 'PENDING'
                                          ? 'Gửi bộ kit'
                                          : 'Xác nhận'
                                        : 'Xác nhận'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {allConfirmed && (
                      <div className="text-end mt-2">
                        {booking.sampleCollectionStatus === 'SENT_TO_LAB' ? (
                          <span className="text-success fw-semibold">
                            ✅ Mẫu đã gửi tới phòng xét nghiệm
                          </span>
                        ) : (
                          <button
                            className="btn btn-primary"
                            onClick={() => handleSendToLab(booking.id)}
                          >
                            Gửi mẫu đến phòng xét nghiệm
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {totalPages > 1 && (
              <nav className="d-flex justify-content-center mt-3">
                <ul className="pagination">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <li
                      key={i}
                      className={`page-item ${page === i + 1 ? 'active' : ''}`}
                    >
                      <button className="page-link" onClick={() => setPage(i + 1)}>
                        {i + 1}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
