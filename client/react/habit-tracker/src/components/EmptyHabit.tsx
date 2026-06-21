import { useState } from "react";
import Button from "./Button";
import { IconRenderer } from "./IconRender";
import LogHabitModal, { type HabitFormData } from "./LogHabitModal";

export default function EmptyHabit() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSave = (data: HabitFormData) => {
    console.log("New habit:", data);
    // persist it, add to your habits list, etc.
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-90px)] items-center justify-center w-full">
      <IconRenderer name={"FaRegCircle"} size={20} />
      <h2 className="color-(--white-color) text-3xl mt-2  font-bold">
        Zero habits.
      </h2>
      <p className="text-(--secondary-color) mt-2 text-sm font-medium mb-[5%]">
        Begin the ritual.
      </p>
      <Button theme={true} onClick={() => setIsModalOpen(true)} fontSize={40}>
        {" "}
        + ㅤAdd Your First Habit
      </Button>

      <p className="text-(--secondary-color) mt-6">
        Press <span className="bg-(--dark-background-color) p-1 ">N</span> to
        quick start
      </p>

      <div>
        <LogHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
