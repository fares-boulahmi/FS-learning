import { format } from "date-fns";
import { useState } from "react";
import { habitsApi } from "../api";
import {
  DateFomat,
  DAYS,
  type DayKey,
  type Habit,
  type NewHabitInput,
} from "../api/Types";
import Button from "./Button";
import { IconRenderer } from "./Icon/IconRender";

function getScheduledDays(habit: Habit): DayKey[] | undefined {
  if (habit.kind === "good") {
    if (habit.freq === "everyday") return DAYS.map((d) => d.key);
    if (habit.freq === "custom_days") return habit.days;
    return DAYS.slice(0, habit.timesPerWeek).map((d) => d.key);
  } else {
    return undefined;
  }
}
function SetToday(habit: NewHabitInput): boolean {
  if (habit.Completions && habit.Completions.length > 0) {
    console.log("changing today is work");

    const todayDate = format(new Date(), DateFomat);
    if (habit.Completions[habit.Completions.length - 1] === todayDate) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
}

export default function HabitCard({ habit }: { habit: Habit }) {
  const scheduledDays = getScheduledDays(habit);
  const [isTodayDone, setIsTodayDone] = useState<boolean>(SetToday(habit));

  console.log("pass the changin today");

  const btnStyle = isTodayDone
    ? "text-green-500 bg-transparent border-green-800 line-through "
    : "";

  async function CompleteHabit(): Promise<void> {
    if (isTodayDone) {
      if (!habit.Completions || habit.Completions.length === 0) return;

      await habitsApi.update(habit.id, {
        ...habit,
        Completions: habit.Completions?.splice(-1, 1),
      });
      setIsTodayDone(false);
    } else {
      if (!habit.Completions || habit.Completions.length === 0) {
        await habitsApi.update(habit.id, {
          ...habit,
          Completions: [format(new Date(), DateFomat)],
        });
      } else {
        await habitsApi.update(habit.id, {
          ...habit,
          Completions: [...habit.Completions, format(new Date(), DateFomat)],
        });
      }
      setIsTodayDone(true);
    }
  }

  return (
    <div className="rounded border border-(--outline-color) bg-(--background-color) p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {habit.icon && (
            <div className="text-(--primary-color)">
              <IconRenderer name={habit.icon} size={15} />
            </div>
          )}
          <div>
            <p className="text-base font-semibold text-(--white-color)">
              {habit.name}
            </p>
            <p className="text-xs text-(--secondary-color)">
              {habit.description}
            </p>
          </div>
        </div>

        {scheduledDays && (
          <div className="mt-3 flex gap-1.5">
            {DAYS.map((day) => {
              const isScheduled = scheduledDays.includes(day.key);
              return (
                <span
                  key={day.key}
                  title={day.full}
                  className={`h-4 w-4 rounded-sm border ${
                    isScheduled
                      ? "border-(--primary-color) bg-(--primary-color)"
                      : "border-(--outline-color) bg-transparent"
                  }`}
                />
              );
            })}
          </div>
        )}
        <Button theme={true} className={btnStyle} onClick={CompleteHabit}>
          {isTodayDone ? "Done" : "Complete"}
        </Button>
      </div>
    </div>
  );
}
