import type { JSX } from "react";
import { Link } from "react-router-dom";
import type { Habit } from "../api/Types";
import CreateHabitBtn from "./CreateHabitBtn";
import HabitCard from "./HabitCard";

export default function Habits({ habits }: { habits: Habit[] }): JSX.Element {
  return (
    <div className="max-w-5xl m-auto">
      <div className="flex flex-col items-center justify-center gap-2 p-2 w-full">
        {habits.map((habit) => (
          // <Link key={habit.id} to={`/habit/${habit.id}`} className="w-full">
          <div className="w-full">
            <HabitCard key={habit.id} habit={habit} />
          </div>
          // </Link>
        ))}
      </div>
      <CreateHabitBtn className="min-w-[98%] m-auto text-xl  md:text-3xl flex items-center justify-center">
        {" "}
        + Add new Habit{" "}
      </CreateHabitBtn>
    </div>
  );
}
