import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Service.css';
import familyTest from '../../assets/Service/family-test.png';
import Header from '../../Header/Header.jsx';
import Footer from '../../Footer/Footer.jsx';

import familyImage from '../../assets/Service/family-image.png';

import buildingImage from '../../assets/Service/building-image.png';
const Service = () => {
  const navigate = useNavigate();

  return (
    <div className="service-page">
      <Header />
      <div className="service-container">

        <div className="service-header">
          <h1>Dịch Vụ Xét Nghiệm Tại <span className="highlight">Gene+</span></h1>
          <p className="service-desc">
            Tại đây cung cấp nhiều nội dung xét nghiệm ADN khác nhau để đáp ứng nhu cầu của bạn.
            Tất cả các kết quả xét nghiệm chúng tôi đều cam kết đạt độ tin cậy và chính xác cao nhất.
            Những dịch vụ chính mà chúng tôi cung cấp sẽ được mô tả ngắn gọn trong từng mục sau đây:
          </p>
        </div>

        <div className="service-types">
          <button className="type-btn civil">ADN DÂN SỰ</button>
          <button className="type-btn admin">ADN HÀNH CHÍNH</button>
        </div>

        <div className="service-content">
          <div className="family-test">
            <h2>FAMILY TEST</h2>
            <div className="family-content">
              <img src={familyTest} alt="Family Test" className="family-img" />
              <div className="test-types">
                <div className="test-item">
                  <span>Cha - con</span>
                  <button className="detail-btn">Chi tiết</button>
                </div>
                <div className="test-item">
                  <span>Mẹ - con</span>
                  <button className="detail-btn">Chi tiết</button>
                </div>
                <div className="test-item">
                  <span>Anh/chị - em</span>
                  <button className="detail-btn">Chi tiết</button>
                </div>
                <div className="test-item">
                  <span>Ông/bà - cháu</span>
                  <button className="detail-btn">Chi tiết</button>
                </div>
                <div className="action-btns">
                  <button className="register-btn">Đăng ký</button>
                  <button className="price-btn">Bảng giá</button>
                </div>
              </div>
            </div>
          </div>
          <p className="service-note">
            Khi niềm tin được đặt đúng chỗ!! Gene+ chắc chắn mang lại cho bạn dịch vụ xét nghiệm có chất lượng với độ chính xác trên cả mong đợi.
          </p>
        </div>

        {/* ADN DAN SU */}
        <div className="service-introduction">
          <div className="sidebar">
            <h3 className="sidebar-title">NỘI DUNG</h3>
            <ul className="sidebar-menu">
              <li>Xét nghiệm ADN dân sự là gì?</li>
              <li>Có thể làm xét nghiệm ADN giải tỏa nghi ngờ cho những mối quan hệ nào ?</li>
              <li>5 bước thực hiện xét nghiệm ADN dân sự</li>
              <li>Chi phí xét nghiệm ADN dân sự</li>
              <li>Bảo mật thông tin khi làm xét nghiệm ADN</li>
            </ul>
          </div>

          <div className="main-content">
            <div className="intro-text">
              <p>
                Nếu bạn đang nghi ngờ người vợ của mình không chung thủy, bạn có thể đang cảm thấy lo lắng, tổn thương, trăn trở và hơn thế nữa. Sự nghi ngờ sẽ tạo ra vết nứt phá hủy mối quan hệ trong gia đình hay giữa cá nhân với nhau và nó không đễ chịu chút nào cả. Mặc dù những tình huống này thường phức tạp, rồi lâm về việc không biết làm gì tiếp theo, nhưng có một cách để nhận được giải đáp cho những băn khoán lo là xét nghiệm ADN để giải tỏa nghi ngờ về mối quan hệ cá nhân.
              </p>
              <p>
                Với xét nghiệm ADN dân sự, bạn có thể xác nhận hoặc phủ nhận những nghi ngờ của mình, cho phép bạn đưa ra quyết định đúng đắn, sáng suốt giải thoát cảm xúc tiêu cực hiện có trong bạn. Dù chính xác của công nghệ xét nghiệm huyết thống này, là những chứng khoa học không thể chối cãi đối với những ai muốn che dấy sự thật, giúp bạn có thể chọn con đường phù hợp cho mình trong mối quan hệ đó.
              </p>
            </div>
            <img src={familyImage} alt="Family" className="intro-image" />
          </div>
        </div>

        <div className="service-definition">
          <h2 className="section-title yellow-text">Xét nghiệm ADN dân sự là gì?</h2>
          <p>
            Xét nghiệm ADN tự nguyện nhằm mục đích giải tỏa nghi ngờ cá nhân cho các mối quan hệ như: Cha / mẹ – con, anh / chị – em, ông / bà – cháu, họ hàng nội ngoại.
          </p>
          <p className="warning">* Lưu ý: Loại dịch vụ này không có giá trị pháp lý.</p>
        </div>

        {/* ...existing code... ADN DAN SU 1*/}

        <div className="civil-service">
          <h1 className="service-title">XÉT NGHIỆM ADN DÂN SỰ</h1>

          <div className="relationship-section">
            <h2 className="section-title">
              Có thể làm xét nghiệm ADN giải tỏa nghi ngờ cho những mối quan hệ nào ?
            </h2>
            <ul className="relationship-list">
              <li>Xét nghiệm ADN Cha Con / mẹ – con</li>
              <li>Xét nghiệm ADN thai nhi trước sinh không xâm lấn tìm cha</li>
              <li>Xét nghiệm ADN Anh/chị – em</li>
              <li>Xét nghiệm ADN Ông Bà và Cháu (Ông nội-cháu Trai; Bà nội-cháu Gái)</li>
              <li>Xét nghiệm ADN Họ Hàng (nội ngoại, cô dì chú bác,...)</li>
            </ul>
          </div>

          <div className="process-section">
            <h2 className="section-title">
              Có thể làm xét nghiệm ADN giải tỏa nghi ngờ cho những mối quan hệ nào ?
            </h2>
            <ul className="process-steps">
              <li>Bước 1: Chọn trung tâm xét nghiệm uy tín</li>
              <li>Bước 2: Đăng ký / đặt lịch xét nghiệm ADN</li>
              <li>Bước 3: Thu thập mẫu xét nghiệm</li>
              <li>Bước 4: Gửi mẫu xét nghiệm đến trung tâm</li>
              <li>Bước 5: Nhận kết quả xét nghiệm</li>
            </ul>

            <div className="process-details">
              <p className="detail-subtitle">Chi tiết quy trình gồm các bước sau đây:</p>
              <div className="step-content">
                <div className="step-info">
                  <h3 className="pink-title">Bước 1: Chọn trung tâm xét nghiệm uy tín</h3>
                  <p>
                    Trung tâm xét nghiệm Gene+ là đơn vị uy tín, đã và đang cung cấp
                    dịch vụ xét nghiệm ADN huyết thống chính xác 99,99% cho các
                    mối quan hệ như: Cha / mẹ – con, anh /chị – em, ông / bà – cháu, họ
                    hàng nội ngoại.
                  </p>
                </div>
                <img src={buildingImage} alt="Gene+ Building" className="building-image" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Service;