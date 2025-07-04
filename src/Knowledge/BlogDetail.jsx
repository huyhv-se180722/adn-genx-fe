import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import ReactMarkdown from "react-markdown";
import ReactStars from "react-rating-stars-component";
import Header from "../Header/Header";
import "./BlogDetail.css";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [rating, setRating] = useState({ averageRating: 0, totalVotes: 0 });
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get(`/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) => {
        console.error("❌ Không thể tải bài viết:", err);
        navigate("/blog-list");
      });

    axiosClient
      .get(`/api/blogs/${id}/rating`)
      .then((res) => setRating(res.data))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    axiosClient
      .get("/api/blogs?size=9999")
      .then((res) => {
        const total = res.data?.content?.length || 0;
        setCategories([{ name: "Kiến thức y khoa", count: total }]);
      })
      .catch((err) => {
        console.error("Lỗi khi đếm số lượng blog:", err);
      });
  }, []);

  const handleRatingChange = async (newRating) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Bạn cần đăng nhập để đánh giá!");
      return;
    }

    try {
      await axiosClient.post(`/api/blogs/rate?userId=${userId}`, {
        blogId: id,
        rating: newRating,
      });
      const res = await axiosClient.get(`/api/blogs/${id}/rating`);
      setRating(res.data);
    } catch (error) {
      alert("Không thể gửi đánh giá. Có thể bạn đã đánh giá rồi.");
    }
  };

  return (
    <Header>
      <div className="blogdetail-wrapper">
        <div className="blogdetail-container">
          <div className="blogdetail-main">
            {!blog ? (
              <div className="loading">Đang tải bài viết...</div>
            ) : (
              <>
                <button
                  onClick={() => navigate(-1)}
                  className="blogdetail-back"
                >
                  ← Quay lại
                </button>

                <h1 className="blogdetail-title">{blog.title}</h1>

                {blog.thumbnailUrl && (
                  <img
                    src={blog.thumbnailUrl}
                    alt={blog.title}
                    className="blogdetail-image"
                  />
                )}

                <div className="blogdetail-content">
                  <ReactMarkdown>{blog.content}</ReactMarkdown>
                </div>

                <div className="blogdetail-meta">
                  <span>
                    Tác giả: <span className="author">{blog.authorName || "GENX"}</span>
                  </span>
                  <span>• {blog.createdAt?.slice(0, 10)}</span>
                  <span>• {new Intl.NumberFormat("vi-VN").format(blog.viewCount)} lượt xem</span>
                  <span className="rating">
                    • ⭐
                    <ReactStars
                      count={5}
                      value={rating.averageRating}
                      size={20}
                      isHalf={true}
                      edit={false}
                      activeColor="#ffd700"
                    />
                    <span className="rating-count">
                      ({rating.totalVotes} lượt đánh giá)
                    </span>
                  </span>
                  <span className="user-rating">
                    • Đánh giá của bạn:
                    <ReactStars
                      count={5}
                      size={24}
                      isHalf={false}
                      onChange={handleRatingChange}
                      activeColor="#ff9f00"
                    />
                  </span>
                </div>
              </>
            )}
          </div>

          <div className="blogdetail-sidebar">
            <div className="blogdetail-sidebar-box">
              <div className="blogdetail-sidebar-title">CHUYÊN MỤC</div>
              <ul>
                {categories.map((cat, idx) => (
                  <li
                    key={idx}
                    className={`blogdetail-sidebar-item ${idx === 0 ? "active" : ""}`}
                  >
                    <span>{cat.name}</span>
                    <span>{cat.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Header>
  );
};

export default BlogDetail;