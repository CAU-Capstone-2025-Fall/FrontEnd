import SurveyForm from '../components/SurveyForm'; 
import Recommend from '../components/Recommend';
import { useAuthStore } from '../store/useAuthStore';
import RecommandContainer from '../containers/RecommandContainer';

export default function RecommendPage() {
  const { user, loading } = useAuthStore();

  if (loading) return <p>로딩 중...</p>;

  return (
    <div className="recommend-page" style={{ padding: '60px 20px' }}>
      <h2 style={{ textAlign: 'center' }}>🐾 반려동물 추천 페이지</h2>
      <div className="grid"  style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '80px', alignItems: 'start' }}>
        <SurveyForm user={user.username} />
        <RecommandContainer user={user.username} />
        <Recommend user={user.username} />
      </div>
    </div>
  );
}
