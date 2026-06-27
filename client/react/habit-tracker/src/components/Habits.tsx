import type { JSX } from "react";
import { useHabits } from "../context/useHabit";
import CreateHabitBtn from "./CreateHabitBtn";
import HabitCard from "./HabitCard";

export default function Habits(): JSX.Element {
  const { habits } = useHabits();

  return (
    <div className="max-w-5xl m-auto">
      <div className="flex flex-col items-center justify-center gap-2 p-2 w-full">
        {habits.map((habit) => (
          <div className="w-full">
            <HabitCard key={habit.id} habit={habit} />
          </div>
        ))}
      </div>
      <CreateHabitBtn className="min-w-[98%] m-auto text-xl  md:text-3xl flex items-center justify-center">
        {" "}
        + Add new Habit{" "}
      </CreateHabitBtn>
    </div>
  );
}
