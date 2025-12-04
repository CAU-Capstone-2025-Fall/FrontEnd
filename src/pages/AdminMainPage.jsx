// src/pages/AdminMainPage.jsx

import { useNavigate } from 'react-router-dom';
import '../css/AdminMainPage.css';

function AdminMainPage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      title: '이미지 수정',
      desc: '유기동물 사진을 GPT 기반으로 자동 클린/복원합니다.',
      path: '/admin/image-edit',
    },
    {
      title: '이미지 생성 상태 보기',
      desc: '생성된 이미지 로그 / 실패한 요청 등을 확인합니다.',
      path: '/admin/image-status',
    },
    {
      title: '동물 DB 조회',
      desc: 'MongoDB에 저장된 동물 데이터를 검색/조회합니다.',
      path: '/admin/animal-db',
    },
    {
      title: '통계/분석',
      desc: '모델 결과, 이미지 생성 횟수 등 관리자용 통계 페이지.',
      path: '/admin/stats',
    },
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-title">관리자 페이지</h1>
      <p className="admin-subtitle">원하는 기능을 선택하세요.</p>

      <div className="admin-grid">
        {menuItems.map((item) => (
          <div key={item.title} className="admin-card" onClick={() => navigate(item.path)}>
            <h2>{item.title}</h2>
            <p>{item.desc}</p>
            <button className="admin-btn">바로가기</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminMainPage;
