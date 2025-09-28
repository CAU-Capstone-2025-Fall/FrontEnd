import { useState } from 'react';
import RescueDogCounselor from '../components/RescueDogCounselor';

const TestChat = () => {
  const [showCounselor, setShowCounselor] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState([]);

  const handleOpen = () => setShowCounselor(true);
  const handleClose = () => setShowCounselor(false);

  const handleSelect = (items) => {
    console.log('선택된 키워드:', items);
    setSelectedKeywords(items);
    setShowCounselor(false); // 선택 후 닫기
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Rescue Dog Counselor Test Page</h1>
      <button onClick={handleOpen}>유기견 상담가 열기</button>

      {showCounselor && <RescueDogCounselor onClose={handleClose} onSelect={handleSelect} />}

      <div style={{ marginTop: '20px' }}>
        <h3>최종 선택된 키워드</h3>
        {selectedKeywords.length === 0 ? (
          <p>아직 선택된 키워드가 없습니다.</p>
        ) : (
          <ul>
            {selectedKeywords.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TestChat;
