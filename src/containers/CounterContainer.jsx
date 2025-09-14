import { useCounterStore } from '../store/useCounterStore';

const Counter = () => {
  const count = useCounterStore((state) => state.count);
  const increment = useCounterStore((state) => state.increment);
  const decrement = useCounterStore((state) => state.decrement);
  const reset = useCounterStore((state) => state.reset);

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
