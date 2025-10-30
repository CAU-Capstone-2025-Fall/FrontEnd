import React, { useState } from 'react';
import axios from 'axios';
import '../css/SurveyForm.css'; // 🎨 새 스타일 파일 (아래에 제공)
const api = axios.create({
  baseURL: '/api/userinfo/survey',
  withCredentials: true,
});

export default function SurveyForm({ user }) {
  const [answers, setAnswers] = useState({
    address: '',
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
    additionalNote: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // 로그인 상태 확인
  if (!user) return <p className="survey-alert">로그인 후 설문 이용이 가능합니다.</p>;

  // 다중 선택 처리
  const handleMultiSelect = (e, key) => {
    const value = e.target.value;
    setAnswers((prev) =>
      e.target.checked
        ? { ...prev, [key]: [...prev[key], value] }
        : { ...prev, [key]: prev[key].filter((item) => item !== value) }
    );
  };

  // 단일 입력 처리
  const handleChange = (e) => {
    setAnswers({ ...answers, [e.target.name]: e.target.value });
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post(
        '',
        { userId: user, ...answers },
        { headers: { 'Content-Type': 'application/json' } }
      );
      res.data.success ? setSubmitted(true) : setError(res.data.msg || '설문 저장 실패');
    } catch (err) {
      setError('서버 오류: ' + (err?.response?.data?.msg || err.message));
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <p className="survey-success">설문이 성공적으로 저장되었습니다! 감사합니다 🐾</p>;
  }

  return (
    <form className="survey-section" onSubmit={handleSubmit}>
      <h3>반려동물 추천 설문조사</h3>

      <label>
        0. 거주 지역
        <input
          type="text"
          name="address"
          value={answers.address}
          onChange={handleChange}
          placeholder="예: 서울특별시 강남구 역삼동"
          required
        />
      </label>

      <label>
        1. 현재 거주 형태는?
        <select name="residenceType" value={answers.residenceType} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>아파트</option>
          <option>단독주택</option>
          <option>오피스텔/원룸</option>
          <option>기타</option>
        </select>
      </label>

      <label>
        2. 반려동물을 위한 별도 공간이 있나요?
        <select name="hasPetSpace" value={answers.hasPetSpace} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>있음</option>
          <option>없음</option>
        </select>
      </label>

      <label>
        3. 함께 사는 가족 수
        <input
          name="familyCount"
          type="number"
          value={answers.familyCount}
          onChange={handleChange}
          min="1"
          max="20"
          required
        />
      </label>

      <label>
        4. 어린이나 노인이 함께 거주하나요?
        <select
          name="hasChildOrElder"
          value={answers.hasChildOrElder}
          onChange={handleChange}
          required
        >
          <option value="">선택하세요</option>
          <option>있음</option>
          <option>없음</option>
        </select>
      </label>

      <label>
        5. 하루 중 집에 머무는 시간
        <select name="dailyHomeTime" value={answers.dailyHomeTime} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>0~4시간</option>
          <option>4~8시간</option>
          <option>8~12시간</option>
          <option>12시간 이상</option>
        </select>
      </label>

      <label>
        6. 동물 알레르기가 있나요?
        <select name="hasAllergy" value={answers.hasAllergy} onChange={handleChange} required>
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
        7. 평소 활동 수준은?
        <select name="activityLevel" value={answers.activityLevel} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>매우 활발함</option>
          <option>보통</option>
          <option>주로 실내 생활</option>
        </select>
      </label>

      <label>
        8. 반려동물에게 바라는 점
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
        9. 선호하는 동물 종류
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
        10. 선호하는 반려동물의 크기
        <select name="preferredSize" value={answers.preferredSize} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>소형</option>
          <option>중형</option>
          <option>대형</option>
          <option>상관없음</option>
        </select>
      </label>

      <label>
        11. 선호하는 반려동물의 성격
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
        12. 하루 케어 가능 시간
        <select name="careTime" value={answers.careTime} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>10분 이하</option>
          <option>30분</option>
          <option>1시간</option>
          <option>2시간 이상</option>
        </select>
      </label>

      <label>
        13. 월 평균 지출 의향
        <select name="budget" value={answers.budget} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>3만 원 이하</option>
          <option>5만 원</option>
          <option>10만 원</option>
          <option>20만 원 이상</option>
        </select>
      </label>

      <label>
        14. 집의 특별한 환경
        <input
          name="specialEnvironment"
          value={answers.specialEnvironment}
          onChange={handleChange}
          placeholder="식물, 다른 동물, 잦은 여행 등"
        />
      </label>

      <label>
        15. 추가로 남기고 싶은 말
        <textarea
          name="additionalNote"
          value={answers.additionalNote}
          onChange={handleChange}
          rows={3}
          placeholder="궁금한 점이나 요청사항을 자유롭게 적어주세요."
        />
      </label>

      <button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '제출'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
