import { useState, type ReactNode } from "react";
import type { Habit } from "../api/Types";
import Button from "./Button";
import EditHabitModal from "./EditHabitModal";

export default function EditHabitBtn({
  habit,
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
  habit: Habit;
}) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

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

      <EditHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        habit={habit}
      />
    </div>
  );
}
