import axios from 'axios';
import { create } from 'zustand';

// axios 인스턴스 생성
const api = axios.create({
  baseURL: '/api/auth', // Vite 프록시 통해 FastAPI 서버로 전달
  withCredentials: true, // 세션 쿠키 포함
});

// 요청 body 타입
type AuthRequest = {
  username: string;
  password: string;
};

// API 응답 구조 (백엔드에 맞게 수정 가능)
type AuthResponse = {
  user?: string;
  message?: string;
};

type AuthState = {
  user: string | null;
  msg: string;
  signup: (data: AuthRequest) => Promise<void>;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  msg: '',

  // 회원가입
  signup: async (data) => {
    try {
      const res = await api.post<AuthResponse>('/signup', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      set({ msg: res.data.message || '회원가입 성공' });
    } catch (err: any) {
      set({
        msg: err.response?.data?.detail || '회원가입 실패',
      });
    }
  },

  // 로그인
  login: async (data) => {
    try {
      const res = await api.post<AuthResponse>('/login', data, {
        headers: { 'Content-Type': 'application/json' },
      });
      set({
        user: res.data.user || null,
        msg: res.data.message || '로그인 성공',
      });
    } catch (err: any) {
      set({
        user: null,
        msg: err.response?.data?.detail || '로그인 실패',
      });
    }
  },

  // 로그아웃
  logout: async () => {
    try {
      const res = await api.post<AuthResponse>('/logout');
      set({
        user: null,
        msg: res.data.message || '로그아웃 성공',
      });
    } catch (err: any) {
      set({
        msg: err.response?.data?.detail || '로그아웃 실패',
      });
    }
  },

  // 로그인 상태 확인
  checkAuth: async () => {
    try {
      const res = await api.get<AuthResponse>('/protected'); // {message: "...님 환영합니다!"}
      const raw = res.data.user ?? ''; // 혹시 나중에 user 필드를 줄 수도 있음
      const fromMsg = (res.data.message || '').replace(' 님 환영합니다!', '');
      const name = raw || fromMsg || null;
      set({
        user: name,
        msg: res.data.message || '로그인 상태 확인 완료',
      });
    } catch (err: any) {
      set({ user: null, msg: '로그인 필요' });
    }
  },
}));
