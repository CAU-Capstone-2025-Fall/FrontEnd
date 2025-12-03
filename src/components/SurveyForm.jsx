import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { encodeA } from '../api/encode.js';
import { getSurvey, saveSurvey } from '../api/survey';
import axios from 'axios';
import { getAnimalById } from '../api/animals';
import AnimalCard from './AnimalCard';
import AnimalDetail from './AnimalDetail';
import { useFavoriteStore } from '../store/useFavoriteStore';
import '../css/recommendPage.css';

const initialA = {
  age: '0',
  familyCount: '0',
  houseSize: '0',
  budget: '0',

  sex1: '0',
  sex2: '0',

  residenceType1: '0',
  residenceType2: '0',
  residenceType3: '0',
  residenceType4: '0',

  wantingPet: '0',

  job1: '0',
  job2: '0',
  job7: '0',
  job8: '0',
  job10: '0',
};

const HOUSE_SIZE_MAP = {
  '10평 미만': '5',
  '10평 ~ 20평': '15',
  '20평 ~ 30평': '25',
  '30평 ~ 40평': '35',
  '40평 ~ 50평': '45',
  '50평 이상': '60',
};

const BUDGET_MAP = {
  '100만원 미만': '50',
  '100만원 ~ 199만원': '150',
  '200만원 ~ 299만원': '250',
  '300만원 ~ 399만원': '350',
  '400만원 ~ 499만원': '450',
  '500만원 ~ 599만원': '550',
  '600만원 ~ 699만원': '650',
  '700만원 이상': '750',
};

const RESIDENCE_MAP = {
  아파트: 'residenceType1',
  '단독/다가구 주택': 'residenceType2',
  '연립/빌라/다세대 주택': 'residenceType3',
  기타: 'residenceType4',
};

const JOB_GROUP = {
  '경영/관리직': 'job1',
  전문직: 'job1',
  사무직: 'job1',

  전문기술직: 'job2',
  '판매/서비스직': 'job2',
  '단순노무/생산/단순기술직': 'job2',

  자영업: 'job7',

  주부: 'job8',
  학생: 'job8',

  기타: 'job10',
};

const WANTING_PET_MAP = {
  '전혀 의향이 없다': '0.2',
  '별로 의향이 없다': '0.4',
  보통이다: '0.6',
  '다소 의향이 있다': '0.8',
  '매우 의향이 있다': '1.0',
};

function buildA(d) {
  const A = { ...initialA };

  A.age = d.age || '0';
  A.familyCount = d.familyCount || '0';
  A.houseSize = HOUSE_SIZE_MAP[d.houseSize] || '0';
  A.budget = BUDGET_MAP[d.budget] || '0';

  if (d.sex === '남성') A.sex1 = '1';
  if (d.sex === '여성') A.sex2 = '1';

  if (RESIDENCE_MAP[d.residenceType]) {
    A[RESIDENCE_MAP[d.residenceType]] = '1';
  }

  if (JOB_GROUP[d.job]) {
    A[JOB_GROUP[d.job]] = '1';
  }

  A.wantingPet = '0';

  return A;
}

const initialAnswers = {
  address: '',
  age: '',
  sex: '',
  job: '',
  residenceType: '',
  hasPetSpace: '',
  familyCount: '',
  hasChildOrElder: '',
  dailyHomeTime: '',
  hasAllergy: '',
  allergyAnimal: '',
  activityLevel: '',
  expectations: [],
  favoriteAnimals: [],
  preferredSize: '',
  preferredPersonality: [],
  careTime: '',
  budget: '',
  specialEnvironment: '',
  petHistory: '',
  currentPets: [],
  houseSize: '',
  wantingPet: '',
  additionalNote: '',
  userQuery: '',
};

const REQUIRED_FIELDS = [
  { key: 'address', label: '1. 거주 지역' },
  { key: 'age', label: '2. 연령' },
  { key: 'sex', label: '3. 성별' },
  { key: 'job', label: '4. 직업' },
  { key: 'residenceType', label: '5. 주거 형태' },
  { key: 'houseSize', label: '6. 주택 규모' },
  { key: 'hasPetSpace', label: '7. 반려동물을 위한 별도 공간' },
  { key: 'familyCount', label: '8. 가족 구성원 수' },
  { key: 'hasChildOrElder', label: '9. 어린이나 노인 동거 여부' },
  { key: 'dailyHomeTime', label: '10. 하루 중 집에 머무는 시간' },
  { key: 'hasAllergy', label: '11. 동물 알레르기 여부' },
  { key: 'activityLevel', label: '12. 평소 활동 수준' },
  { key: 'expectations', label: '13. 반려동물에게 바라는 점', isArray: true },
  { key: 'favoriteAnimals', label: '14. 선호하는 동물 종류', isArray: true },
  { key: 'preferredSize', label: '15. 선호하는 반려동물의 크기' },
  { key: 'preferredPersonality', label: '16. 선호하는 반려동물의 성격', isArray: true },
  { key: 'careTime', label: '17. 하루 케어 가능 시간' },
  { key: 'budget', label: '18. 월 평균 가구소득' },
  { key: 'specialEnvironment', label: '19. 집의 특별한 환경' },
  { key: 'petHistory', label: '20. 반려동물 사육경험' },
  { key: 'currentPets', label: '21. 현재 양육중인 반려동물', isArray: true },
  { key: 'wantingPet', label: '22. 반려동물 사육의향' },
];

export default function SurveyForm({ user, onSave }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState(initialAnswers);

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const [recommendedAnimals, setRecommendedAnimals] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const { ids: favorites, map: favMap, toggle } = useFavoriteStore();

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      try {
        const existing = await getSurvey(user);
        if (!mounted) return;
        if (existing && existing.data) {
          const payload = existing.data.answers || existing.data || existing;
          // merge only known keys to avoid unexpected shape
          setAnswers((prev) => ({ ...prev, ...payload }));
          if (payload.userQuery) {
            const recAnimals = await runRecommendation(payload.userQuery);
            setRecommendedAnimals(recAnimals || []);
          }
        }
      } catch (err) {
        // console.warn('설문 로드 실패', err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [user]);

  const favAnimals = useMemo(
    () => favorites.map((id) => favMap[id]).filter(Boolean),
    [favorites, favMap]
  );

  if (!user) return <p>로그인 후 이용해주세요.</p>;

  if (loading) {
    return (
      <div className="survey-loading">
        <div className="spinner"></div>
        <p>잠시만 기다려주세요... 리포트를 생성하고 매칭되는 동물들을 찾는 중입니다 🐾</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAnswers((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (e, key) => {
    const value = e.target.value;
    setAnswers((prev) =>
      e.target.checked
        ? { ...prev, [key]: [...prev[key], value] }
        : { ...prev, [key]: prev[key].filter((v) => v !== value) }
    );
  };

  async function runRecommendation(query) {
    try {
      const payload = {
        natural_query: (query || answers.userQuery || '').trim(),
        limit: 6,
        user_id: user,
        use_survey: true,
      };
      const res = await axios.post('/api/recommand/hybrid', payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' },
      });
      const list = Array.isArray(res.data)
        ? res.data
        : res.data && Array.isArray(res.data.data)
          ? res.data.data
          : [];
      if (!Array.isArray(list)) return [];
      const merged = await Promise.all(
        list.map(async (item) => {
          let detail = null;
          try {
            detail = await getAnimalById(item.desertionNo);
          } catch (e) {
            detail = null;
          }

          const recMeta = {
            final: item.final ?? item.score ?? null,
            compat: item.compat ?? null,
            sim: item.sim ?? null,
            reasons: Array.isArray(item.reasons) ? item.reasons : [],
          };

          if (detail) {
            return {
              ...detail,
              recommendation: recMeta,
              finalScore: recMeta.final,
              final: recMeta.final,
              reasons: recMeta.reasons,
            };
          }

          return {
            desertionNo: item.desertionNo,
            kindFullNm: item.kindFullNm || item.kindNm || '',
            popfile1: item.popfile || null,
            recommendation: recMeta,
            finalScore: recMeta.final,
            final: recMeta.final,
            reasons: recMeta.reasons,
          };
        })
      );

      return merged.filter(Boolean);
    } catch (err) {
      return [];
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const missingField = REQUIRED_FIELDS.find((field) => {
      const value = answers[field.key];

      if (field.isArray) {
        return !Array.isArray(value) || value.length === 0;
      }

      if (value === undefined || value === null) return true;
      if (typeof value === 'string' && value.trim() === '') return true;

      return false;
    });

    if (!missingField && answers.hasAllergy === '있음') {
      if (!answers.allergyAnimal || answers.allergyAnimal.trim() === '') {
        alert('11. 동물 알레르기가 있는 경우, 어떤 동물인지 항목을 응답해야 합니다.');
        return;
      }
    }

    if (missingField) {
      alert(`${missingField.label} 항목을 응답해야 합니다.`);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const surveyRes = await saveSurvey(user, answers);
      if (!surveyRes.success) throw new Error('설문 저장 실패');

      const A = buildA(answers);

      const encoded = await encodeA(A, user);
      if (!encoded.success) throw new Error('encode 실패');

      console.log('🔥 encode + DB 저장 완료:', encoded);

      const recAnimals = await runRecommendation(answers.userQuery);
      setRecommendedAnimals(recAnimals || []);

      setSubmitted(true);
      if (onSave) onSave(answers, recAnimals);
      // navigate('/report');
    } catch (err) {
      setError(err.message || '알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="Survey-container">
      <form className="survey-section" onSubmit={handleSubmit} noValidate>
        <h3>반려동물 추천 설문조사</h3>

        <label>
          1. 거주 지역 *
          <input
            type="text"
            name="address"
            value={answers.address}
            onChange={handleChange}
            placeholder="예: 서울특별시 강남구 역삼동"
          />
        </label>

        <label>
          2. 연령 *
          <input
            type="text"
            name="age"
            value={answers.age}
            onChange={handleChange}
            placeholder="예: 30"
          />
        </label>

        <label>
          3. 성별 *
          <select name="sex" value={answers.sex} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>남성</option>
            <option>여성</option>
          </select>
        </label>

        <label>
          4. 직업 *
          <select name="job" value={answers.job} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>경영/관리직</option>
            <option>전문직</option>
            <option>사무직</option>
            <option>전문기술직</option>
            <option>판매/서비스직</option>
            <option>단순노무/생산/단순기술직</option>
            <option>자영업</option>
            <option>주부</option>
            <option>학생</option>
            <option>기타</option>
          </select>
        </label>

        <label>
          5. 주거 형태 *
          <select name="residenceType" value={answers.residenceType} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>아파트</option>
            <option>단독/다가구 주택</option>
            <option>연립/빌라/다세대 주택</option>
            <option>기타</option>
          </select>
        </label>

        <label>
          6. 주택 규모 *
          <select name="houseSize" value={answers.houseSize} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>10평 미만</option>
            <option>10평 ~ 20평</option>
            <option>20평 ~ 30평</option>
            <option>30평 ~ 40평</option>
            <option>40평 ~ 50평</option>
            <option>50평 이상</option>
          </select>
        </label>

        <label>
          7. 반려동물을 위한 별도 공간이 있나요? *
          <select name="hasPetSpace" value={answers.hasPetSpace} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>있음</option>
            <option>없음</option>
          </select>
        </label>

        <label>
          8. 가족 구성원 수 *
          <input
            name="familyCount"
            type="number"
            value={answers.familyCount}
            onChange={handleChange}
            min="1"
            max="20"
          />
        </label>

        <label>
          9. 어린이나 노인이 함께 거주하나요? *
          <select name="hasChildOrElder" value={answers.hasChildOrElder} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>있음</option>
            <option>없음</option>
          </select>
        </label>

        <label>
          10. 하루 중 집에 머무는 시간 *
          <select name="dailyHomeTime" value={answers.dailyHomeTime} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>0~4시간</option>
            <option>4~8시간</option>
            <option>8~12시간</option>
            <option>12시간 이상</option>
          </select>
        </label>

        <label>
          11. 동물 알레르기가 있나요? *
          <select name="hasAllergy" value={answers.hasAllergy} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>없음</option>
            <option>있음</option>
          </select>
        </label>
        {answers.hasAllergy === '있음' && (
          <input
            name="allergyAnimal"
            value={answers.allergyAnimal}
            onChange={handleChange}
            placeholder="어떤 동물에 알레르기가 있나요?"
          />
        )}

        <label>
          12. 평소 활동 수준은? *
          <select name="activityLevel" value={answers.activityLevel} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>매우 활발함</option>
            <option>보통</option>
            <option>주로 실내 생활</option>
          </select>
        </label>

        <label>
          13. 반려동물에게 바라는 점 *
          <div className="survey-checkbox-group">
            {[
              '교감(애정 표현, 함께 놀기)',
              '독립성(혼자 잘 지냄)',
              '관리의 용이함(손쉬운 관리)',
              '활동적/에너지 넘침',
              '조용함/차분함',
              '기타',
            ].map((label) => (
              <label key={label}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.expectations.includes(label)}
                  onChange={(e) => handleMultiSelect(e, 'expectations')}
                />
                {label}
              </label>
            ))}
          </div>
        </label>

        <label>
          14. 선호하는 동물 종류 *
          <div className="survey-checkbox-group">
            {['강아지', '고양이', '소형동물(햄스터, 토끼 등)', '파충류', '조류', '기타'].map(
              (label) => (
                <label key={label}>
                  <input
                    type="checkbox"
                    value={label}
                    checked={answers.favoriteAnimals.includes(label)}
                    onChange={(e) => handleMultiSelect(e, 'favoriteAnimals')}
                  />
                  {label}
                </label>
              )
            )}
          </div>
        </label>

        <label>
          15. 선호하는 반려동물의 크기 *
          <select name="preferredSize" value={answers.preferredSize} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>소형</option>
            <option>중형</option>
            <option>대형</option>
            <option>상관없음</option>
          </select>
        </label>

        <label>
          16. 선호하는 반려동물의 성격 *
          <div className="survey-checkbox-group">
            {['활발함', '차분함', '독립적', '애교 많음', '상관없음'].map((label) => (
              <label key={label}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.preferredPersonality.includes(label)}
                  onChange={(e) => handleMultiSelect(e, 'preferredPersonality')}
                />
                {label}
              </label>
            ))}
          </div>
        </label>

        <label>
          17. 하루 케어 가능 시간 *
          <select name="careTime" value={answers.careTime} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>10분 이하</option>
            <option>30분</option>
            <option>1시간</option>
            <option>2시간 이상</option>
          </select>
        </label>

        <label>
          18. 월 평균 가구소득 *
          <select name="budget" value={answers.budget} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>100만원 미만</option>
            <option>100만원 ~ 199만원</option>
            <option>200만원 ~ 299만원</option>
            <option>300만원 ~ 399만원</option>
            <option>400만원 ~ 499만원</option>
            <option>500만원 ~ 599만원</option>
            <option>600만원 ~ 699만원</option>
            <option>700만원 이상</option>
          </select>
        </label>

        <label>
          19. 집의 특별한 환경 *
          <input
            name="specialEnvironment"
            value={answers.specialEnvironment}
            onChange={handleChange}
            placeholder="키우는 식물, 잦은 여행 등"
          />
        </label>

        <label>
          20. 반려동물 사육경험 *
          <select name="petHistory" value={answers.petHistory} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>현재 반려동물을 키우고 있다</option>
            <option>과거에는 키웠으나 현재는 키우고 있지 않다</option>
            <option>반려동물을 키운 적 없다</option>
          </select>
        </label>

        <label>
          21. 현재 양육중인 반려동물 *
          <div className="survey-checkbox-group">
            {[
              '강아지',
              '고양이',
              '소형동물(햄스터, 토끼 등)',
              '파충류',
              '조류',
              '기타',
              '없음',
            ].map((label) => (
              <label key={label}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.currentPets.includes(label)}
                  onChange={(e) => handleMultiSelect(e, 'currentPets')}
                />
                {label}
              </label>
            ))}
          </div>
        </label>

        <label>
          22. 반려동물 사육의향 *
          <select name="wantingPet" value={answers.wantingPet} onChange={handleChange}>
            <option value="">선택하세요</option>
            <option>전혀 의향이 없다</option>
            <option>별로 의향이 없다</option>
            <option>보통이다</option>
            <option>다소 의향이 있다</option>
            <option>매우 의향이 있다</option>
          </select>
        </label>

        <label>
          23. 추가로 남기고 싶은 말
          <textarea
            name="additionalNote"
            value={answers.additionalNote}
            onChange={handleChange}
            rows={3}
            placeholder="궁금한 점이나 요청사항을 자유롭게 적어주세요."
          />
        </label>

        <label>
          24. 원하는 반려동물의 구체적 특징 (추천 키워드)
          <input
            type="text"
            name="userQuery"
            value={answers.userQuery}
            onChange={handleChange}
            placeholder="예: 활동적이고 어린이와 잘 지내는 강아지"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? '저장 중...' : '제출'}
        </button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>

      <section className="recommend-preview">
        <h4>추천 결과</h4>
        {recommendedAnimals.length > 0 ? (
          <div className="result-grid">
            {recommendedAnimals.map((a) => (
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
          <p>설문을 저장하면 자동으로 추천을 실행합니다.</p>
        )}
        <AnimalDetail animal={selectedAnimal} onClose={() => setSelectedAnimal(null)} />
      </section>
    </div>
  );
}
