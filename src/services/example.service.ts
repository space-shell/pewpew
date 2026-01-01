import { createSignal } from "solid-js";
import { BehaviorSubject, interval } from "rxjs";
import { map, takeWhile } from "rxjs/operators";
import * as R from "ramda";
import { storage } from "../utils/storage.ts";

/**
 * Example service demonstrating:
 * - Global state with SolidJS signals
 * - RxJS observables for async operations
 * - Ramda for data transformations
 * - LocalStorage persistence
 */

// Global signal for user preferences
const [preferences, setPreferences] = createSignal(
  storage.get("preferences", {
    theme: "light",
    notifications: true,
  }),
);

// RxJS subject for real-time updates
const updates$ = new BehaviorSubject<string[]>([]);

/**
 * Update user preferences
 */
export const updatePreferences = (
  newPrefs: Partial<typeof preferences>,
) => {
  const updated = R.mergeRight(preferences(), newPrefs);
  setPreferences(updated);
  storage.set("preferences", updated);
};

/**
 * Get current preferences
 */
export const getPreferences = () => preferences();

/**
 * Example: Countdown timer using RxJS
 */
export const createCountdown = (seconds: number) => {
  return interval(1000).pipe(
    map((i) => seconds - i),
    takeWhile(R.gte(R.__, 0)),
  );
};

/**
 * Add update to the stream
 */
export const addUpdate = (message: string) => {
  const current = updates$.value;
  updates$.next([...current, message]);
};

/**
 * Get updates observable
 */
export const getUpdates$ = () => updates$.asObservable();

/**
 * Clear all updates
 */
export const clearUpdates = () => {
  updates$.next([]);
};
