// api/encode.js
import axios from 'axios';

// 🔥 baseURL 통일 (백엔드 FastAPI 기준)
const api = axios.create({
  baseURL: '/api/encode',
  withCredentials: true,
});

// A 벡터 + user 로 latent vector 생성
export async function encodeA(A, user) {
  const { data } = await api.post(`/${encodeURIComponent(user)}`, A);
  return data;
}
