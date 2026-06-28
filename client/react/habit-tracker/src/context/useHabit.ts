import type { EachDayOfIntervalResult } from "date-fns";
import { createContext, useContext } from "react";
import type { Habit, NewHabitInput } from "../api";

type Context = {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  visibleDates: EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  >;
  addHabit?: (habit: NewHabitInput) => void;
  DeleteHabit: (id: string) => void;
  onNextWeek: () => void;
  onPrevWeek: () => void;
  toggleHabit: (id: string, date: Date) => void;
  editHabit: (id: string, data: NewHabitInput) => void;
};

export const HabitContext = createContext<null | Context>(null);

export function useHabits() {
  const habitContext = useContext(HabitContext);
  console.log("habit context ", habitContext, habitContext?.error);

  if (habitContext === null) throw new Error("Missing context");
  return habitContext;
}
