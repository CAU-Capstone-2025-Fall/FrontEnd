import { useState } from 'react';
import '../css/Containers/LoginContainer.css';
import { useAuthStore } from '../store/useAuthStore';
import { useUIStore } from '../store/useUIStore';
import { useNavigate } from 'react-router-dom';

const USER_MIN = 5,
  USER_MAX = 10;
const PASS_MIN = 7,
  PASS_MAX = 20;
const trim = (s: string | null | undefined): string => (s ?? '').trim();

const LoginContainer = () => {
  const { user, login, logout, signup, msg } = useAuthStore();
  const { closeLogin } = useUIStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // 실시간 길이 검증 (공백 제거 기준)
  const uname = trim(username);
  const pword = trim(password);

  const usernameInvalid = uname.length > 0 && (uname.length < USER_MIN || uname.length > USER_MAX);
  const passwordInvalid = pword.length > 0 && (pword.length < PASS_MIN || pword.length > PASS_MAX);

  const canSubmit =
    uname.length >= USER_MIN &&
    uname.length <= USER_MAX &&
    pword.length >= PASS_MIN &&
    pword.length <= PASS_MAX;

  const handleLogin = async () => {
    await login({ username: uname, password: pword });
    if (useAuthStore.getState().user) closeLogin();
  };

  const handleSignup = async () => {
    await signup({ username: uname, password: pword });
  };

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
              placeholder="아이디 (5~10자)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={USER_MIN}
              maxLength={USER_MAX}
              aria-invalid={usernameInvalid}
              aria-describedby="username-hint"
            />
            {usernameInvalid && (
              <small id="username-hint" className="hint">
                아이디는 {USER_MIN}~{USER_MAX}자입니다.
              </small>
            )}

            <input
              type="password"
              placeholder="비밀번호 (7~20자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={PASS_MIN}
              maxLength={PASS_MAX}
              aria-invalid={passwordInvalid}
              aria-describedby="password-hint"
            />
            {passwordInvalid && (
              <small id="password-hint" className="hint">
                비밀번호는 {PASS_MIN}~{PASS_MAX}자입니다.
              </small>
            )}

            <button onClick={handleLogin} disabled={!canSubmit}>
              로그인
            </button>
            <button className="secondary-btn" onClick={handleSignup} disabled={!canSubmit}>
              회원가입
            </button>
          </div>
        ) : (
          <div className="login-info">
            <p>{user} 님 로그인 중</p>
            <button onClick={() => {navigate('/mypage'); closeLogin();}}>마이페이지</button>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        )}

        <pre className="msg">{msg}</pre>
      </div>
    </div>
  );
};

export default LoginContainer;
