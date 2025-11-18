import SurveyForm from '../components/SurveyForm';
import { useAuthStore } from '../store/useAuthStore';

export default function RecommendPage() {
  const { user, loading } = useAuthStore();

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="recommend-page" style={{ padding: '60px 20px' }}>
      <h2 style={{ textAlign: 'center' }}>🐾 반려동물 추천 설문</h2>
      <SurveyForm user={user} />
    </div>
  );
}
