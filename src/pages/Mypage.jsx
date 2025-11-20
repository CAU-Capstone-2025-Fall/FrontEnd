import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReview, listReviews } from '../api/reviews';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import ReviewCard from '../components/ReviewCard';
import ReviewDetail from '../components/ReviewDetail';
import SurveyAnswers from '../components/SurveyAnswer';
import '../css/Mypage.css';

import { useFavoriteStore } from '../store/useFavoriteStore';

// ------------------------
// API 클라이언트
// ------------------------
const api = axios.create({
  baseURL: '/api/userinfo/survey',
  withCredentials: true,
});

// ------------------------
// A_processed builder
// ------------------------
const buildA = (d) => {
  return {
    연령: Number(d.age) || 0,
    '가족 구성원 수': Number(d.familyCount) || 0,

    주택규모:
      {
        '10평 미만': 5,
        '10평 ~ 20평': 15,
        '20평 ~ 30평': 25,
        '30평 ~ 40평': 35,
        '40평 ~ 50평': 45,
        '50평 이상': 60,
      }[d.houseSize] || 0,

    '월평균 가구소득':
      {
        '100만원 미만': 50,
        '100만원 ~ 199만원': 150,
        '200만원 ~ 299만원': 250,
        '300만원 ~ 399만원': 350,
        '400만원 ~ 499만원': 450,
        '500만원 ~ 599만원': 550,
        '600만원 ~ 699만원': 650,
        '700만원 이상': 750,
      }[d.budget] || 0,

    성별_1: d.sex === '남성' ? 1 : 0,
    성별_2: d.sex === '여성' ? 1 : 0,

    주택형태_1: d.residenceType === '아파트' ? 1 : 0,
    주택형태_2: d.residenceType === '단독/다가구 주택' ? 1 : 0,
    주택형태_3: d.residenceType === '연립/빌라/다세대 주택' ? 1 : 0,
    주택형태_4: d.residenceType === '기타' ? 1 : 0,

    '향후 반려동물 사육의향': 0,

    // 직업 5개 카테고리
    화이트칼라: ['경영/관리직', '전문직', '사무직'].includes(d.job) ? 1 : 0,
    블루칼라: ['전문기술직', '단순노무/생산/단순기술직'].includes(d.job) ? 1 : 0,
    자영업: d.job === '자영업' ? 1 : 0,
    비경제활동층: ['학생', '주부'].includes(d.job) ? 1 : 0,
    기타: d.job === '기타' ? 1 : 0,
  };
};

// ------------------------
// MyPage Component
// ------------------------
export default function MyPage({ user }) {
  const [survey, setSurvey] = useState(null);
  const [selected, setSelected] = useState(null);
  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();
  const [myReviews, setMyReviews] = useState([]);
  const [mode, setMode] = useState('list');
  const [reviewSelected, setReviewSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  // ------------------------
  // user 없으면 바로 로그인 필요 화면만
  // ------------------------
  if (!user) {
    return (
      <div className="mypage-section">
        <h2>마이페이지</h2>
        <p>로그인이 필요한 서비스입니다.</p>
      </div>
    );
  }

  // ------------------------
  // Survey & 리뷰 로드
  // ------------------------
  useEffect(() => {
    async function loadSurvey() {
      try {
        const res = await api.get(`/${user}`);
        if (res.data.success) setSurvey(res.data.data);
      } catch (e) {
        console.error('[Survey Load Error]', e);
      }
    }

    async function loadReviews() {
      try {
        const { items } = await listReviews();
        const mine = items.filter((it) => it.authorId === user);
        setMyReviews(mine);
      } catch (e) {
        console.error('[Review Load Error]', e);
      }
    }

    loadSurvey();
    loadReviews();
  }, [user]);

  const favAnimals = useMemo(
    () => favorites.map((id) => favMap[id]).filter(Boolean),
    [favorites, favMap]
  );

  async function openDetail(id) {
    const doc = await getReview(id);
    setReviewSelected(doc);
    setMode('detail');
  }

  return (
    <div className="mypage-section">
      <h2>마이페이지</h2>

      {/* ------------------------------------------------------------------ */}
      {/* 1) 설문 정보 */}
      {/* ------------------------------------------------------------------ */}
      <section>
        <h3>내 정보</h3>
        {survey ? <SurveyAnswers answers={survey} /> : <p>설문 답변이 없습니다.</p>}

        {survey && (
          <button style={{ marginTop: '15px' }} onClick={() => navigate('/report')}>
            보고서 보러가기
          </button>
        )}
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 2) 찜한 동물 */}
      {/* ------------------------------------------------------------------ */}
      <section style={{ marginTop: '40px' }}>
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
            {favAnimals.length === 0 && <div className="empty">찜한 동물이 없습니다</div>}
          </div>
        </div>
        <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 3) 내가 쓴 후기 */}
      {/* ------------------------------------------------------------------ */}
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
              busy={busy}
            />
          )}
        </div>
      </section>
    </div>
  );
}
