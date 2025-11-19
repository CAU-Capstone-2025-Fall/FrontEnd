// src/api/gpt_image.js

import axios from 'axios';

export const cleanImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const res = await axios.post('/gpt-image/clean', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (res.data.image_base64) {
    return `data:image/png;base64,${res.data.image_base64}`;
  }
  if (res.data.image_url) {
    return res.data.image_url;
  }

  throw new Error('이미지 생성 실패');
};
