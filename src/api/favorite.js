import axios from 'axios';

const api = axios.create({
  baseURL: '/api/favorite',
  withCredentials: true,
});

export async function getFavorites() {
  const { data } = await api.get('');
  return data?.ids || [];
}
export async function addFavorite(id) {
  const { data } = await api.post(`/${encodeURIComponent(id)}`);
  return data?.ids || [];
}
export async function removeFavorite(id) {
  const { data } = await api.delete(`/${encodeURIComponent(id)}`);
  return data?.ids || [];
}
