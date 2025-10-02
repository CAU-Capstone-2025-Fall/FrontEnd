import { useEffect, useRef, useState } from 'react';
import { requestChatBot } from '../api/chat_bot';
import '../css/RescueDogCounselor.css';

export default function RescueDogCounselor() {
  const [chatInput, setChatInput] = useState('');
  const [chatLog, setChatLog] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // 초기 인삿말
    setChatLog([
      {
        role: 'gpt',
        text: '안녕! 나는 너의 유기견 상담가야 🐶\n편하게 대화하듯 고민을 말해줘!',
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatLog((prev) => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');

    try {
      const res = await requestChatBot(userMessage);
      setChatLog((prev) => [...prev, { role: 'gpt', text: res.answer }]);
    } catch (error) {
      console.error('챗봇 요청 실패:', error);
      setChatLog((prev) => [
        ...prev,
        { role: 'gpt', text: '죄송해요 😢 서버 응답에 문제가 생겼어요.' },
      ]);
    }
  };

  return (
    <div className="chat-popup-wrapper">
      <div className="chat-box">
        {chatLog.map((msg, i) => (
          <div key={i} className={`chat-message ${msg.role}`}>
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="chat-input-row">
        <input
          type="text"
          placeholder="메시지를 입력하세요..."
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button onClick={handleSend}>전송</button>
      </div>
    </div>
  );
}
