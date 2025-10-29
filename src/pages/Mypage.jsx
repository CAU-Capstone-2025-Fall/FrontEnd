import React, { useEffect, useState, useMemo } from 'react';
import SurveyAnswers from '../components/SurveyAnswer';
import AnimalCard from '../components/AnimalCard';
import AnimalDetail from '../components/AnimalDetail';
import { useFavoriteStore } from '../store/useFavoriteStore';
import axios from 'axios';
const api = axios.create({
  baseURL: 'api/userinfo/survey',
  withCredentials: true,
});

export default function MyPage({ user }) {
  const [survey, setSurvey] = useState(null);
  const [selected, setSelected] = useState(null);
  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();


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

  return (
    <div className="mypage-section">
      <h2>마이페이지</h2>
      <section>
        <h3>나의 설문 답변</h3>
        {survey ? <SurveyAnswers answers={survey} /> : <p>설문 답변이 없습니다.</p>}
      </section>
      <section>
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
    </div>
  );
}