import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useAuth } from "../../Context/AuthContext";
import axiosClient from "../../config/AxiosClient";
import "../StaffDashboard.css";
import StaffSidebarNav from "../../Staff/StaffSidebarNav";

export default function StaffDashboard() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalRevenue: 0,
    totalBookings: 0,
    totalCustomers: 0,
    latestBookings: [],
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosClient.get("/api/staff/dashboard");
        setDashboardData(res.data);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="staff-bg">
      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <aside className="col-md-2 d-none d-md-block staff-sidebar">
            <StaffSidebarNav />
          </aside>

          {/* Main Content */}
          <main className="col-md-10 ms-sm-auto px-4 py-4">
            {/* Stat Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="staff-card">
                  <div className="card-body d-flex align-items-center">
                    <div className="staff-card-icon bg-primary bg-opacity-10">
                      <i className="bi bi-currency-dollar text-primary fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold">
                        {dashboardData.totalRevenue.toLocaleString("vi-VN")} VND
                      </div>
                      <div className="text-primary fw-semibold">Doanh thu</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="staff-card">
                  <div className="card-body d-flex align-items-center">
                    <div className="staff-card-icon bg-info bg-opacity-10">
                      <i className="bi bi-journal-text text-info fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold">{dashboardData.totalBookings}</div>
                      <div className="text-info fw-semibold">Đơn đăng ký</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="staff-card">
                  <div className="card-body d-flex align-items-center">
                    <div className="staff-card-icon bg-warning bg-opacity-10">
                      <i className="bi bi-people text-warning fs-3"></i>
                    </div>
                    <div>
                      <div className="fs-4 fw-bold">{dashboardData.totalCustomers}</div>
                      <div className="text-warning fw-semibold">Khách hàng</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Latest Bookings */}
            <div className="staff-card">
              <div className="card-header bg-white fw-bold fs-5">
                <i className="bi bi-clock-history me-2"></i>
                Các đơn mới nhất
              </div>
              <ul className="list-group list-group-flush">
                {dashboardData.latestBookings.map((b, idx) => (
                  <li
                    className="list-group-item d-flex align-items-center justify-content-between"
                    key={idx}
                  >
                    <div className="d-flex align-items-center">
                      <img
                        src={b.avatar || "/default-avatar.png"}
                        alt={b.customerName}
                        className="rounded-circle me-3"
                        width={40}
                        height={40}
                      />
                      <div>
                        <div className="fw-semibold">{b.customerName}</div>
                        <div className="text-muted small">
                          {b.serviceName} • {b.createdAt.split("T")[0]}
                        </div>
                      </div>
                    </div>
                    <div>
                      <span className="badge bg-secondary">
                        {b.status.replaceAll("_", " ")}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}