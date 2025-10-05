import { useEffect, useMemo, useState } from 'react';
import { listReviews, getReview, createReview, updateReview, deleteReview } from '../api/reviews';
import ReviewCard from '../components/ReviewCard';
import ReviewForm from '../components/ReviewForm';
import ReviewDetail from '../components/ReviewDetail';
import Pagination from '../components/Pagination';
import { checkAuth } from '../api/auth';
import '../css/Review.css';

const LIMIT = 9;

export default function ReviewPage() {
  const [mode, setMode] = useState('list'); // list | new | detail | edit
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / LIMIT)), [total]);

  async function refresh() {
    const skip = (page - 1) * LIMIT;
    const { items: arr, total: t } = await listReviews({ skip, limit: LIMIT });
    setItems(arr);
    setTotal(t);
  }

  useEffect(() => {
    refresh().catch(console.error);
  }, [page]);

  // 상세로 이동
  async function openDetail(id) {
    const doc = await getReview(id);
    setSelected(doc);
    setMode('detail');
  }

  // 생성
  async function handleCreate(payload) {
    try {
      setBusy(true);
      const doc = await createReview(payload);
      setSelected(doc);
      setMode('detail');
      // 첫 페이지 최신글 보이도록
      setPage(1);
      await refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  // 수정
  async function handleUpdate(payload) {
    try {
      setBusy(true);
      const doc = await updateReview(selected._id, payload);
      setSelected(doc);
      setMode('detail');
      await refresh();
    } catch (e) {
      if (String(e.message).startsWith('403')) alert('작성자만 수정할 수 있어요.');
      else alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  // 삭제
  async function handleDelete() {
    if (!window.confirm('정말 삭제할까요?')) return;
    try {
      setBusy(true);
      await deleteReview(selected._id);
      setMode('list');
      setSelected(null);
      await refresh();
    } catch (e) {
      if (String(e.message).startsWith('403')) alert('작성자만 삭제할 수 있어요.');
      else alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="reviews-page">
      <main style={{ paddingTop: '40px' }} />
      {mode === 'list' && (
        <>
          <div className="toolbar">
            <h2>이용자 후기</h2>
            <button
              className="primary"
              onClick={async () => {
                try {
                  await checkAuth();
                  setMode('new');
                } catch (err) {
                  // 401 등 에러 발생 시
                  alert('로그인이 필요한 서비스입니다.');
                }
              }}
            >
              후기 작성
            </button>
          </div>

          {items.length === 0 ? (
            <div className="empty">아직 후기가 없어요.</div>
          ) : (
            <div className="grid">
              {items.map((it) => (
                <ReviewCard key={it._id} item={it} onClick={() => openDetail(it._id)} />
              ))}
            </div>
          )}

          <Pagination page={page} setPage={setPage} totalPages={totalPages} hasMore={false} />
        </>
      )}

      {mode === 'new' && (
        <div>
          <button className="ghost" onClick={() => setMode('list')}>
            ← 목록
          </button>
          <h2>후기 작성</h2>
          <ReviewForm onSubmit={handleCreate} onCancel={() => setMode('list')} busy={busy} />
        </div>
      )}

      {mode === 'detail' && selected && (
        <ReviewDetail
          item={selected}
          onBack={() => {
            setMode('list');
            setSelected(null);
          }}
          onEdit={() => setMode('edit')}
          onDelete={handleDelete}
          busy={busy}
        />
      )}

      {mode === 'edit' && selected && (
        <div>
          <button className="ghost" onClick={() => setMode('detail')}>
            ← 뒤로
          </button>
          <h2>후기 수정</h2>
          <ReviewForm
            initial={selected}
            onSubmit={handleUpdate}
            onCancel={() => setMode('detail')}
            busy={busy}
          />
        </div>
      )}
    </div>
  );
}
