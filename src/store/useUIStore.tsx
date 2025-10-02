import { create } from 'zustand';

interface UIState {
  showLogin: boolean;
  toggleLogin: () => void;
  closeLogin: () => void;
  openLogin: () => void;

  // 챗봇 UI 상태
  showChat: boolean;
  toggleChat: () => void;
  closeChat: () => void;
  openChat: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  showLogin: false,
  showChat: false,

  toggleLogin: () => set((state) => ({ showLogin: !state.showLogin })),
  closeLogin: () => set({ showLogin: false }),
  openLogin: () => set({ showLogin: true }),

  toggleChat: () => set((state) => ({ showChat: !state.showChat })),
  closeChat: () => set({ showChat: false }),
  openChat: () => set({ showChat: true }),
}));
