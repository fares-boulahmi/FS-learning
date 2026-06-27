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

  // async function DayCompletion(
  //   id: string,
  //   Completions: string[],
  //   todayCompletion: boolean,
  // ): Promise<boolean> {
  //   if (todayCompletion) {
  //     if (!Completions || Completions.length === 0) return false;

  //     await habitsApi.update(id, {
  //       Completions: Completions?.splice(-1, 1),
  //     });
  //     return false;
  //   } else {
  //     if (!Completions || Completions.length === 0) {
  //       await habitsApi.update(id, {
  //         Completions: [format(new Date(), DateFomat)],
  //       });
  //     } else {
  //       await habitsApi.update(id, {
  //         Completions: [...Completions, format(new Date(), DateFomat)],
  //       });
  //     }
  //     return true;
  //   }
  // }
  async function DayCompletion(
    id: string,
    Completions: (Date | string)[],
    todayCompletion: boolean,
  ): Promise<boolean> {
    const today = format(new Date(), DateFomat);

    const currHabit = await habitsApi.getById(id);
    const CompletionsDays = currHabit.Completions ?? [];

    if (todayCompletion) {
      // Remove today's completion
      const updated = CompletionsDays.filter((c) => !isSameDay(c, today));
      await habitsApi.update(id, { Completions: updated });
      return false;
    } else {
      // Add today's completion
      const updated = [...CompletionsDays, today];
      await habitsApi.update(id, { Completions: updated });
      return true;
    }
  }
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
    start: startOfWeek(week, { weekStartsOn: 1 }),
    end: endOfWeek(week, { weekStartsOn: 1 }),
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
        DayCompletion,
        DeleteHabit,
        onNextWeek,
        onPrevWeek,
        toggleHabit,
      }}
    >
      {children}
    </HabitContext.Provider>
  );
  // }
}
