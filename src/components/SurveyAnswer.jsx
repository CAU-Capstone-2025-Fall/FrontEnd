import React from 'react';

const dict = [
  { userId: 'ID' },
  { activityLevel: '활동 성향' },
  { additionalNote: '기타 사항' },
  { address: '주소' },
  { allergyAnimal: '알레르기 동물' },
  { budget: '돌봄 예산' },
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
];

export default function SurveyAnswers({ answers }) {
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
