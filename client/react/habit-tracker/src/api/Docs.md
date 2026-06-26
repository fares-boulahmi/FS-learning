# Habit Tracker — Mock API Documentation

Local-storage-backed API layer that mimics a real REST backend.
All functions return Promises and reject with `ApiError` on failure — swap the internals of `habits.ts` and `logs.ts` to point at a real server when the backend is ready, and no component code changes.

---

## File Structure

```
src/api/
├── index.ts        — single import entry point for the rest of the app
├── types.ts        — all shared TypeScript types and interfaces
├── errors.ts       — ApiError class
├── delay.ts        — ok() / fail() helpers that simulate network latency
├── storage.ts      — the only file that touches localStorage
├── validation.ts   — habit input validation rules
├── habits.ts       — habit CRUD
└── logs.ts         — log CRUD + lock
```

---

## Import

Always import from the barrel, never from individual files:

```ts
import { habitsApi, logsApi, ApiError } from "@/api";
import type { Habit, HabitLog, NewHabitInput } from "@/api";
```

---

## Types

### `Weekday`

```ts
type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
```

Matches `Date.getDay()` — `0` = Sunday, `1` = Monday … `6` = Saturday.

---

### `GoodHabit`

```ts
interface GoodHabit {
  id: string;
  kind: "good";
  name: string;
  createdAt: string; // ISO timestamp
  freq: "everyday" | "custom_days" | "times_per_week";
  days?: Weekday[]; // required when freq === 'custom_days'
  timesPerWeek?: number; // required when freq === 'times_per_week'
  quantity: number; // default 0
  time: number; // minutes, default 0
}
```

| `freq`           | `days`             | `timesPerWeek` |
| ---------------- | ------------------ | -------------- |
| `everyday`       | ignored            | ignored        |
| `custom_days`    | required, ≥1 entry | ignored        |
| `times_per_week` | ignored            | required, ≥1   |

---

### `BadHabit`

```ts
interface BadHabit {
  id: string;
  kind: "bad";
  name: string;
  createdAt: string;
  badType: "non_strike" | "strike";
  weeklyFailBudget?: number; // non_strike only, default 0
  targetStreak?: number; // strike only, required ≥1
  quantity: number;
  time: number;
}
```

---

### `HabitLog`

```ts
interface HabitLog {
  id: string;
  habitId: string;
  date: string; // 'YYYY-MM-DD'
  status: "done" | "undone" | "fail";
  quantity: number;
  time: number;
  locked: boolean; // true = editing rejected with 403
}
```

---

### `NewHabitInput`

`Habit` without `id` and `createdAt` — this is what you pass to `habitsApi.create()`.

```ts
type NewHabitInput = Omit<Habit, "id" | "createdAt">;
```

---

### `HabitPatch`

Partial update shape — everything in `Habit` except `id`, `createdAt`, and `kind` is optional.

```ts
type HabitPatch = Partial<Omit<Habit, "id" | "createdAt" | "kind">>;
```

---

### `ApiError`

Thrown on every rejection so you can inspect the status code in a single `catch`:

```ts
class ApiError extends Error {
  status: number; // mirrors HTTP status codes (400, 403, 404…)
}
```

---

## `habitsApi`

### `habitsApi.getAll()`

Returns every habit in storage.

```ts
async getAll(): Promise<Habit[]>
```

```ts
const habits = await habitsApi.getAll();
```

---

### `habitsApi.getById(id)`

Returns a single habit by id.

```ts
async getById(id: string): Promise<Habit>
```

Rejects with **404** if the id does not exist.

```ts
const habit = await habitsApi.getById("abc-123");
```

---

### `habitsApi.create(input)`

Creates and persists a new habit. Returns the created habit with its generated `id` and `createdAt`.

```ts
async create(input: NewHabitInput): Promise<Habit>
```

Rejects with **400** and a human-readable message for any of these:

- `name` is missing or blank
- `freq === 'custom_days'` with no `days`
- `freq === 'times_per_week'` with `timesPerWeek < 1`
- `badType === 'strike'` with `targetStreak < 1`

```ts
// Good habit — everyday
await habitsApi.create({
  kind: "good",
  name: "Read",
  freq: "everyday",
  quantity: 0,
  time: 30,
});

// Good habit — custom days (Mon + Wed)
await habitsApi.create({
  kind: "good",
  name: "Run",
  freq: "custom_days",
  days: [1, 3],
  quantity: 0,
  time: 45,
});

// Good habit — times per week
await habitsApi.create({
  kind: "good",
  name: "Gym",
  freq: "times_per_week",
  timesPerWeek: 3,
  quantity: 0,
  time: 60,
});

// Bad habit — non-strike
await habitsApi.create({
  kind: "bad",
  name: "Junk food",
  badType: "non_strike",
  weeklyFailBudget: 2,
  quantity: 0,
  time: 0,
});

// Bad habit — strike
await habitsApi.create({
  kind: "bad",
  name: "Smoking",
  badType: "strike",
  targetStreak: 30,
  quantity: 3,
  time: 10,
});
```

---

### `habitsApi.update(id, patch)`

Merges `patch` into the existing habit. Only pass the fields you want to change.

```ts
async update(id: string, patch: HabitPatch): Promise<Habit>
```

Rejects with **404** if the id does not exist.

```ts
// rename a habit and update its time
await habitsApi.update("abc-123", { name: "Morning Run", time: 30 });
```

Note: `kind` cannot be changed via patch. Changing `freq` does not automatically delete existing logs — handle that in the UI if the habit's structure changes significantly.

---

### `habitsApi.remove(id)`

Deletes the habit and **all of its logs** (cascade delete). Returns the deleted id.

```ts
async remove(id: string): Promise<{ id: string }>
```

Rejects with **404** if the id does not exist.

```ts
await habitsApi.remove("abc-123");
```

---

## `logsApi`

Every log entry is identified by the pair `(habitId, date)`. There is at most one log per habit per day.

Dates are always `'YYYY-MM-DD'` strings — use date-fns `format(date, 'yyyy-MM-dd')` to produce them.

---

### `logsApi.getAll()`

Returns every log across every habit. Useful for a dev inspector; prefer scoped queries in production code.

```ts
async getAll(): Promise<HabitLog[]>
```

---

### `logsApi.getByHabit(habitId)`

Returns all logs for a single habit, across all dates.

```ts
async getByHabit(habitId: string): Promise<HabitLog[]>
```

```ts
const logs = await logsApi.getByHabit("abc-123");
```

---

### `logsApi.getByDateRange(habitId, startDate, endDate)`

Returns all logs for a habit within an inclusive date range. This is the primary query for the calendar and progress views.

```ts
async getByDateRange(
  habitId: string,
  startDate: string,  // 'YYYY-MM-DD'
  endDate: string,    // 'YYYY-MM-DD'
): Promise<HabitLog[]>
```

```ts
import { format, startOfMonth, endOfMonth } from "date-fns";

const start = format(startOfMonth(new Date()), "yyyy-MM-dd");
const end = format(endOfMonth(new Date()), "yyyy-MM-dd");
const logs = await logsApi.getByDateRange("abc-123", start, end);
```

The result is a sparse array — days with no log entry are absent. Fill missing dates with your own default state in the UI rather than expecting a full dense array.

---

### `logsApi.upsert(habitId, date, data)`

Creates or overwrites the log entry for a habit on a specific date. This is the main write operation — called when the user taps done/undone/fail on the daily view.

```ts
async upsert(
  habitId: string,
  date: string,
  data: {
    status: LogStatus;
    quantity?: number;
    time?: number;
  }
): Promise<HabitLog>
```

Rejects with **403** if the log for that date is locked.
`quantity` and `time` fall back to the existing log values when omitted, so you can update status alone without clearing the quantities.

```ts
// Mark done with quantity
await logsApi.upsert("abc-123", "2026-06-22", {
  status: "done",
  quantity: 30,
  time: 20,
});

// Mark fail — status only, keep existing quantity/time
await logsApi.upsert("abc-123", "2026-06-22", { status: "fail" });
```

---

### `logsApi.lock(habitId, date)`

Locks a log entry so it can no longer be edited. Call this when your app decides a period (e.g. a past week) has closed. Subsequent `upsert` calls on the same date will reject with 403.

```ts
async lock(habitId: string, date: string): Promise<HabitLog>
```

Rejects with **404** if no log exists for that date yet. Create the log with `upsert` first if needed.

```ts
await logsApi.lock("abc-123", "2026-06-15");
```

There is intentionally no `unlock` — matches the spec's "no undo on strike reset once the day is closed" requirement.

---

### `logsApi.remove(habitId, date)`

Deletes the log entry for a specific date. Returns the deleted identifiers.

```ts
async remove(habitId: string, date: string): Promise<{ habitId: string; date: string }>
```

Rejects with **404** if the log does not exist.

```ts
await logsApi.remove("abc-123", "2026-06-22");
```

---

## Error Handling

Every rejection is an `ApiError`. Catch it by type in components:

```ts
import { habitsApi, ApiError } from "@/api";

try {
  await habitsApi.create(input);
} catch (err) {
  if (err instanceof ApiError) {
    if (err.status === 400) showValidationMessage(err.message);
    if (err.status === 403) showToast("This entry is locked");
    if (err.status === 404) showToast("Not found");
  }
}
```

---

## Network Delay

All functions wait ~350 ms before resolving or rejecting, so loading states, spinners, and error boundaries behave identically to a real network. The delay is defined once in `delay.ts` — change `DEFAULT_DELAY_MS` there if you want faster tests.

---

## Migrating to a Real Backend

1. Replace the body of each function in `habits.ts` and `logs.ts` with a real `fetch()` call.
2. Delete `storage.ts`, `delay.ts`, and `validation.ts` (validation moves to the server).
3. Keep `types.ts`, `errors.ts`, and `index.ts` untouched.
4. No component or hook code changes — the function signatures and return types are identical.

---

## `storage` (dev only)

Direct access to the underlying localStorage layer, exported for dev tooling (e.g. a "Reset data" button in development mode):

```ts
import { storage } from "@/api";

storage.clearAll(); // wipes habits + logs
storage.getHabits(); // read raw array
storage.getLogs(); // read raw array
```

Do not call `storage` from feature components — always go through `habitsApi` and `logsApi`.
