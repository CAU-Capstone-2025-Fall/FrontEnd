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

const USERNAME_REGEX = /^(?=.*[A-Za-z])[A-Za-z0-9]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*?_])[A-Za-z0-9!@#$%^&*?_]+$/;

const LoginContainer = () => {
  const { user, login, logout, signup, msg } = useAuthStore();
  const { closeLogin } = useUIStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [signupAttempted, setSignupAttempted] = useState(false); // 👈 회원가입 시도 여부

  // 실시간 길이 & 패턴 검증 (공백 제거 기준)
  const uname = trim(username);
  const pword = trim(password);

  const usernameLengthInvalid =
    uname.length > 0 && (uname.length < USER_MIN || uname.length > USER_MAX);
  const passwordLengthInvalid =
    pword.length > 0 && (pword.length < PASS_MIN || pword.length > PASS_MAX);

  const usernamePatternInvalid = uname.length > 0 && !USERNAME_REGEX.test(uname);
  const passwordPatternInvalid = pword.length > 0 && !PASSWORD_REGEX.test(pword);

  const usernameInvalid = usernameLengthInvalid || usernamePatternInvalid;
  const passwordInvalid = passwordLengthInvalid || passwordPatternInvalid;

  // 로그인은 여전히 "완전 유효"해야만 가능
  const canSubmit =
    uname.length >= USER_MIN &&
    uname.length <= USER_MAX &&
    pword.length >= PASS_MIN &&
    pword.length <= PASS_MAX &&
    USERNAME_REGEX.test(uname) &&
    PASSWORD_REGEX.test(pword);

  const handleLogin = async () => {
    await login({ username: uname, password: pword });
    if (useAuthStore.getState().user) closeLogin();
  };

  const handleSignup = async () => {
    // 회원가입 버튼 누를 때만 검증 메시지 노출 시작
    setSignupAttempted(true);

    // 형식 틀리면 서버로 안 보냄
    if (!canSubmit) return;

    await signup({ username: uname, password: pword });
  };

  const handleLogout = async () => {
    await logout();
    closeLogin();
  };

  // 에러 문구/aria 표시 여부: "회원가입 시도 이후 + invalid"
  const showUsernameError = signupAttempted && usernameInvalid;
  const showPasswordError = signupAttempted && passwordInvalid;

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
              placeholder="아이디 (영문+숫자 5~10자, 영문 필수)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={USER_MIN}
              maxLength={USER_MAX}
              aria-invalid={showUsernameError}
              aria-describedby="username-hint"
            />
            {showUsernameError && (
              <small id="username-hint" className="hint">
                아이디는 {USER_MIN}~{USER_MAX}자이며, 영문과 숫자만 사용 가능하고 영문을 최소 1자
                이상 포함해야 합니다.
              </small>
            )}

            <input
              type="password"
              placeholder="비밀번호 (영문+숫자+특수문자 7~20자)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={PASS_MIN}
              maxLength={PASS_MAX}
              aria-invalid={showPasswordError}
              aria-describedby="password-hint"
            />
            {showPasswordError && (
              <small id="password-hint" className="hint">
                비밀번호는 {PASS_MIN}~{PASS_MAX}자이며, 영문/숫자/특수문자 각각 최소 1자 이상
                포함해야 합니다.
              </small>
            )}

            <button onClick={handleLogin}>로그인</button>

            <button className="secondary-btn" onClick={handleSignup}>
              회원가입
            </button>
          </div>
        ) : (
          <div className="login-info">
            <p>{user.username} 님 로그인 중</p>
            <button
              onClick={() => {
                navigate('/mypage');
                closeLogin();
              }}
            >
              마이페이지
            </button>
            <button onClick={handleLogout}>로그아웃</button>
          </div>
        )}

        <pre className="msg">{msg}</pre>
      </div>
    </div>
  );
};

export default LoginContainer;
