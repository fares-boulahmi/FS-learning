import { useState } from "react";
import Button from "./components/Button";
import Habits from "./components/Habits";
import Header from "./components/Header";
import type { HabitProps } from "./util/utils";
export default function App() {
  const [habits, setHAbits] = useState<HabitProps[]>([]);
  return (
    <div>
      <Header title="Daily View" child={false}></Header>
      <Habits habits={habits} />
      <div className="flex items-center gap-0.5 max-w-3 min-w-fit">
        <Button title="Cancel" theme={false}></Button>
        <Button title="Save Habit" theme={true}></Button>
      </div>
    </div>
  );
}
