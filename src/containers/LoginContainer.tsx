import { useState } from 'react';
import '../css/Containers/LoginContainer.css';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';

const LoginContainer = () => {
  const { user, login, logout, signup, checkAuth, msg } = useAuthStore();
  const { closeLogin } = useUIStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 로그인 처리
  const handleLogin = async () => {
    await login({ username, password });
    if (useAuthStore.getState().user) {
      closeLogin(); // 로그인 성공 시 창 닫기
    }
  };

  // 회원가입 처리
  const handleSignup = async () => {
    await signup({ username, password });
  };

  // 로그아웃 처리
  const handleLogout = async () => {
    await logout();
    closeLogin();
  };

  return (
    <div className="login-overlay">
      <div className="login-box">
        <button className="login-close" onClick={closeLogin}>
          ✕
        </button>
        <h2>로그인</h2>

        {!user ? (
          <div className="login-form">
            <input
              type="text"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button onClick={handleLogin}>로그인</button>
            <button className="secondary-btn" onClick={handleSignup}>
              회원가입
            </button>
          </div>
        ) : (
          <div className="login-info">
            <p>{user} 님 로그인 중</p>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        )}

        <pre className="msg">{msg}</pre>
      </div>
    </div>
  );
};

export default LoginContainer;
