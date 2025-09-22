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

export async function getAnimalById(desertionNo) {
  const res = await fetch(`${BASE}/animal/${desertionNo}`);
  if (!res.ok) throw new Error(`Animal 없음 (status ${res.status})`);
  return res.json();
}

export async function getAnimalCount(params = {}) {
  try {
    const qs = new URLSearchParams(params).toString();
    const res = await fetch(`${API_BASE}/animal/count?${qs}`);
    if (!res.ok) return null;
    const data = await res.json();
    // {count: number} 형태라고 가정
    return typeof data?.count === 'number' ? data.count : null;
  } catch {
    return null;
  }
}
