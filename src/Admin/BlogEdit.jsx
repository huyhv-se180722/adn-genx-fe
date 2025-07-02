import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import { uploadToCloudinary } from "../config/cloudinaryUpload";

const BlogEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [blog, setBlog] = useState({
    title: "",
    shortDescription: "",
    content: "",
    thumbnailUrl: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [success, setSuccess] = useState(false);

  // Lấy dữ liệu blog theo id
  useEffect(() => {
    axiosClient
      .get(`/api/blogs/${id}`)
      .then((res) => {
        setBlog({
          title: res.data.title,
          shortDescription: res.data.shortDescription,
          content: res.data.content,
          thumbnailUrl: res.data.thumbnailUrl,
        });
      })
      .catch((err) => {
        console.error("❌ Lỗi khi lấy blog:", err);
        alert("Không tìm thấy blog!");
        navigate("/blog-manage");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBlog((prev) => ({ ...prev, thumbnailUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
  if (!blog.title || !blog.shortDescription || !blog.content) {
    alert("Vui lòng điền đầy đủ thông tin!");
    return;
  }

  try {
    let imageUrl = blog.thumbnailUrl;

    if (imageFile) {
      const uploadedUrl = await uploadToCloudinary(imageFile);
      if (!uploadedUrl) {
        alert("Tải ảnh thất bại!");
        return;
      }
      imageUrl = uploadedUrl;
    }

    const dto = {
      title: blog.title,
      shortDescription: blog.shortDescription,
      content: blog.content,
      thumbnailUrl: imageUrl, // ✅ đúng tên trường backend yêu cầu
    };

    await axiosClient.put(`/api/blogs/${id}`, dto);
    setSuccess(true);
    setTimeout(() => {
      navigate("/blog-manage");
    }, 1200);
  } catch (err) {
    console.error("❌ Lỗi khi cập nhật blog:", err);
    alert("Cập nhật blog thất bại!");
  }
};


  return (
    <div className="px-10 py-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-[#2323a7]">CHỈNH SỬA BLOG</h2>
      <div className="space-y-4 bg-gray-100 p-6 rounded shadow">
        <div>
          <label className="font-semibold">Tiêu đề</label>
          <input
            type="text"
            name="title"
            value={blog.title}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Mô tả ngắn</label>
          <input
            type="text"
            name="shortDescription"
            value={blog.shortDescription}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <div>
          <label className="font-semibold">Ảnh blog</label>
          <input type="file" onChange={handleImageChange} className="mt-1" />
          {blog.thumbnailUrl && (
            <img
              src={blog.thumbnailUrl}
              alt="Preview"
              className="mt-3 max-h-40 rounded"
            />
          )}
        </div>

        <div>
          <label className="font-semibold">Nội dung</label>
          <textarea
            name="content"
            value={blog.content}
            onChange={handleChange}
            rows="8"
            className="w-full p-2 border rounded mt-1"
          />
        </div>

        <button
          onClick={handleSave}
          className="bg-[#009fe3] hover:bg-[#007bbd] text-white px-6 py-2 rounded font-semibold"
        >
          LƯU THAY ĐỔI
        </button>

        {success && (
          <p className="text-green-600 font-semibold mt-2">
            ✔ Đã cập nhật blog thành công!
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogEdit;
