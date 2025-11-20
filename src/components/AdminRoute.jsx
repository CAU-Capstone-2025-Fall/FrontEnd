import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function AdminRoute({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return <p>로딩 중...</p>;

  // 로그인 안 했거나, role이 admin이 아닌 경우
  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
