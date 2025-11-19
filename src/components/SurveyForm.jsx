// SurveyForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 추
import { encodeA } from '../api/encode.js';
import { saveSurvey } from '../api/survey';
// -------------------------
// 1) A 초기값 (16개)
// -------------------------
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

// -------------------------
// 2) 매핑 테이블
// -------------------------
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

// 🔥 job 10개 → 모델 5개로 그룹핑
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

// -------------------------
// 3) buildA()
// -------------------------
function buildA(d) {
  const A = { ...initialA };

  // 숫자형
  A.age = d.age || '0';
  A.familyCount = d.familyCount || '0';
  A.houseSize = HOUSE_SIZE_MAP[d.houseSize] || '0';
  A.budget = BUDGET_MAP[d.budget] || '0';

  // 성별
  if (d.sex === '남성') A.sex1 = '1';
  if (d.sex === '여성') A.sex2 = '1';

  // 주택 형태
  if (RESIDENCE_MAP[d.residenceType]) {
    A[RESIDENCE_MAP[d.residenceType]] = '1';
  }

  // 직업 그룹핑
  if (JOB_GROUP[d.job]) {
    A[JOB_GROUP[d.job]] = '1';
  }

  // 사육 의향
  A.wantingPet = '0';

  return A;
}

// -------------------------
// Survey component
// -------------------------
export default function SurveyForm({ user }) {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({
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
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  if (!user) return <p>로그인 후 이용해주세요.</p>;

  // 🔥 여기! 로딩이면 폼 전체 숨기고 로딩 UI만 보여줌
  if (loading) {
    return (
      <div className="survey-loading">
        <div className="spinner"></div>
        <p>잠시만 기다려주세요... 리포트를 생성하는 중입니다 🐾</p>
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

  // -------------------------
  // 제출: encodeA만 호출!
  // -------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1) 설문 저장
      const surveyRes = await saveSurvey(user, answers);
      if (!surveyRes.success) throw new Error('설문 저장 실패');

      // 2) A 벡터 생성
      const A = buildA(answers);

      // 3) encode → 여기서 DB 저장 끝남
      const encoded = await encodeA(A, user);
      if (!encoded.success) throw new Error('encode 실패');

      console.log('🔥 encode + DB 저장 완료:', encoded);

      setSubmitted(true);
      // 4) 성공하면 즉시 /report로 이동
      navigate('/report'); // 🔥 페이지 이동
    } catch (err) {
      setError(err.message || '알 수 없는 오류 발생');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return <p className="survey-success">저장 성공! 감사합니다 🐾</p>;
  }

  return (
    <form className="survey-section" onSubmit={handleSubmit}>
      <h3>반려동물 추천 설문조사</h3>

      <label>
        1. 거주 지역
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
        2. 연령
        <input
          type="text"
          name="age"
          value={answers.age}
          onChange={handleChange}
          placeholder="예: 30"
          required
        />
      </label>

      <label>
        3. 성별
        <select name="sex" value={answers.sex} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>남성</option>
          <option>여성</option>
        </select>
      </label>

      <label>
        4. 직업
        <select name="job" value={answers.job} onChange={handleChange} required>
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
        5. 주거 형태
        <select name="residenceType" value={answers.residenceType} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>아파트</option>
          <option>단독/다가구 주택</option>
          <option>연립/빌라/다세대 주택</option>
          <option>기타</option>
        </select>
      </label>

      <label>
        6. 주택 규모
        <select name="houseSize" value={answers.houseSize} onChange={handleChange} required>
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
        7. 반려동물을 위한 별도 공간이 있나요?
        <select name="hasPetSpace" value={answers.hasPetSpace} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>있음</option>
          <option>없음</option>
        </select>
      </label>

      <label>
        8. 가족 구성원 수
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
        9. 어린이나 노인이 함께 거주하나요?
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
        10. 하루 중 집에 머무는 시간
        <select name="dailyHomeTime" value={answers.dailyHomeTime} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>0~4시간</option>
          <option>4~8시간</option>
          <option>8~12시간</option>
          <option>12시간 이상</option>
        </select>
      </label>

      <label>
        11. 동물 알레르기가 있나요?
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
        12. 평소 활동 수준은?
        <select name="activityLevel" value={answers.activityLevel} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>매우 활발함</option>
          <option>보통</option>
          <option>주로 실내 생활</option>
        </select>
      </label>

      <label>
        13. 반려동물에게 바라는 점
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
        14. 선호하는 동물 종류
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
        15. 선호하는 반려동물의 크기
        <select name="preferredSize" value={answers.preferredSize} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>소형</option>
          <option>중형</option>
          <option>대형</option>
          <option>상관없음</option>
        </select>
      </label>

      <label>
        16. 선호하는 반려동물의 성격
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
        17. 하루 케어 가능 시간
        <select name="careTime" value={answers.careTime} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>10분 이하</option>
          <option>30분</option>
          <option>1시간</option>
          <option>2시간 이상</option>
        </select>
      </label>

      <label>
        18. 월 평균 가구소득
        <select name="budget" value={answers.budget} onChange={handleChange} required>
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
        19. 집의 특별한 환경
        <input
          name="specialEnvironment"
          value={answers.specialEnvironment}
          onChange={handleChange}
          placeholder="키우는 식물, 잦은 여행 등"
        />
      </label>

      <label>
        20. 반려동물 사육경험
        <select name="petHistory" value={answers.petHistory} onChange={handleChange} required>
          <option value="">선택하세요</option>
          <option>현재 반려동물을 키우고 있다</option>
          <option>과거에는 키웠으나 현재는 키우고 있지 않다</option>
          <option>반려동물을 키운 적 없다</option>
        </select>
      </label>

      <label>
        21. 현재 양육중인 반려동물
        <div className="survey-checkbox-group">
          {['강아지', '고양이', '소형동물(햄스터, 토끼 등)', '파충류', '조류', '기타', '없음'].map(
            (label) => (
              <label key={label}>
                <input
                  type="checkbox"
                  value={label}
                  checked={answers.currentPets.includes(label)}
                  onChange={(e) => handleMultiSelect(e, 'currentPets')}
                />
                {label}
              </label>
            )
          )}
        </div>
      </label>

      <label>
        22. 반려동물 사육의향
        <select name="wantingPet" value={answers.wantingPet} onChange={handleChange} required>
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

      <button type="submit" disabled={loading}>
        {loading ? '저장 중...' : '제출'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}
