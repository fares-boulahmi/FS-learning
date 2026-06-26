import { useEffect, useState } from "react";
import { habitsApi } from "../api/Habits";
import type { Habit } from "../api/Types";
import EmptyHabit from "../components/EmptyHabit";
import Habits from "../components/Habits";
import Header from "../components/Header";

export default function HomePage() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getHabits = async () => {
      try {
        // const fetchedHabits =;
        setHabits(await habitsApi.getAll());
      } catch (err) {
        console.error(err);
        setError("Failed to load habits.");
      } finally {
        setLoading(false);
      }
    };

    getHabits();
  }, []);

  return (
    <div>
      <Header title="Daily View" child={false} />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
      {!loading && !error && habits.length === 0 && <EmptyHabit />}
      {!loading && !error && habits.length > 0 && <Habits habits={habits} />}
    </div>
  );
}
