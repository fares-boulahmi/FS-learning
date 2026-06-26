import type { NewHabitInput } from "./Types";

export function getHabitValidationError(input: NewHabitInput): string | null {
  if (!input.name?.trim()) {
    return "Habit name is required";
  }

  if (input.kind === "good") {
    if (
      input.freq === "custom_days" &&
      (!input.days || input.days.length === 0)
    ) {
      return "custom_days frequency requires at least one selected day";
    }
    if (
      input.freq === "times_per_week" &&
      (!input.timesPerWeek || input.timesPerWeek < 1)
    ) {
      return "times_per_week frequency requires timesPerWeek >= 1";
    }
  }

  if (input.kind === "bad" && input.badType === "strike") {
    if (!input.targetStreak || input.targetStreak < 1) {
      return "strike habits require a targetStreak >= 1";
    }
  }

  return null;
}
