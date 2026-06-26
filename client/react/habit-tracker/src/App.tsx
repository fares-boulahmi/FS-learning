import { Route, Routes } from "react-router-dom";
import Habit from "./pages/Habit/_id";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/habit/:id" element={<Habit />} />
    </Routes>
  );
}
