import React from 'react';

const dict = [
  { userId: 'ID' },
  { activityLevel: '활동 성향' },
  { additionalNote: '기타 사항' },
  { address: '주소' },
  { allergyAnimal: '알레르기 동물' },
  { budget: '가구 소득' },
  { careTime: '돌봄 시간' },
  { dailyHomeTime: '재택 시간' },
  { expectations: '선호 특성' },
  { familyCount: '가족 인원' },
  { favoriteAnimals: '선호 동물' },
  { hasAllergy: '알레르기 여부' },
  { hasChildOrElder: '아이/노약자 여부' },
  { hasPetSpace: '반려동물 공간 여부' },
  { preferredPersonality: '선호 성격' },
  { preferredSize: '선호 크기' },
  { residenceType: '주거 형태' },
  { specialEnvironment: '특별 환경' },
  { petHistory: '반려동물 양육 경험' },
  { currentPets: '현재 양육중인 반려동물' },
  { age: '나이' },
  { houseSize: '주택 규모' },
  { sex : '성별' },
  { job : '직업' },
  { wantingPet : '반려동물 입양 의사' },
];

export default function SurveyAnswers({ answers }) {
  if (!answers || Object.keys(answers).length === 0) {
    return <div className="myinfo-empty">설문 답변이 없습니다.</div>;
  }

  return (
    <div className="survey-answers">
      <h4>📋 설문 응답 요약</h4>
      <div className="answers-grid">
        {Object.entries(answers).map(([key, value]) => {
          const label = dict.find((item) => item[key])?.[key] || key;
          const text = Array.isArray(value) ? value.join(', ') : value || '—';
          return (
            <div key={key} className="answer-card">
              <span className="label">{label}</span>
              <span className="value">{text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
