import { useState } from "react";
import { habitsApi } from "../api/Habits";
import type { Habit } from "../api/Types";
import Button from "./Button";
import LogHabitModal from "./LogHabitModal";

export default function CreateHabitBtn({
  className,
  children,
}: {
  className?: string;
  children;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleSave = async (data: Habit) => {
    console.log("New habit:", data);
    await habitsApi.create(data);
    // persist it, add to your habits list, etc.
    setIsModalOpen(false);
  };

  return (
    <div>
      <Button
        theme={true}
        onClick={() => setIsModalOpen(true)}
        className={className}
      >
        {" "}
        {children}
      </Button>

      <LogHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
