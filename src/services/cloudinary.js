// src/services/cloudinary.js
import axios from 'axios';

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/djdjirswg/raw/upload';
const CLOUDINARY_UPLOAD_PRESET = 'unsigned_preset';

// 📤 Hàm upload file lên Cloudinary (dạng raw - dùng cho PDF, video)
export const uploadFileToCloudinary = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const res = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
  return res.data.secure_url;
};
