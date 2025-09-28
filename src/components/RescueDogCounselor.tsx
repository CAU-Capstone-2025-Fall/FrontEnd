import { useEffect, useRef, useState } from 'react';
import { requestChatBot } from '../api/chat_bot';
import '../css/RescueDogCounselor.css';

// 채팅 메시지 타입
type ChatMessage = {
  role: 'user' | 'gpt';
  text: string;
};

interface RescueDogCounselorProps {
  onClose?: () => void;
  onSelect?: (items: string[]) => void;
}

const RescueDogCounselor: React.FC<RescueDogCounselorProps> = ({ onClose, onSelect }) => {
  const [chatInput, setChatInput] = useState<string>('');
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [lastSuggested, setLastSuggested] = useState<string[]>([]);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // 초기 인삿말
    setChatLog([
      {
        role: 'gpt',
        text:
          '안녕! 나는 너의 유기견 상담가야 🐶\n' +
          '편하게 대화하듯 고민을 말해줘! 어떤 반려견을 입양하고 싶은지 같이 알아가보자!',
      },
    ]);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]); // ✅ chatLog가 변경될 때마다 자동 스크롤

  const parseGptReply = (rawReply: string) => {
    const suggested: string[] = [];

    // ^^^^단어^^^^ 패턴 찾아 배열에 저장, ^^^^ 제거
    const cleanedReply = rawReply.replace(/\^\^\^\^(.+?)\^\^\^\^/g, (_, word) => {
      const trimmed = word.trim();
      suggested.push(trimmed);
      return trimmed;
    });

    return {
      reply: cleanedReply.trim(),
      suggested,
    };
  };

  const handleSend = async () => {
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatLog((prev) => [...prev, { role: 'user', text: userMessage }]);
    setChatInput('');

    try {
      // GPT 응답 받기
      const res = await requestChatBot(userMessage);
      const { reply, suggested } = parseGptReply(res.answer);

      // GPT 응답 저장
      setChatLog((prev) => [...prev, { role: 'gpt', text: reply }]);
      setLastSuggested(suggested);

      // 선택된 추천 업데이트
      setSelected((prev) => [...prev, ...suggested.filter((c) => !prev.includes(c))]);
    } catch (error) {
      console.error('챗봇 요청 실패:', error);
      setChatLog((prev) => [
        ...prev,
        { role: 'gpt', text: '죄송해요 😢 서버 응답에 문제가 생겼어요.' },
      ]);
    }
  };

  const handleConfirm = () => {
    if (onSelect) onSelect(selected);
    if (onClose) onClose();
  };

  return (
    <div className="chat-popup-wrapper">
      <h2>Rescue Dog Counselor</h2>

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
          placeholder="답변을 입력하세요"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button onClick={handleSend}>전송</button>
      </div>

      <div className="chat-recommend-result">
        <h5>선택된 추천 키워드: (클릭하여 삭제)</h5>
        {selected.map((item, i) => (
          <span
            key={i}
            className="pill"
            onClick={() => setSelected((prev) => prev.filter((_, index) => index !== i))}
            style={{ cursor: 'pointer' }}
            title="클릭하여 삭제"
          >
            {item}
          </span>
        ))}
      </div>

      <div className="chat-actions">
        <button onClick={handleConfirm}>이 키워드들 추가하기</button>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default RescueDogCounselor;
