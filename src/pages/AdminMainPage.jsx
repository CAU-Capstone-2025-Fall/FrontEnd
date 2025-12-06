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
      desc: '생성된 이미지 로그 / 실패 요청 등을 확인합니다.',
      path: '/admin/image-status',
    },
    {
      title: '동물 DB 조회',
      desc: 'MongoDB에 저장된 동물 정보를 검색 / 조회합니다.',
      path: '/admin/animal-db',
    },
    {
      title: '통계 / 분석',
      desc: '모델 결과, 이미지 생성 횟수 등 관리자용 통계 페이지.',
      path: '/admin/stats',
    },

    // ⭐ 새로운 기능들
    {
      title: '후기 관리',
      desc: '사용자가 남긴 후기(리뷰)를 검토, 승인 또는 삭제합니다.',
      path: '/admin/reviews',
    },
    {
      title: '입양 신청 관리',
      desc: '입양 신청 목록을 확인하고 연락처 / 상태를 관리합니다.',
      path: '/admin/adoption',
    },
    {
      title: '보호소 정보 관리',
      desc: '보호소 정보, 연락처, 주소 등을 수정하거나 추가합니다.',
      path: '/admin/shelters',
    },
    {
      title: '사용자 관리',
      desc: '회원 정보, 이용 내역, 권한 설정, 차단 등을 관리합니다.',
      path: '/admin/users',
    },
    {
      title: '시스템 로그',
      desc: '서버 에러 로그, 요청 실패 내역 등을 확인합니다.',
      path: '/admin/logs',
    },
    {
      title: 'AI 모델 관리',
      desc: '모델 버전, 업데이트 기록, 성능 테스트 등을 확인합니다.',
      path: '/admin/models',
    },
  ];

  return (
    <div className="admin-container">
      <h1 className="admin-title">관리자 페이지</h1>
      <p className="admin-subtitle">관리 기능을 선택하세요.</p>

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
    