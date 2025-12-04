import axios from 'axios';

const api = axios.create({
  baseURL: '/api/gpt-image/clean',
  withCredentials: true,
});

export async function cleanImage(desertionNo, customPrompt) {
  const form = new URLSearchParams();
  form.append('desertionNo', String(desertionNo));
  form.append('customPrompt', customPrompt || '');

  const res = await api.post('', form);

  return res.data.createdImg; // 반드시 URL만 반환
}
