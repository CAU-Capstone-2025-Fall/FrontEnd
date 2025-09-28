import { create } from 'zustand';

interface UIState {
  showLogin: boolean;
  toggleLogin: () => void;
  closeLogin: () => void;
  openLogin: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showLogin: false,

  toggleLogin: () =>
    set((state) => ({
      showLogin: !state.showLogin,
    })),

  closeLogin: () =>
    set({
      showLogin: false,
    }),

  openLogin: () =>
    set({
      showLogin: true,
    }),
}));
