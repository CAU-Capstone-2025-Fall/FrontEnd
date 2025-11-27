import axios from 'axios';

const api = axios.create({
  baseURL: '/api/gpt-image/clean',
  withCredentials: true,
});

export async function cleanImage(desertionNo) {
  const form = new URLSearchParams();
  form.append('desertionNo', String(desertionNo));

  const res = await api.post('', form);

  return res.data;
}
