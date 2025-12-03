import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import AnimalDetail from '../components/AnimalDetail';
import AnimalCard from '../components/AnimalCard';
import { useFavoriteStore } from '../store/useFavoriteStore';
import { getAnimalById } from '../api/animals';
import '../css/cards.css';
const api = axios.create({
  baseURL: '/api/recommand/hybrid',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default function Recommend({ user }) {
  const [userQuery, setUserQuery] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [selected, setSelected] = useState(null);
  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();

  useEffect(() => {
    setSubmitted(false);
    setError(null);
    setResult(null);
  }, [user]);

  const favAnimals = useMemo(
    () => favorites.map((id) => favMap[id]).filter(Boolean),
    [favorites, favMap]
  );

  if (!user) return <p className="survey-alert">로그인 후 설문 이용이 가능합니다.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      natural_query: (userQuery || '').trim(), 
      limit: 6, 
      user_id: user,
      use_survey: true
    };
    try{
      const res = await api.post('', payload);
      const list = Array.isArray(res.data)
        ? res.data
        : (res.data && Array.isArray(res.data.data) ? res.data.data : []);
      if (!Array.isArray(list)) {
        setError('서버 응답 형식이 올바르지 않습니다.');
        return;
      }
      const details = await Promise.all(
        list.map(({ desertionNo }) =>
          getAnimalById(desertionNo).catch(() => null)
        )
      );
      const merged = details.filter(Boolean);
      setAnimals(merged);
    } catch (err){
    setError('서버 오류: ' + (err?.response?.msg || err.message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="recommend" style={{ display: 'contents' }}>
      <form className="survey-section" onSubmit={handleSubmit} style={{ minWidth: '500px' }}>
        <h3>키워드 기반 반려동물 추천</h3>
        <label>원하는 반려동물의 특징을 입력하세요:</label>
        <input
          type="text"
          name="userQuery"
          value={userQuery || ''}
          onChange={(e) => setUserQuery(e.target.value)}
          disabled={loading}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? '추천 중...' : '추천 받기'}
        </button>
      </form>
      <form className="browse-section">
        <section style={{ marginTop: '40px' }}>
          { animals.length > 0 ? (
          <div className="result-shell">
            <div className="result-content grid" style={{ display: 'grid', 
               gap: '20px', background: 'var(--bg-page, #def2ff)', 
               borderRadius: 'var(--radius, 20px)',
               
               }}>
              {animals.map((a) => (
                <AnimalCard
                  key={a.desertionNo}
                  animal={a}
                  isFav={favorites.includes(a.desertionNo)}
                  onOpen={setSelected}
                  onToggleFav={() => toggle(a)}
                />
              ))}
            </div>
          </div>
          ) : (
          <div className="result-shell">
            <div className="result">
            </div>
          </div>
          )}
          <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
        </section>
        {error && <p className="survey-error">{error}</p>}
      </form>
    </div>
  );
}