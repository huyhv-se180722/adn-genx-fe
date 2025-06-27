import React, { useEffect, useState } from 'react';
import axiosClient from '../config/AxiosClient';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerProfile = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        gender: '',
        dob: '',
        avatar: '',
        address: '',
        email: '', // 👈 thêm email
    });

    const [avatarPreview, setAvatarPreview] = useState('/default-avatar.png');
    const [newAvatar, setNewAvatar] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axiosClient.get('/api/v1/account/profile');
            const profile = res.data;

            setFormData({
                fullName: profile.fullName || '',
                phoneNumber: profile.phoneNumber || '',
                gender: profile.gender || '',
                dob: profile.dob ? profile.dob.split('T')[0] : '',
                avatar: profile.avatar || '',
                address: profile.address || '',
                email: profile.email || '', // 👈 gán email từ BE
            });

            setAvatarPreview(profile.avatar || '/default-avatar.png');
        } catch (err) {
            alert('Không thể tải profile');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setNewAvatar(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const uploadAvatar = async () => {
        if (!newAvatar) return;

        const data = new FormData();
        data.append('file', newAvatar);

        try {
            setIsUploading(true);
            const res = await axiosClient.post('/api/v1/account/avatar', data, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            const uploadedUrl = res.data.avatarUrl;
            setFormData((prev) => ({ ...prev, avatar: uploadedUrl }));
            alert('Cập nhật ảnh đại diện thành công');
        } catch (err) {
            alert('Lỗi tải ảnh');
        } finally {
            setIsUploading(false);
        }
    };

    const updateProfile = async () => {
        try {
            await axiosClient.put('/api/v1/account/profile', formData);
            alert('Cập nhật thành công');
            fetchProfile();
        } catch (err) {
            alert('Cập nhật thất bại');
        }
    };

    return (
        <div className="container my-5">
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="text-center mb-4">Thông tin cá nhân</h3>

                    <div className="text-center mb-4">
                        <img
                            src={avatarPreview}
                            alt="avatar"
                            className="rounded-circle"
                            width="120"
                            height="120"
                        />
                        <div className="mt-2">
                            <input
                                type="file"
                                className="form-control w-50 mx-auto"
                                onChange={handleAvatarChange}
                            />
                            <button
                                className="btn btn-primary btn-sm mt-2"
                                onClick={uploadAvatar}
                                disabled={isUploading}
                            >
                                {isUploading ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                            role="status"
                                            aria-hidden="true"
                                        ></span>
                                        Đang cập nhật...
                                    </>
                                ) : (
                                    'Cập nhật ảnh đại diện'
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">Email</label>
                        <div className="col-sm-9">
                            <input
                                name="email"
                                value={formData.email}
                                readOnly
                                className="form-control bg-light"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">Họ tên</label>
                        <div className="col-sm-9">
                            <input
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">Số điện thoại</label>
                        <div className="col-sm-9">
                            <input
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">Giới tính</label>
                        <div className="col-sm-9">
                            <select
                                name="gender"
                                className="form-select"
                                value={formData.gender}
                                onChange={handleInputChange}
                            >
                                <option value="">-- Chọn --</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                            </select>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <label className="col-sm-3 col-form-label">Ngày sinh</label>
                        <div className="col-sm-9">
                            <input
                                type="date"
                                name="dob"
                                value={formData.dob}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="row mb-4">
                        <label className="col-sm-3 col-form-label">Địa chỉ</label>
                        <div className="col-sm-9">
                            <input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="form-control"
                            />
                        </div>
                    </div>

                    <div className="text-end">
                        <button className="btn btn-success" onClick={updateProfile}>
                            Cập nhật thông tin
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CustomerProfile;