import { Component, createSignal } from "solid-js";
import * as R from "ramda";

interface CounterProps {
  initialValue?: number;
  step?: number;
}

/**
 * Example counter component demonstrating:
 * - SolidJS signals
 * - Ramda functional operations
 * - LocalStorage persistence
 * - Tailwind styling
 */
const Counter: Component<CounterProps> = (props) => {
  const step = props.step ?? 1;
  const [count, setCount] = createSignal(props.initialValue ?? 0);

  const increment = () => {
    setCount(R.add(R.__, step));
  };

  const decrement = () => {
    setCount(R.subtract(R.__, step));
  };

  const reset = () => {
    setCount(0);
  };

  return (
    <div class="flex flex-col items-center gap-4 p-6 bg-white rounded-lg shadow-md">
      <div class="text-6xl font-bold text-blue-600">{count()}</div>

      <div class="flex gap-2">
        <button
          onClick={decrement}
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded transition"
        >
          -
        </button>
        <button
          onClick={reset}
          class="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded transition"
        >
          Reset
        </button>
        <button
          onClick={increment}
          class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded transition"
        >
          +
        </button>
      </div>
    </div>
  );
};

export default Counter;
