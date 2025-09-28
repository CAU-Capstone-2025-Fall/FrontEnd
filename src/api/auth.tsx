import axios from 'axios';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api/auth', // 프록시 경유해서 원격 FastAPI 서버 연결
  withCredentials: true, // 세션 쿠키 포함
});

// 요청 body 타입 정의
interface AuthRequest {
  username: string;
  password: string;
}

// 회원가입
export const signup = async (data: AuthRequest) => {
  const res = await api.post('/signup', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// 로그인
export const login = async (data: AuthRequest) => {
  const res = await api.post('/login', data, {
    headers: { 'Content-Type': 'application/json' },
  });
  return res.data;
};

// 로그아웃
export const logout = async () => {
  const res = await api.post('/logout');
  return res.data;
};

// 로그인 상태 확인
export const checkAuth = async () => {
  const res = await api.get('/protected');
  return res.data;
};
