import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  checkAuth as apiCheckAuth,
  login as apiLogin,
  logout as apiLogout,
  signup as apiSignup,
} from '../api/auth';

type UserInfo = {
  username: string;
  role: string; // ⭐ admin or user
};

type AuthRequest = { username: string; password: string };

type AuthState = {
  user: UserInfo | null;
  msg: string;
  loading: boolean;
  hydrated: boolean;
  signup: (data: AuthRequest) => Promise<void>;
  login: (data: AuthRequest) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  ensureAuthed: () => Promise<UserInfo | null>;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      msg: '',
      loading: false,
      hydrated: false,

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
          await apiLogin(data); // 세션 생성

          // 서버에서 유저 정보 가져오기
          const d = await apiCheckAuth();

          set({
            user: {
              username: d.user.username,
              role: d.user.role, // ⭐ role 저장!
            },
            msg: '로그인 성공',
          });
        } catch (err: any) {
          set({
            user: null,
            msg: err?.response?.data?.detail || '로그인 실패',
          });
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
      // 세션 확인
      // -----------------------
      checkAuth: async () => {
        try {
          const d = await apiCheckAuth();

          set({
            user: {
              username: d.user.username,
              role: d.user.role, // ⭐ role 다시 동기화
            },
            msg: '로그인 상태 확인 완료',
          });
        } catch {
          set({ user: null, msg: '로그인 필요' });
        }
      },

      // -----------------------
      // 최신 상태 보장
      // -----------------------
      ensureAuthed: async () => {
        await get().checkAuth();
        return get().user;
      },
    }),

    {
      name: 'auth-storage',

      onRehydrateStorage: () => (state) => {
        if (state) {
          state.hydrated = true;
        }
      },
    }
  )
);
