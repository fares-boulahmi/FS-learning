import { format, isFuture, isSameDay } from "date-fns";
import { DAYS, type DayKey, type Habit } from "../api/Types";
import { useHabits } from "../context/useHabit";
import Button from "./Button";
import EditHabitBtn from "./EditHabitBtn";
import { IconRenderer } from "./Icon/IconRender";

function getScheduledDays(habit: Habit): DayKey[] | undefined {
  if (habit.kind === "good") {
    if (habit.freq === "everyday") return DAYS.map((d) => d.key);
    if (habit.freq === "custom_days") return habit.days;
    return DAYS.slice(0, habit.timesPerWeek).map((d) => d.key);
  }
  return undefined;
}

// Returns true if this date button should be disabled
function isDateDisabled(
  habit: Habit,
  date: Date,
  visibleDates: Date[],
): boolean {
  if (isFuture(date)) return true;

  if (habit.kind !== "good") return false;

  if (habit.freq === "custom_days" && habit.days) {
    // day of week: 0=Sun,1=Mon,...6=Sat — map to your DayKey
    const dayIndex = date.getDay(); // 0-6
    // DAYS keys appear to be "0"=Mon? Check your DAYS definition.
    // Adjust mapping below if needed:
    const dayKey = String(dayIndex) as DayKey;
    const alreadyDone = habit.Completions?.some((c) => isSameDay(c, date));
    if (alreadyDone) return false; // allow toggling off
    return !habit.days.includes(dayKey);
  }

  if (habit.freq === "times_per_week" && habit.timesPerWeek) {
    const alreadyDone = habit.Completions?.some((c) => isSameDay(c, date));
    if (alreadyDone) return false; // allow toggling off

    // Count completions within the visible week range
    const weekStart = visibleDates[0];
    const weekEnd = visibleDates[visibleDates.length - 1];
    const completionsThisWeek = (habit.Completions ?? []).filter((c) => {
      const d = new Date(c);
      return d >= weekStart && d <= weekEnd;
    }).length;

    return completionsThisWeek >= habit.timesPerWeek;
  }

  return false;
}

export default function HabitCard({ habit }: { habit: Habit }) {
  const scheduledDays = getScheduledDays(habit);
  const { DeleteHabit, visibleDates, toggleHabit } = useHabits();

  return (
    <div className="rounded border border-(--outline-color) bg-(--background-color) p-4 cursor-pointer">
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

        <div className="flex flex-row gap-1">
          <Button
            theme={false}
            onClick={() => DeleteHabit(habit.id)}
            className="px-4 text-(--secondary-color) border-(--secondary-color) font-extrabold border-4"
          >
            Delete
          </Button>
          <EditHabitBtn habit={habit}>Edit</EditHabitBtn>
        </div>
      </div>

      <div className="mt-2 pt-2 border-t-2 border-(--outline-color) flex">
        {visibleDates.map((date) => {
          const disabled = isDateDisabled(habit, date, visibleDates);
          return (
            <Button
              className="flex flex-1 flex-col items-center gap-0.5 rounded-lg text-xs"
              key={date.toISOString()}
              disabled={disabled}
              onClick={() => toggleHabit(habit.id, date)}
              theme={
                !habit.Completions
                  ? false
                  : habit?.Completions.some((d) => isSameDay(date, d))
                    ? true
                    : false
              }
            >
              <span className="font-medium">{format(date, "EEE")}</span>
              <span>{format(date, "d")}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
