import { Component, createSignal, onMount } from "solid-js";
import { fromEvent } from "rxjs";
import { throttleTime, map } from "rxjs/operators";
import * as R from "ramda";

const App: Component = () => {
  const [count, setCount] = createSignal(0);
  const [clicks, setClicks] = createSignal(0);

  onMount(() => {
    // Example: Using RxJS to handle click events
    const button = document.getElementById("increment-btn");
    if (button) {
      const click$ = fromEvent(button, "click").pipe(
        throttleTime(300),
        map(() => 1),
      );

      click$.subscribe(() => {
        setClicks((prev) => prev + 1);
      });
    }

    // Example: Load data from localStorage
    const savedCount = localStorage.getItem("count");
    if (savedCount) {
      setCount(parseInt(savedCount, 10));
    }
  });

  // Example: Using Ramda for functional operations
  const increment = () => {
    const newCount = R.inc(count());
    setCount(newCount);
    localStorage.setItem("count", newCount.toString());
  };

  const reset = () => {
    setCount(0);
    setClicks(0);
    localStorage.removeItem("count");
  };

  return (
    <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
      <div class="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 class="text-4xl font-bold text-gray-800 mb-6 text-center">
          PewPew PWA
        </h1>

        <div class="space-y-4">
          <div class="text-center">
            <p class="text-gray-600 mb-2">Counter Value:</p>
            <p class="text-5xl font-bold text-blue-600">{count()}</p>
          </div>

          <div class="text-center">
            <p class="text-gray-600 mb-2">RxJS Throttled Clicks:</p>
            <p class="text-3xl font-semibold text-purple-600">{clicks()}</p>
          </div>

          <div class="flex gap-4">
            <button
              id="increment-btn"
              onClick={increment}
              class="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Increment
            </button>
            <button
              onClick={reset}
              class="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
            >
              Reset
            </button>
          </div>

          <div class="mt-6 p-4 bg-gray-100 rounded-lg">
            <p class="text-sm text-gray-600">
              Tech Stack: SolidJS • RxJS • Ramda • Tailwind CSS • Deno
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
