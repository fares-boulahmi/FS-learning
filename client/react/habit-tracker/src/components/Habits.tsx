import type { JSX } from "react";
import type { HabitProps } from "../util/utils";
import EmptyHabit from "./EmptyHabit";

export default function Habits({
  habits,
}: {
  habits: HabitProps[];
}): JSX.Element {
  if (habits.length === 0) {
    return <EmptyHabit />;
  } else {
    return <div>Habits</div>;
  }
}
