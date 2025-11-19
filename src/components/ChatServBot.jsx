import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useEffect, useRef, useState } from 'react';
import lovelyCat from '../assets/LovelyCat.json'; // ✅ 고양이 애니메이션
import { useChatServStore } from '../store/chatServStore';

export default function ChatServBot() {
  const { messages, addMessage, isThinking, setThinking } = useChatServStore();
  const [input, setInput] = useState('');
  const [headTilt, setHeadTilt] = useState(0);
  const [eyeDir, setEyeDir] = useState({ x: 0, y: 0 });
  const botRef = useRef(null);

  // 💬 메시지 전송
  const handleSend = () => {
    if (!input.trim()) return;
    addMessage('user', input);
    setInput('');
    setThinking(true);
    setHeadTilt((Math.random() > 0.5 ? 1 : -1) * 15);
    setTimeout(() => {
      addMessage('bot', '냐옹~ 좋은 질문이에요 🐾');
      setThinking(false);
      setHeadTilt(0);
    }, 1200);
  };

  // 👀 시선 따라가기 (마우스)
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!botRef.current) return;
      const rect = botRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = (e.clientX - centerX) / rect.width;
      const dy = (e.clientY - centerY) / rect.height;
      setEyeDir({ x: dx * 10, y: dy * 10 });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-6">
      {/* 🐱 고양이 본체 */}
      <motion.div
        ref={botRef}
        animate={{ rotate: headTilt }}
        transition={{ type: 'spring', stiffness: 200, damping: 10 }}
        className="relative w-56 h-56 flex items-center justify-center"
      >
        <Lottie animationData={lovelyCat} loop autoplay className="absolute w-56 h-56" />

        {/* 👀 눈 (시선 따라가기) */}
        <div className="flex space-x-8 absolute top-24">
          {[0, 1].map((i) => (
            <div
              key={i}
              className="w-6 h-6 bg-white rounded-full flex items-center justify-center overflow-hidden"
            >
              <motion.div
                className="w-3 h-3 bg-black rounded-full"
                animate={{ x: eyeDir.x, y: eyeDir.y }}
                transition={{ type: 'spring', stiffness: 150, damping: 12 }}
              />
            </div>
          ))}
        </div>
      </motion.div>

      {/* 💬 채팅창 */}
      <div className="mt-6 w-80 bg-white rounded-2xl shadow-lg p-4 space-y-2 overflow-y-auto h-64 border">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-lg text-sm ${
              m.role === 'user' ? 'bg-blue-100 text-right' : 'bg-pink-100 text-left'
            }`}
          >
            {m.text}
          </div>
        ))}
        {isThinking && <p className="text-gray-400 italic">😺 생각 중...</p>}
      </div>

      {/* ✏️ 입력창 */}
      <div className="mt-4 flex w-80">
        <input
          type="text"
          value={input}
          placeholder="냥~ 뭐든 물어보세요!"
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border rounded-l-xl p-2 focus:outline-none"
          onFocus={() => setHeadTilt((Math.random() > 0.5 ? 1 : -1) * 8)}
          onBlur={() => setHeadTilt(0)}
        />
        <button
          onClick={handleSend}
          className="bg-pink-300 px-4 rounded-r-xl font-semibold hover:bg-pink-400"
        >
          보내기
        </button>
      </div>
    </div>
  );
}
