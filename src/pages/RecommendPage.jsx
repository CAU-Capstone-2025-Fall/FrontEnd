import { useState } from 'react';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import SurveyForm from '../components/SurveyForm';
import RecommandContainer from '../containers/RecommandContainer';
import { useAuthStore } from '../store/useAuthStore';

import '../css/cards.css';
import '../css/recommendPage.css';
import { useFavoriteStore } from '../store/useFavoriteStore';

// 🔧 AnimalCard와 동일한 로직을 쓰기 위해 헬퍼 함수들 추가
function toPercentScore(raw) {
  if (raw === null || raw === undefined || raw === '') return null;
  const n = Number(raw);
  if (Number.isNaN(n)) return null;

  // 0.0 ~ 1.0 구간을 30~100으로 매핑
  if (n <= 1.0) {
    return Math.round(n * 70 + 30);
  }
  // 1~100이면 그대로 퍼센트
  if (n <= 100) {
    return Math.round(n);
  }
  // 그 외는 클램프
  return Math.max(0, Math.min(100, Math.round(n)));
}

function getRecommendation(animal) {
  return (
    animal.recommendation || {
      final: animal.finalScore ?? animal.final ?? animal.score ?? null,
      sim: animal.sim ?? null,
      compat: animal.compat ?? null,
      priority: animal.priority ?? null,
      location: animal.location ?? null,
      reasons: animal.reasons ?? [],
    }
  );
}

// 정렬용 점수 계산
function getSortScore(animal) {
  const rec = getRecommendation(animal);

  const final = rec.final != null ? Number(rec.final) : 0;

  const simScore = rec.sim != null ? toPercentScore(rec.sim) : null;
  const compatScore = rec.compat != null ? toPercentScore(rec.compat) : null;
  const prioScore = rec.priority != null ? toPercentScore(rec.priority / 3.0) : null; // priority는 0~3 기준이라 /3
  const locScore = rec.location != null ? toPercentScore(rec.location) : null;

  const subs = [simScore, compatScore, prioScore, locScore].filter((v) => typeof v === 'number');

  const avgSub = subs.length > 0 ? subs.reduce((sum, v) => sum + v, 0) / subs.length : 0;

  return { final, avgSub };
}

export default function RecommendPage() {
  const { user, loading } = useAuthStore();
  const [latestSurvey, setLatestSurvey] = useState(null);
  const [surveyVersion, setSurveyVersion] = useState(0);
  const [latestRecommendations, setLatestRecommendations] = useState(null);
  const [showSurvey, setShowSurvey] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();

  // ✅ 여기서 정렬 + rank 부여
  const rankedAnimals =
    Array.isArray(latestRecommendations) && latestRecommendations.length > 0
      ? [...latestRecommendations]
          .sort((a, b) => {
            const sa = getSortScore(a);
            const sb = getSortScore(b);

            const fa = sa.final;
            const fb = sb.final;

            // 1) final이 둘 다 0이 아니고, 서로 다르면 → final 기준 내림차순
            if (fa !== fb && fa !== 0 && fb !== 0) {
              return fb - fa;
            }

            // 2) final이 0이거나 같다면 → 서브 점수 평균으로 비교
            if (sa.avgSub !== sb.avgSub) {
              return sb.avgSub - sa.avgSub;
            }

            // 3) 완전 같은 경우: desertionNo로 안정적인 정렬
            const idA = a.desertionNo ?? a._id ?? '';
            const idB = b.desertionNo ?? b._id ?? '';
            if (idA < idB) return -1;
            if (idA > idB) return 1;
            return 0;
          })
          .map((a, idx) => ({
            ...a,
            _rank: idx + 1, // 1위, 2위, 3위...
          }))
      : [];

  if (loading) return <p>로딩 중...</p>;

  if (!user) {
    return (
      <div className="recommend-page" style={{ padding: '60px 20px' }}>
        <h3 className="page-title">🐾 반려동물 추천 페이지</h3>
        <p style={{ textAlign: 'center', marginTop: 16 }}>로그인하고 이용 가능한 페이지입니다.</p>
      </div>
    );
  }

  return (
    <div className="recommend-page" style={{ padding: '60px 20px' }}>
      <div className="page-grid">
        <main className="main-col">
          {showSurvey ? (
            <SurveyForm
              user={user.username}
              onSave={(answers, recAnimals) => {
                setLatestSurvey(answers);
                if (Array.isArray(recAnimals)) {
                  setLatestRecommendations(recAnimals);
                }
                setSurveyVersion((v) => v + 1);
                setShowSurvey(false);
              }}
            />
          ) : (
            <section className="recommend-only">
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 12,
                }}
              >
                <h3 style={{ margin: 0 }}>추천 동물</h3>
                <div>
                  <button
                    type="button"
                    onClick={() => setShowSurvey(true)}
                    className="edit-survey-button"
                  >
                    설문 수정
                  </button>
                </div>
              </div>

              {Array.isArray(latestRecommendations) && latestRecommendations.length > 0 ? (
                <div className="result-grid">
                  {rankedAnimals.map((a) => (
                    <AnimalCard
                      key={a.desertionNo}
                      animal={a}
                      isFav={favorites.includes(a.desertionNo)}
                      onOpen={setSelectedAnimal}
                      onToggleFav={() => toggle(a)}
                      rank={a._rank} // ✅ 순위 전달 (1위/2위/3위)
                    />
                  ))}
                </div>
              ) : (
                <div style={{ padding: 12 }}>
                  <p style={{ color: '#666' }}>
                    아직 즉시 사용할 추천 결과가 없습니다. 오른쪽의 추천 컨테이너에서 최신 결과를
                    불러오거나, 설문을 제출하면 자동으로 추천이 실행됩니다.
                  </p>
                </div>
              )}
              <AnimalDetail animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
            </section>
          )}
        </main>

        <aside className="aside-col">
          <div className="side-card">
            <RecommandContainer key={`recommand-${surveyVersion}`} user={user.username} />
          </div>
        </aside>
      </div>
    </div>
  );
}
