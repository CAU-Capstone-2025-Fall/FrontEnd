import { create } from 'zustand';

export const useChatServStore = create((set) => ({
  messages: [],
  isThinking: false,
  addMessage: (role, text) =>
    set((state) => ({
      messages: [...state.messages, { role, text }],
    })),
  setThinking: (flag) => set({ isThinking: flag }),
}));
