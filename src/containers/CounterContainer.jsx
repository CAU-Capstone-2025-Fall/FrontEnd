import { useCounterStore } from '../store/useCounterStore';

const Counter = () => {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

  //기본 Zustand 사용법 (미들웨어 적용X) -> store/useCounterStore.jsx 참고
  //counterStore에서 상태와 액션을 가져와서 사용
  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={decrement}>-</button>
      <button onClick={reset}>reset</button>
      <button onClick={increment}>+</button>
    </div>
  );
};

export default Counter;
