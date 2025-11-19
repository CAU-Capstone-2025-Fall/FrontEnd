import React from 'react';
import SurveyForm from '../components/SurveyForm'; // 경로는 실제 위치에 맞게 조정!
import Recommend from '../components/Recommend';
import { useAuthStore } from '../store/useAuthStore';

export default function RecommendPage() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="recommend-page" style={{ padding: '60px 20px', minHeight: '80vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🐾 반려동물 추천 설문</h2>
      <SurveyForm user={user} />
      <Recommend user={user} />
    </div>
  );
}
