import { useState } from 'react';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import SurveyForm from '../components/SurveyForm';
import RecommandContainer from '../containers/RecommandContainer';
import { useAuthStore } from '../store/useAuthStore';

import '../css/cards.css';
import '../css/recommendPage.css';
import { useFavoriteStore } from '../store/useFavoriteStore';

export default function RecommendPage() {
  const { user, loading } = useAuthStore();
  const [latestSurvey, setLatestSurvey] = useState(null);
  const [surveyVersion, setSurveyVersion] = useState(0);
  const [latestRecommendations, setLatestRecommendations] = useState(null);
  const [showSurvey, setShowSurvey] = useState(true);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();

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
      <h1 className="page-title">🐾 반려동물 추천 페이지</h1>
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
                  {latestRecommendations.map((a) => (
                    <AnimalCard
                      key={a.desertionNo}
                      animal={a}
                      isFav={favorites.includes(a.desertionNo)}
                      onOpen={setSelectedAnimal}
                      onToggleFav={() => toggle(a)}
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
        {/* <Recommend user={user.username} /> */}
      </div>
    </div>
  );
}
