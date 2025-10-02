import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

export const requestImageEdit = async (imageUrl, prompt) => {
  try {
    const res = await api.post('/image/edit', {
      image_url: imageUrl,
      prompt: prompt,
    });

    if (res.data.edited_image_base64) {
      return `data:image/png;base64,${res.data.edited_image_base64}`;
    } else if (res.data.edited_image_url) {
      return res.data.edited_image_url;
    } else {
      throw new Error('이미지 생성 실패');
    }
  } catch (err) {
    if (err.response) {
      // 서버가 에러 응답 보낸 경우
      console.error('API 응답 에러:', err.response.status, err.response.data);
    } else if (err.request) {
      // 요청은 갔지만 응답이 없는 경우
      console.error('요청 보냈는데 응답 없음:', err.request);
    } else {
      // 요청도 못 보낸 경우
      console.error('Axios 설정 에러:', err.message);
    }
    throw err;
  }
};
