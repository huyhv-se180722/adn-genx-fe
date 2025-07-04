import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../config/AxiosClient";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { uploadToCloudinary } from "../config/cloudinaryUpload";

const NewBlog = () => {
  const [blog, setBlog] = useState({ title: "", content: "", thumbnailUrl: "" });
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const url = await uploadToCloudinary(file);
    setUploading(false);
    if (url) {
      setBlog((prev) => ({ ...prev, thumbnailUrl: url }));
    } else {
      alert("Lỗi khi upload ảnh!");
    }
  };

  const handleSubmit = async () => {
    if (!blog.title.trim() || !blog.content.trim()) return;

    try {
      await axiosClient.post(
        "/api/blogs",
        {
          title: blog.title,
          content: blog.content,
          thumbnailUrl: blog.thumbnailUrl,
        },
        {
          params: {
            userId: 1, // ✅ Thay bằng userId thực tế khi đăng nhập
          },
        }
      );
      setSuccess(true);
      setTimeout(() => navigate("/blog-manage"), 1200);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi đăng blog!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] flex flex-col items-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow p-8">
        <h2 className="text-3xl font-bold text-[#0070c0] mb-8 text-center">
          Viết Blog Mới
        </h2>

        <div className="mb-6 flex flex-col items-center">
          {blog.thumbnailUrl && (
            <img
              src={blog.thumbnailUrl}
              alt="Ảnh Blog"
              className="w-40 h-28 object-cover rounded-lg mb-2 border"
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="block"
          />
          {uploading && <p className="text-sm text-gray-500 mt-1">Đang tải ảnh lên...</p>}
        </div>

        <input
          type="text"
          name="title"
          value={blog.title}
          onChange={handleChange}
          placeholder="Tiêu đề bài viết"
          className="w-full text-2xl font-bold px-4 py-3 border-b border-gray-200 outline-none mb-6 focus:border-[#0070c0] transition"
        />

        <div className="mb-6">
          <MDEditor
            value={blog.content}
            onChange={(val) => setBlog({ ...blog, content: val || "" })}
          />
        </div>

        <div className="flex justify-end">
          <button
            className="bg-[#0070c0] hover:bg-[#005fa3] text-white px-8 py-2 rounded-full font-semibold text-lg shadow transition"
            onClick={handleSubmit}
          >
            Đăng bài
          </button>
        </div>

        {success && (
          <div className="mt-4 text-green-600 font-semibold text-center">
            Đăng bài viết thành công!
          </div>
        )}
      </div>
    </div>
  );
};

export default NewBlog;