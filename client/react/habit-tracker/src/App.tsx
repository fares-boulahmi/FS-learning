import EmptyHabit from "./components/EmptyHabit";
import Habits from "./components/Habits";
import Header from "./components/Header";
import HabitProvider from "./context/HabitProvider";
import { useHabits } from "./context/useHabit";

export default function HomePage() {
  return (
    <div>
      <Header title="Daily View" child={false} />
      <HabitProvider>
        <HomePageContent />
      </HabitProvider>
    </div>
  );
}

function HomePageContent() {
  const { habits, loading, error } = useHabits(); // ✅ now inside provider

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && habits.length === 0 && <EmptyHabit />}
      {!loading && !error && habits.length > 0 && <Habits />}
    </div>
  );
}
