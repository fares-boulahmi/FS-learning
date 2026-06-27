import { fail, ok } from "./Delay";
import { storage } from "./Storage";
import type { Habit, HabitPatch, NewHabitInput } from "./Types";
import { getHabitValidationError } from "./Validation";

export const habitsApi = {
  async getAll(): Promise<Habit[]> {
    return ok(storage.getHabits());
  },

  async getById(id: string): Promise<Habit> {
    const habit = storage.getHabits().find((h) => h.id === id);
    if (!habit) return fail(`Habit "${id}" not found`, 404);
    return ok(habit);
  },

  async create(input: NewHabitInput): Promise<Habit> {
    const validationError = getHabitValidationError(input);
    if (validationError) return fail(validationError, 400);

    const habit = {
      ...input,
      id: crypto.randomUUID(),
      Completions: [],
      createdAt: new Date().toISOString(),
    } as Habit;

    storage.setHabits([...storage.getHabits(), habit]);
    return ok(habit);
  },

  async update(id: string, patch: HabitPatch): Promise<Habit> {
    const habits = storage.getHabits();
    const index = habits.findIndex((h) => h.id === id);
    if (index === -1) return fail(`Habit "${id}" not found`, 404);

    const updated = { ...habits[index], ...patch } as Habit;
    habits[index] = updated;
    storage.setHabits(habits);
    return ok(updated);
  },

  /** Deletes a habit and cascades the deletion to all of its logs. */
  async remove(id: string): Promise<{ id: string }> {
    const habits = storage.getHabits();
    if (!habits.some((h) => h.id === id))
      return fail(`Habit "${id}" not found`, 404);

    storage.setHabits(habits.filter((h) => h.id !== id));
    storage.setLogs(storage.getLogs().filter((l) => l.habitId !== id));
    return ok({ id });
  },
};
