import React, { useEffect, useState, useMemo } from 'react';
import SurveyAnswers from '../components/SurveyAnswer';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import { useFavoriteStore } from '../store/useFavoriteStore';
import ReviewCard from '../components/ReviewCard';
import ReviewDetail from '../components/ReviewDetail';
import { listReviews, getReview } from '../api/reviews';
import '../css/Mypage.css';
import axios from 'axios';
const api = axios.create({
  baseURL: 'api/userinfo/survey',
  withCredentials: true,
});

export default function MyPage({ user }) {
  const [survey, setSurvey] = useState(null);
  const [selected, setSelected] = useState(null);
  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();
  const [myReviews, setMyReviews] = useState([]);
  const [mode, setMode] = useState('list'); // 'list' | 'detail'
  const [reviewSelected, setReviewSelected] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (user) {
      api.get(`/${user}`)
        .then(res => {
          if (res.data.success) setSurvey(res.data.data);
        });
    }
  }, [user]);

  const favAnimals = useMemo(
    () => favorites.map((id) => favMap[id]).filter(Boolean),
    [favorites, favMap]
  );

  useEffect(() => {
    async function fetchMyReviews() {
      let itemList = [];
      if (user) {
        const { items } = await listReviews();
        for (const item of items) {
          if (item.authorId === user) {
            itemList.push(item);
          }
        }
        setMyReviews(itemList || []);
      }
    }
    fetchMyReviews();
  }, [user]);

  async function openDetail(id) {
    const doc = await getReview(id);
    setReviewSelected(doc);
    setMode('detail');
  }

  async function handleDelete() {
    const current = await ensureAuthed(); // 최신 상태로 가드
    if (!current) return alert('로그인이 필요한 서비스입니다.');
    if (current !== selected.authorId) return alert('작성자만 삭제할 수 있습니다.');

    if (!window.confirm('정말 삭제하시겠어요?')) return;
    try {
      setBusy(true);
      await deleteReview(selected._id);
      setMode('list');
      setSelected(null);
      await refresh();
    } catch (e) {
      alert(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mypage-section">
      <h2>마이페이지</h2>
      <section>
        <h3>내 정보</h3>
        {survey ? <SurveyAnswers answers={survey} /> : <p>설문 답변이 없습니다.</p>}
      </section>
      <section style={{marginTop: '40px'}}>
        <h3>내가 찜한 동물</h3>
            <div className="result-shell">
                <div className="result-content grid">
                {favAnimals.map((a) => (
                    <AnimalCard
                    key={a.desertionNo}
                    animal={a}
                    isFav={favorites.includes(a.desertionNo)}
                    onOpen={setSelected}
                    onToggleFav={() => toggle(a)}
                    />
                ))}

                {favAnimals.length === 0 && (
                    <div className="empty">찜한 동물이 없습니다</div>
                )}
                </div>
            </div>
        <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
      </section>
      <section>
        <div className="reviews-page">
          {mode === 'list' && (
            <>
              <h2>내가 쓴 후기</h2>
              {myReviews.length === 0 ? (
              <div className="empty">아직 내가 쓴 후기가 없습니다.</div>
              ) : (
              <div className="grid">
                {myReviews.map((it) => (
                  <ReviewCard key={it._id} item={it} onClick={() => openDetail(it._id)} />
                ))}
              </div>
              )}
            </>
          )}

          {mode === 'detail' && reviewSelected && (
            <ReviewDetail
              item={reviewSelected}
              onBack={() => {
                setMode('list');
                setReviewSelected(null);
              }}
              onEdit={async () => {
                const current = await ensureAuthed();
                if (!current) return alert('로그인이 필요한 서비스입니다.');
                if (current !== reviewSelected.authorId) return alert('작성자만 수정할 수 있습니다.');
                setMode('edit');
              }}
              onDelete={handleDelete}
              busy={busy}
            />
          )}
        </div>

      </section>
    </div>
  );
}