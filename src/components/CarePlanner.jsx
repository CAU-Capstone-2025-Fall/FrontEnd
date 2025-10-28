import React, { useState } from 'react';
import '../css/SideService.css';

export default function CarePlanner() {
  const [showPlan, setShowPlan] = useState(false);

  const plan = [
    { day: 1, task: '집 환경 적응, 기본 용품 점검' },
    { day: 2, task: '건강 체크, 동물병원 방문 예약' },
    { day: 3, task: '기본 배변 훈련 시작' },
    { day: 7, task: '초기 건강검진' },
    { day: 14, task: '놀이 시간 늘리기, 사회화 훈련' },
    { day: 21, task: '기초 훈련(앉아, 기다려 등)' },
    { day: 28, task: '예방접종(필요 시)' },
    { day: 30, task: '한 달 점검: 건강/행동/적응상태 확인' },
  ];

  return (
    <div className="sideservice-section">
      <h3>🗓️ 입양 후 첫 30일 케어 플래너</h3>
      <button onClick={() => setShowPlan(!showPlan)}>{showPlan ? '닫기' : '플래너 보기'}</button>
      {showPlan && (
        <ul style={{ marginTop: 12 }}>
          {plan.map((item) => (
            <li key={item.day}>
              <b>Day {item.day}:</b> {item.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
