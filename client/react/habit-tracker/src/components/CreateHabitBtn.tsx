import { useState, type ReactNode } from "react";
import { habitsApi } from "../api/Habits";
import type { NewHabitInput } from "../api/Types";
import Button from "./Button";
import LogHabitModal from "./LogHabitModal";

export default function CreateHabitBtn({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
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

      <LogHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
