import { create } from 'zustand';
import {
  signup as apiSignup,
  login as apiLogin,
  logout as apiLogout,
  checkAuth as apiCheckAuth,
} from '../api/auth';

type AuthRequest = { username: string; password: string };

type AuthState = {
  user: string | null;
  msg: string;
  loading: boolean;
  signup: (data: AuthRequest) => Promise<void>;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  ensureAuthed: () => Promise<string | null>;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  msg: '',
  loading: false,

  signup: async (data) => {
    set({ loading: true, msg: '' });
    try {
      const res = await apiSignup(data);
      set({ msg: res?.message || '회원가입 성공' });
    } catch (err: any) {
      set({ msg: err?.response?.data?.detail || '회원가입 실패' });
    } finally {
      set({ loading: false });
    }
  },

  login: async (data) => {
    set({ loading: true, msg: '' });
    try {
      await apiLogin(data); // 서버가 세션 쿠키 설정
      const d = await apiCheckAuth(); // 최신 사용자 조회
      const name = d?.user ?? ((d?.message || '').replace(' 님 환영합니다!', '') || null);
      set({ user: name, msg: d?.message || '로그인 성공' });
    } catch (err: any) {
      set({ user: null, msg: err?.response?.data?.detail || '로그인 실패' });
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, msg: '' });
    try {
      const res = await apiLogout();
      set({ user: null, msg: res?.message || '로그아웃 성공' });
    } catch (err: any) {
      set({ msg: err?.response?.data?.detail || '로그아웃 실패' });
    } finally {
      set({ loading: false });
    }
  },

  checkAuth: async () => {
    try {
      const d = await apiCheckAuth();
      const name = d?.user ?? ((d?.message || '').replace(' 님 환영합니다!', '') || null);
      set({ user: name, msg: d?.message || '로그인 상태 확인 완료' });
    } catch {
      set({ user: null, msg: '로그인 필요' });
    }
  },

  //최신 상태 보장 가드 (이벤트 핸들러에서 유용)
  ensureAuthed: async () => {
    await get().checkAuth(); // 비동기 후 최신 user로 갱신
    return get().user; // 갱신된 값을 즉시 읽기
  },
}));
