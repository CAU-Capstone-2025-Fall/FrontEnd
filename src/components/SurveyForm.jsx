import React, { useState } from 'react';
import axios from 'axios';
const api = axios.create({
  baseURL: '/api/userinfo/survey',
  withCredentials: true,
});

const A_processed = {
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
  job1: '0',
  job10: '0',
  job2: '0',
  job3: '0',
  job4: '0',
  job5: '0',
  job6: '0',
  job7: '0',
  job8: '0',
  job9: '0',
  petHistory1: '0',
  petHistory2: '0',
  petHistory3: '0',
  wantingPet: '0',
};

export default function SurveyForm({ user }) {
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
    additionalNote: '',
    petHistory: '',
    currentPets: [],
    houseSize: '',
    wantingPet: '',
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

  const saveA_processed = (data) => {
    A_processed.age = data.age;
    A_processed.familyCount = data.familyCount;
    switch(data.houseSize){
      case '10평 미만':
        A_processed.houseSize = '5';
        break;
      case '10평 ~ 20평':
        A_processed.houseSize = '15';
        break;
      case '20평 ~ 30평':
        A_processed.houseSize = '25';
        break;
      case '30평 ~ 40평':
        A_processed.houseSize = '35';
        break;
      case '40평 ~ 50평':
        A_processed.houseSize = '45';
        break;
      case '50평 이상':
        A_processed.houseSize = '60';
        break;
    }
    switch(data.budget){
      case '100만원 미만':
        A_processed.budget = '50';
        break;
      case '100만원 ~ 199만원':
        A_processed.budget = '150';
        break;
      case '200만원 ~ 299만원':
        A_processed.budget = '250';
        break;
      case '300만원 ~ 399만원':
        A_processed.budget = '350';
        break; 
      case '400만원 ~ 499만원':
        A_processed.budget = '450';
        break;
      case '500만원 ~ 599만원':
        A_processed.budget = '550';
        break;
      case '600만원 ~ 699만원':
        A_processed.budget = '650';
        break;
      case '700만원 이상':
        A_processed.budget = '750';
        break;
    }
    if (data.sex === '남성') {
      A_processed.sex1 = '1';
    } else if (data.sex === '여성') {
      A_processed.sex2 = '1';
    }
    switch(data.residenceType){
      case '아파트':
        A_processed.residenceType1 = '1';
        break;
      case '단독/다가구 주택':
        A_processed.residenceType2 = '1';
        break;
      case '연립/빌라/다세대 주택':
        A_processed.residenceType3 = '1';
        break;
      case '기타':
        A_processed.residenceType4 = '1';
        break;
        
    }
    switch(data.job){
      case '경영/관리직':
        A_processed.job1 = '1';
        break;
      case '전문직':
        A_processed.job2 = '1';
        break;
      case '사무직':
        A_processed.job3 = '1';
        break;
      case '전문기술직':
        A_processed.job4 = '1';
        break;
      case '판매/서비스직':
        A_processed.job5 = '1';
        break;
      case '단순노무/생산/단순기술직':
        A_processed.job6 = '1';
        break;
      case '자영업':
        A_processed.job7 = '1';
        break;
      case '주부':
        A_processed.job8 = '1';
        break;
      case '학생':  
        A_processed.job9 = '1';
        break;
      case '기타':
        A_processed.job10 = '1';
        break;
    }
    switch(data.petHistory){
      case '현재 반려동물을 키우고 있다':
        A_processed.petHistory1 = '1';
        break;
      case '과거에는 키웠으나 현재는 키우고 있지 않다':
        A_processed.petHistory2 = '1';
        break;
      case '반려동물을 키운 적 없다':
        A_processed.petHistory3 = '1';
        break;
    }
    switch(data.wantingPet){
      case '전혀 의향이 없다':
        A_processed.wantingPet = '0.2';
        break;
      case '별로 의향이 없다':
        A_processed.wantingPet = '0.4';
        break;
      case '보통이다':
        A_processed.wantingPet = '0.6';
        break;
      case '다소 의향이 있다':
        A_processed.wantingPet = '0.8';
        break;
      case '매우 의향이 있다':
        A_processed.wantingPet = '1.0';
        break;
      default:
        A_processed.wantingPet = '0';
        break;
    }
  }
  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    saveA_processed(answers);
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
        8. 함께 사는 가족 수
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
