const dict = [
  { userId: 'ID' },
  { activityLevel: '활동성향' },
  { additionalNote: '기타 사항' },
  { address: '주소' },
  { allergyAnimal: '알레르기 여부' },
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
  if (!answers || Object.keys(answers).length === 0) {
    return <div className="myinfo-empty">설문 답변이 없습니다.</div>;
  }

  return (
    <ul>
      {Object.entries(answers).map(([key, value]) => (
        <li key={key}>
          {/* <b>{key}</b>: {Array.isArray(value) ? value.join(', ') : value} */}
          <b>{dict.find((item) => item[key])?.[key] || key}</b>:{' '}
          {Array.isArray(value) ? value.join(', ') : value}
        </li>
      ))}
    </ul>
  );
}
