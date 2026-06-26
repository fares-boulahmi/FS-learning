import CreateHabitBtn from "./CreateHabitBtn";
import { IconRenderer } from "./Icon/IconRender";

export default function EmptyHabit() {
  return (
    <div className="flex flex-col h-[calc(100vh-90px)] items-center justify-center w-full">
      <IconRenderer name={"FaRegCircle"} size={30} />
      <h2 className="color-(--white-color) text-3xl mt-2  font-bold">
        Zero habits.
      </h2>
      <p className="text-(--secondary-color) mt-2 text-sm font-medium mb-[4%]">
        Begin the ritual.
      </p>
      <CreateHabitBtn > + ㅤAdd Your First Habit</CreateHabitBtn>

      <p className="text-(--secondary-color) mt-6">
        Press <span className="bg-(--dark-background-color) p-1 ">N</span> to
        quick start
      </p>
    </div>
  );
}
