import React, { useState } from 'react';
import axios from 'axios';
import AnimalDetail from '../components/AnimalDetail';
import AnimalCard from '../components/AnimalCard';
const api = axios.create({
  baseURL: '/api/recommand',
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
  const [result, setResult] = useState(null);
  const [recAnimals, setRecAnimals] = useState([]);  // 추천 결과 리스트
  const [selected, setSelected] = useState(null);

  if (!user) return <p className="survey-alert">로그인 후 설문 이용이 가능합니다.</p>;

  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const payload = {
      natural_query: (userQuery || '').trim(), 
      limit: 3, 
    };
    try{
      const { res } = await api.post('', payload);
      res.data.success ? setSubmitted(true) : setError(res.data.msg || '추천 실패');
      const list = Array.isArray(res.data)
        ? res.data
        : (res.data && Array.isArray(res.data.data) ? res.data.data : []);

      if (!Array.isArray(list)) {
        setRecAnimals([]);
        setError('서버 응답 형식이 올바르지 않습니다. (배열 아님)');
        return;
      }

      setRecAnimals(res.data);
      setResult(res.data);
    } catch (err){
    setError('서버 오류: ' + (err?.response?.msg || err.message));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <p className="survey-success">설문이 성공적으로 제출되었습니다!</p>;
  }

  return (
    <form className="survey-section" onSubmit={handleSubmit}>
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
        <section style={{ marginTop: '40px' }}>
          <h3>추천 동물</h3>
          {recAnimals.length > 0 ? (
          <div className="result-shell">
            <div className="result-content grid">
              {recAnimals.map((a) => (
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
              <p>추천된 동물이 없습니다. 다른 키워드로 시도해보세요.</p>
            </div>
          </div>
          )}
          <AnimalDetail animal={selected} onClose={() => setSelected(null)} />
        </section>
        {error && <p className="survey-error">{error}</p>}
    </form>
  );
}