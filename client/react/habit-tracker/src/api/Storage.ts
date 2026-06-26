import type { Habit, HabitLog } from "./Types";

const HABITS_KEY = "habit-tracker:habits";
const LOGS_KEY = "habit-tracker:logs";

function read<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function write<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export const storage = {
  getHabits: (): Habit[] => read<Habit>(HABITS_KEY),
  setHabits: (habits: Habit[]): void => write(HABITS_KEY, habits),

  getLogs: (): HabitLog[] => read<HabitLog>(LOGS_KEY),
  setLogs: (logs: HabitLog[]): void => write(LOGS_KEY, logs),

  /** Wipes all habit data. Useful for a "reset demo data" dev button. */
  clearAll: (): void => {
    localStorage.removeItem(HABITS_KEY);
    localStorage.removeItem(LOGS_KEY);
  },
};
