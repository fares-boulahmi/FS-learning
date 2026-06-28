import type { JSX } from "react";
import { useHabits } from "../context/useHabit";
import CreateHabitBtn from "./CreateHabitBtn";
import HabitCard from "./HabitCard";
import Button from "./Button";
import { isToday } from "date-fns";

export default function Habits(): JSX.Element {
  const { habits, onNextWeek, onPrevWeek, visibleDates } = useHabits();

  return (
    <div className="max-w-5xl m-auto">
      <div className="flex flex-col items-center justify-center gap-2 p-2 w-full">
        {habits.map((habit) => (
          <div className="w-full">
            <HabitCard key={habit.id} habit={habit} />
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row p-2 gap-1.5 w-full">
        <Button theme={true} onClick={onPrevWeek}>
          Prev Week
        </Button>
        <CreateHabitBtn className="flex-2 min-w-[95%] m-auto text-xl  md:text-3xl flex items-center justify-center">
          {" "}
          + Add new Habit{" "}
        </CreateHabitBtn>
        <Button
          theme={true}
          onClick={onNextWeek}
          disabled={visibleDates.some((d) => isToday(d))}
        >
          Next Week
        </Button>
      </div>
    </div>
  );
}
