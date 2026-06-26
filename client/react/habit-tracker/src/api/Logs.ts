import { fail, ok } from "./Delay";
import { storage } from "./Storage";
import type { HabitLog, LogStatus } from "./Types";

interface UpsertLogInput {
  status: LogStatus;
  quantity?: number;
  time?: number;
}

export const logsApi = {
  async getAll(): Promise<HabitLog[]> {
    return ok(storage.getLogs());
  },

  async getByHabit(habitId: string): Promise<HabitLog[]> {
    return ok(storage.getLogs().filter((l) => l.habitId === habitId));
  },

  /** Inclusive range, dates as 'YYYY-MM-DD' — this is what the calendar/progress view calls. */
  async getByDateRange(
    habitId: string,
    startDate: string,
    endDate: string,
  ): Promise<HabitLog[]> {
    const logs = storage
      .getLogs()
      .filter(
        (l) =>
          l.habitId === habitId && l.date >= startDate && l.date <= endDate,
      );
    return ok(logs);
  },

  /** Creates or overwrites the single log entry for a habit on a given day. */
  async upsert(
    habitId: string,
    date: string,
    data: UpsertLogInput,
  ): Promise<HabitLog> {
    const logs = storage.getLogs();
    const index = logs.findIndex(
      (l) => l.habitId === habitId && l.date === date,
    );

    if (index !== -1 && logs[index].locked) {
      return fail(`Log for ${date} is locked and cannot be edited`, 403);
    }

    if (index !== -1) {
      const updated: HabitLog = {
        ...logs[index],
        status: data.status,
        quantity: data.quantity ?? logs[index].quantity,
        time: data.time ?? logs[index].time,
      };
      logs[index] = updated;
      storage.setLogs(logs);
      return ok(updated);
    }

    const created: HabitLog = {
      id: crypto.randomUUID(),
      habitId,
      date,
      status: data.status,
      quantity: data.quantity ?? 0,
      time: data.time ?? 0,
      locked: false,
    };
    storage.setLogs([...logs, created]);
    return ok(created);
  },

  /** Locks a day so it can no longer be edited (e.g. once its week closes). */
  async lock(habitId: string, date: string): Promise<HabitLog> {
    const logs = storage.getLogs();
    const index = logs.findIndex(
      (l) => l.habitId === habitId && l.date === date,
    );
    if (index === -1) return fail(`Log for ${date} not found`, 404);

    logs[index] = { ...logs[index], locked: true };
    storage.setLogs(logs);
    return ok(logs[index]);
  },

  async remove(
    habitId: string,
    date: string,
  ): Promise<{ habitId: string; date: string }> {
    const logs = storage.getLogs();
    if (!logs.some((l) => l.habitId === habitId && l.date === date)) {
      return fail(`Log for ${date} not found`, 404);
    }
    storage.setLogs(
      logs.filter((l) => !(l.habitId === habitId && l.date === date)),
    );
    return ok({ habitId, date });
  },
};
