const BASE = '/api';

export async function getAnimals(params = {}) {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') search.append(k, v);
  });
  const url = `${BASE}/animal${search.toString() ? `?${search}` : ''}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`GET /animal 실패 (status ${res.status})`);
  return res.json();
}
