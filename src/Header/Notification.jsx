import React, { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import { useAuth } from "../Context/AuthContext";
import "./Notification.css";

export default function Notification() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Lấy role và userId nếu cần
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Load thông báo khi component mount
  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".notification-wrapper")) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Gọi API lấy thông báo
  const fetchNotifications = async () => {
    try {
      const [allRes, unreadRes] = await Promise.all([
        axiosClient.get("/api/notifications"),
        axiosClient.get("/api/notifications/unread"),
      ]);
      const data = Array.isArray(allRes.data.result) ? allRes.data.result : [];
      setNotifications(data);
      setUnreadCount(unreadRes.data.result ?? 0);
    } catch (err) {
      console.error("Lỗi khi lấy thông báo:", err);
      setNotifications([]);
      setUnreadCount(0);
    }
  };

  // Khi click vào 1 thông báo
  const handleNotificationClick = async (n) => {
    try {
      if (!n.read) {
        await axiosClient.post(`/api/notifications/${n.id}/read`);
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === n.id ? { ...item, read: true } : item
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }

      // Điều hướng theo role
      const role = user?.role?.toLowerCase?.() || "customer";

      if (n.bookingId) {
        navigate(`/${role}/bookings/${n.bookingId}`);
      } else {
        navigate(`/${role}/dashboard`);
      }
    } catch (err) {
      console.error("Lỗi khi xử lý thông báo:", err);
    }
  };

  // Tạo nội dung hiển thị tùy loại
  const getNotificationMessage = (n) => {
    switch (n.type) {
      case "BOOKING_CONFIRMED":
        return "Đơn đăng ký đã được xác nhận";
      case "KIT_SENT":
        return "Bộ kit đã được gửi đến";
      case "SAMPLE_RECEIVED":
        return "Mẫu đã được thu nhận";
      default:
        return n?.message || "Bạn có một thông báo mới";
    }
  };

  return (
    <div className="notification-wrapper">
      <div
        className="notification-bell"
        onClick={() => setIsDropdownOpen((prev) => !prev)}
      >
        <Bell color="#333" size={20} />
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </div>

      {isDropdownOpen && (
        <div className="notification-dropdown">
          {notifications.length === 0 ? (
            <div className="notification-empty">Không có thông báo nào</div>
          ) : (
            notifications.map((n, index) => (
              <div
                key={index}
                className={`notification-item ${!n.read ? "unread" : ""}`}
                onClick={() => handleNotificationClick(n)}
              >
                {!n.read && <span className="notification-dot" />}
                {getNotificationMessage(n)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
