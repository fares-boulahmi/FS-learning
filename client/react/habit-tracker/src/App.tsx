import Button from "./components/Button";
import Header from "./components/Header";
export default function App() {
  return (
    <div>
      <Header title="Daily View" child={false}></Header>
      <div className="flex items-center gap-0.5 max-w-3 min-w-fit">
        <Button title="Cancel" theme={false}></Button>
        <Button title="Save Habit" theme={true}></Button>
      </div>
    </div>
  );
}
