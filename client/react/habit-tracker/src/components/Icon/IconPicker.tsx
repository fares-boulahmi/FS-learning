// IconPicker.tsx
import { useMemo, useState } from "react";
import { iconList } from "../../util/iconMap";

type IconPickerProps = {
  value?: string; // currently selected icon name
  onChange: (name: string) => void;
  placeholder?: string;
};

export function IconPicker({
  value,
  onChange,
  placeholder = "Search icons...",
}: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return iconList.slice(0, 150); // cap initial render, ~1500+ icons exist
    const q = query.toLowerCase();
    return iconList
      .filter(({ label }) => label.toLowerCase().includes(q))
      .slice(0, 50);
  }, [query]);

  const selected = useMemo(
    () => iconList.find((i) => i.name === value),
    [value],
  );

  return (
    <div className="relative  w-full ">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 w-full px-3 py-2 rounded border border-(--outline-color) bg-(--background-color) text-zinc-200 cursor-pointer"
      >
        {selected ? (
          <>
            <selected.Icon size={18} />
            <span>{selected.label}</span>
          </>
        ) : (
          <span className="text-zinc-500">Select an icon</span>
        )}
      </button>

      {open && (
        <div className="absolute top-[110%] left-0 w-full max-h-80 overflow-y-auto rounded-lg border border-(--outline-color) bg-(--background-color) text-zinc-200 z-20 shadow-lg shadow-black/40">
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full px-3 py-2 border-0 border-b border-(--outline-color) outline-none bg-transparent text-zinc-200 placeholder:text-zinc-500"
          />
          <div className="grid grid-cols-4 gap-1 p-2">
            {filtered.map(({ name, label, Icon }) => (
              <button
                key={name}
                type="button"
                title={label}
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setQuery("");
                }}
                className={`flex flex-col items-center gap-1 p-2 rounded-md cursor-pointer text-zinc-200 border ${
                  name === value
                    ? "border-indigo-500 bg-zinc-800"
                    : "border-transparent"
                }`}
              >
                <Icon size={22} />
                <span className="text-[10px] text-center whitespace-nowrap overflow-hidden text-ellipsis w-full">
                  {label}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div className="col-span-4 p-3 text-zinc-500 text-center">
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
