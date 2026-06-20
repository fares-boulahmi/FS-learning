import Button from "./Button";
import { IconRenderer } from "./IconRender";

export default function EmptyHabit() {
  return (
    <div className="flex flex-col h-[calc(100vh-90px)] items-center justify-center w-full">
      <IconRenderer name={"FaRegCircle"} size={20} />
      <h2 className="color-(--white-color) text-3xl mt-2  font-bold">
        Zero habits.
      </h2>
      <p className="text-(--secondary-color) mt-2 text-sm font-medium mb-[5%]">
        Begin the ritual.
      </p>
      <Button title=" + ㅤAdd Your First Habit" theme={true} />

      <p className="text-(--secondary-color) mt-6">
        Press <span className="bg-(--dark-background-color) p-1 ">N</span> to
        quick start
      </p>
    </div>
  );
}
