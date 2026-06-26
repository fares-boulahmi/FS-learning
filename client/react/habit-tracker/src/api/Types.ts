export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6; // matches Date.getDay(): 0 = Sunday

export type GoodHabitFrequency = "everyday" | "custom_days" | "times_per_week";
export type BadHabitType = "non_strike" | "strike";
export type LogStatus = "done" | "undone" | "fail";

// type FrequencyType = "everyday" | "specific" | "timesPerWeek";

export const DAYS = [
  { key: "0", label: "Sun", full: "Sunday" },
  { key: "1", label: "Mon", full: "Monday" },
  { key: "2", label: "Tue", full: "Tuesday" },
  { key: "3", label: "Wed", full: "Wednesday" },
  { key: "4", label: "Thu", full: "Thursday" },
  { key: "5", label: "Fri", full: "Friday" },
  { key: "6", label: "Sat", full: "Saturday" },
] as const;
export const DateFomat: string = "MM/dd/yyyy";

type Amount = {
  AmountName: string; // default minutes
  AmountQuantity: number; // default 1
};

export type DayKey = (typeof DAYS)[number]["key"];

type BaseHabit = {
  id: string;
  name: string;
  icon: string;
  description: string;
  Completions?: string[];
  Amount?: Amount;
  createdAt: string; // ISO timestamp
};

export type GoodHabit = {
  kind: "good";
  freq: GoodHabitFrequency;
  days?: DayKey[]; // required when freq === 'custom_days'
  timesPerWeek?: number; // required when freq === 'times_per_week'
} & BaseHabit;

export type BadHabit = {
  kind: "bad";
  badType: BadHabitType;
  weeklyFailBudget?: number; // for non_strike, default 0
  targetStreak?: number; // for strike
} & BaseHabit;

export type Habit = GoodHabit | BadHabit;

export interface HabitLog {
  id: string;
  habitId: string;
  date: string; // 'YYYY-MM-DD'
  status: LogStatus;
  quantity: number;
  time: number;
  locked: boolean;
}

export type NewHabitInput = Omit<Habit, "id" | "createdAt">;
export type HabitPatch = Partial<Omit<Habit, "id" | "createdAt" | "kind">>;
