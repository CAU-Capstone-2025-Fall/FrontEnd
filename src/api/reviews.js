const BASE = '/api/reviews';

async function json(res) {
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`${res.status} ${res.statusText} ${txt || ''}`.trim());
  }
  return res.json();
}

// 목록 (페이지네이션: skip, limit)
export async function listReviews({ skip = 0, limit = 9 } = {}) {
  const res = await fetch(`${BASE}?skip=${skip}&limit=${limit}`, { credentials: 'include' });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} ${await res.text()}`);
  return res.json();
}

// 단건 조회
export async function getReview(id) {
  const res = await fetch(`${BASE}/${id}`, { credentials: 'include' });
  return json(res);
}

// 생성 (multipart)
export async function createReview({ title, body, files }) {
  const fd = new FormData();
  fd.append('title', title);
  fd.append('body', body);
  (files || []).forEach((f) => fd.append('files', f));
  const res = await fetch(BASE, {
    method: 'POST',
    body: fd,
    credentials: 'include',
  });
  return json(res);
}

// 수정 (부분수정 + 파일 교체)
export async function updateReview(id, { title, body, files }) {
  const fd = new FormData();
  if (title !== undefined) fd.append('title', title);
  if (body !== undefined) fd.append('body', body);
  if (files && files.length) files.forEach((f) => fd.append('files', f));
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PATCH',
    body: fd,
    credentials: 'include',
  });
  return json(res);
}

// 삭제
export async function deleteReview(id) {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  return json(res); // {ok:true}
}
