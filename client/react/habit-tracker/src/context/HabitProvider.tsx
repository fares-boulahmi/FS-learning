import {
  addWeeks,
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  startOfWeek,
  type EachDayOfIntervalResult,
} from "date-fns";
import { useEffect, useState, type ReactNode } from "react";
import { DateFomat, habitsApi, type Habit, type NewHabitInput } from "../api";
import { HabitContext } from "./useHabit";

export default function HabitProvider({ children }: { children: ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);

  async function getHabits() {
    try {
      // const fetchedHabits =;
      setHabits(await habitsApi.getAll());
    } catch (err) {
      console.error(err);
      setError("Failed to load habits.");
    } finally {
      setLoading(false);
    }
  }
  const addHabit = async (data: NewHabitInput) => {
    await habitsApi.create(data);
    getHabits();
  };

  async function DeleteHabit(id: string) {
    setLoading(true);
    const habit = await habitsApi.getById(id);
    if (!habit) throw new Error("there no habit with this id to delete ");
    await habitsApi.remove(id);
    getHabits();
    setLoading(false);
  }

  const week = addWeeks(new Date(), weekOffset);
  const visibleDates: EachDayOfIntervalResult<
    {
      start: Date;
      end: Date;
    },
    undefined
  > = eachDayOfInterval({
    start: startOfWeek(week, { weekStartsOn: 0 }),
    end: endOfWeek(week, { weekStartsOn: 0 }),
  });

  const onNextWeek = () => setWeekOffset((o) => o + 1);
  const onPrevWeek = () => setWeekOffset((o) => o - 1);

  async function toggleHabit(id: string, date: Date) {
    const currHabit = await habitsApi.getById(id);
    let CompletionsDays = await currHabit.Completions;
    if (!CompletionsDays) {
      CompletionsDays = [format(date, DateFomat)];
      await habitsApi.update(id, { Completions: CompletionsDays });
    } else {
      const alreadyDone = CompletionsDays.some((c) => isSameDay(c, date));
      const completions = alreadyDone
        ? CompletionsDays.filter((c) => !isSameDay(c, date))
        : [...CompletionsDays, date];
      await habitsApi.update(id, { Completions: completions });
    }
    getHabits();
  }
  async function editHabit(id: string, data: NewHabitInput) {
    setLoading(true);
    const habit = await habitsApi.getById(id);
    if (!habit) throw new Error("there no habit with this id to delete ");
    await habitsApi.update(id, data);
    getHabits();
    setLoading(false);
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    getHabits();
  }, [loading, weekOffset]);
  return (
    <HabitContext.Provider
      value={{
        habits,
        loading,
        error,
        visibleDates,
        addHabit,
        DeleteHabit,
        onNextWeek,
        onPrevWeek,
        toggleHabit,
        editHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
  // }
}
