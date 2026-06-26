import { useMemo, useState } from "react";
import type { DayKey, GoodHabitFrequency, NewHabitInput } from "../api/Types";
import { DAYS } from "../api/Types";
import Button from "./Button";
import { IconPicker } from "./Icon/IconPicker";
import { IconRenderer } from "./Icon/IconRender";

type LogHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: NewHabitInput) => void;
};

const FREQUENCY_OPTIONS: {
  type: GoodHabitFrequency;
  label: string;
  icon: string;
}[] = [
  { type: "everyday", label: "Everyday", icon: "repeat" },
  { type: "custom_days", label: "Specific Days", icon: "calendar" },
  { type: "times_per_week", label: "Times per Week", icon: "list" },
];

export default function LogHabitModal({
  isOpen,
  onClose,
  onSave,
}: LogHabitModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [frequencyType, setFrequencyType] =
    useState<GoodHabitFrequency>("everyday");
  const [specificDays, setSpecificDays] = useState<DayKey[]>(["0"]);
  const [timesPerWeek, setTimesPerWeek] = useState(3);

  const scheduledDays: DayKey[] = useMemo(() => {
    if (frequencyType === "everyday") return DAYS.map((d) => d.key);
    if (frequencyType === "custom_days") return specificDays;
    return DAYS.slice(0, timesPerWeek).map((d) => d.key);
  }, [frequencyType, specificDays, timesPerWeek]);

  if (!isOpen) return null;

  const toggleDay = (day: DayKey) => {
    setSpecificDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  };

  const handleTimesPerWeekChange = (raw: string) => {
    if (raw === "") {
      setTimesPerWeek(1);
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    setTimesPerWeek(Math.min(7, Math.max(1, Math.round(parsed))));
  };

  const handleSave = () => {
    onSave({
      kind: "good",
      name,
      description,
      icon,
      freq: frequencyType,
      days: specificDays,
      timesPerWeek: timesPerWeek,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-(--background-color)/80 px-4 ">
      <div className="w-full max-w-lg rounded border border-(--outline-color) bg-(--dark-background-color) shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-(--outline-color) px-6 py-5">
          <h2 className="text-xl font-semibold text-(--white-color)">
            Log Habit
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-(--white-color) transition-colors cursor-pointer hover:text-(--white-color) font-medium text-2xl"
          >
            ❌
          </button>
        </div>

        <div className="max-h-[75vh] space-y-7 overflow-y-auto px-6 py-6 scrollbar-hide">
          {/* Identity */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-(--secondary-color)">
              IDENTITY
            </h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Habit Name (e.g. Deep Work)"
              className="w-full rounded border border-(--outline-color) bg-(--background-color) px-4 py-3 text-sm text-(--primary-color) placeholder:text-(--secondary-color) outline-none focus:border-(--primary-color)"
            />

            <IconPicker
              value={icon}
              onChange={setIcon}
              placeholder="Choose an icon"
            />

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description or purpose..."
              rows={3}
              className="w-full resize-none rounded border border-(--outline-color) bg-(--background-color) px-4 py-3 text-sm text-(--primary-color) placeholder:text-(--secondary-color) outline-none focus:border-(--primary-color)"
            />
          </section>

          {/* Frequency */}
          <section className="space-y-3">
            <h3 className="text-xs font-semibold tracking-wider text-(--secondary-color)">
              FREQUENCY
            </h3>

            <div className="grid grid-cols-3 gap-3">
              {FREQUENCY_OPTIONS.map((option) => {
                const selected = frequencyType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setFrequencyType(option.type)}
                    className={`flex flex-col items-center gap-2 rounded border px-3 py-4 text-sm transition-colors bg-(--background-color) cursor-pointer ${
                      selected
                        ? "border-(--primary-color) text-(--white-color)"
                        : "border-(--outline-color) text-(--secondary-color) hover:border-(--secondary-color)"
                    }`}
                  >
                    <IconRenderer name={option.icon} size={18} />
                    <span>{option.label}</span>
                  </button>
                );
              })}
            </div>

            {frequencyType === "custom_days" && (
              <div className="flex justify-between gap-1.5 pt-1">
                {DAYS.map((day) => {
                  const selected = specificDays.includes(day.key);
                  return (
                    <button
                      key={day.key}
                      type="button"
                      title={day.full}
                      aria-label={day.full}
                      onClick={() => toggleDay(day.key)}
                      className={`flex h-9 w-9 items-center justify-center rounded-sm border text-xs font-medium transition-colors ${
                        selected
                          ? "border-(--primary-color) bg-(--primary-color) text-(--background-color)"
                          : "border-(--outline-color) text-(--secondary-color) hover:border-(--secondary-color)"
                      }`}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
            )}

            {frequencyType === "times_per_week" && (
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="number"
                  min={1}
                  max={7}
                  value={timesPerWeek}
                  onChange={(e) => handleTimesPerWeekChange(e.target.value)}
                  className="w-[calc(100%-150px)] rounded border border-(--outline-color) bg-(--background-color) px-3 py-2 text-sm text-(--primary-color) outline-none focus:border-(--primary-color)"
                />
                <span className="text-sm text-(--secondary-color)">
                  times per week (1–7)
                </span>
              </div>
            )}
          </section>

          {/* Live Preview */}
          <section className="space-y-2">
            <h3 className="text-xs font-semibold tracking-wider text-(--secondary-color)">
              LIVE PREVIEW
            </h3>
            <div className="rounded border border-(--outline-color) bg-(--background-color) p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {icon && (
                    <div className=" text-(--primary-color)">
                      <IconRenderer name={icon} size={15} />
                    </div>
                  )}
                  <div>
                    <p className="text-base font-semibold text-(--white-color)">
                      {name || "Habit Name"}
                    </p>
                    <p className="text-xs text-(--secondary-color)">
                      {description || "description or purpose"}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex gap-1.5">
                  {DAYS.map((day) => {
                    const isScheduled = scheduledDays.includes(day.key);
                    return (
                      <span
                        key={day.key}
                        title={day.full}
                        className={`h-4 w-4 rounded-sm border ${
                          isScheduled
                            ? "border-(--primary-color) bg-(--primary-color)"
                            : "border-(--outline-color) bg-transparent"
                        }`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-(--outline-color) px-6 py-4">
          <Button onClick={onClose} theme={false}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()} theme={true}>
            Save Habit
          </Button>
        </div>
      </div>
    </div>
  );
}
