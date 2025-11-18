import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  checkAuth as apiCheckAuth,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
} from '../api/auth';

type AuthRequest = { username: string; password: string };

type AuthState = {
  user: string | null;
  msg: string;
  loading: boolean;
  hydrated: boolean; // ⭐ hydration 체크
  signup: (data: AuthRequest) => Promise<void>;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  ensureAuthed: () => Promise<string | null>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      msg: '',
      loading: false,
      hydrated: false, // ⭐ 처음엔 false

      // -----------------------
      // 회원가입
      // -----------------------
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

      // -----------------------
      // 로그인
      // -----------------------
      login: async (data) => {
        set({ loading: true, msg: '' });
        try {
          await apiLogin(data); // 세션 쿠키 생성

          // 서버에서 실제 유저명 가져오기
          const d = await apiCheckAuth();
          const name = d?.user ?? ((d?.message || '').replace(' 님 환영합니다!', '') || null);

          set({ user: name, msg: d?.message || '로그인 성공' });
        } catch (err: any) {
          set({ user: null, msg: err?.response?.data?.detail || '로그인 실패' });
        } finally {
          set({ loading: false });
        }
      },

      // -----------------------
      // 로그아웃
      // -----------------------
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

      // -----------------------
      // 서버 세션 확인
      // -----------------------
      checkAuth: async () => {
        try {
          const d = await apiCheckAuth();
          const name = d?.user ?? ((d?.message || '').replace(' 님 환영합니다!', '') || null);

          set({ user: name, msg: '로그인 상태 확인 완료' });
        } catch {
          set({ user: null, msg: '로그인 필요' });
        }
      },

      // -----------------------
      // 최신 상태 보장 (핵심)
      // -----------------------
      ensureAuthed: async () => {
        await get().checkAuth(); // 서버와 동기화
        return get().user;
      },
    }),

    {
      name: 'auth-storage',

      // ⭐ hydration 완료된 후 호출됨
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
