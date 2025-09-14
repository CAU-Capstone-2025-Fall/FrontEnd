import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

//중요!!!!
//크롬 개발자 도구에서 상태  변화를 추적하기 위해서 devtools 미들웨어 적용
//반드시 적용해야 추후 개발이 편해짐...

export const useCounterStore = create(
  devtools(
    (set) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
      decrement: () => set((state) => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
    }),
    { anonymousActionType: 'CounterStore' } // ← 여기 이름 지정!
  )
);
