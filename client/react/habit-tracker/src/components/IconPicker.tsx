// IconPicker.tsx
import { useMemo, useState } from "react";
import { iconList } from "../util/iconMap";

interface IconPickerProps {
  value?: string; // currently selected icon name
  onChange: (name: string) => void;
  placeholder?: string;
}

export function IconPicker({
  value,
  onChange,
  placeholder = "Search icons...",
}: IconPickerProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return iconList.slice(0, 50); // cap initial render, ~1500+ icons exist
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
    <div style={{ position: "relative", width: 280 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          padding: "8px 12px",
          border: "1px solid #ccc",
          borderRadius: 6,
          background: "#fff",
          cursor: "pointer",
          color: "black",
        }}
      >
        {selected ? (
          <>
            <selected.Icon size={18} />
            <span>{selected.label}</span>
          </>
        ) : (
          <span style={{ color: "#cccccc" }}>Select an icon</span>
        )}
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "110%",
            left: 0,
            width: "100%",
            maxHeight: 320,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: 6,
            background: "#fff",
            zIndex: 20,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            color: "black",
          }}
        >
          <input
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            style={{
              width: "100%",
              padding: "8px 12px",
              border: "none",
              borderBottom: "1px solid #eee",
              outline: "none",
              boxSizing: "border-box",
              color: "black",
            }}
          />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 4,
              padding: 8,
            }}
          >
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                  padding: 8,
                  borderRadius: 6,
                  cursor: "pointer",
                  border:
                    name === value
                      ? "1px solid #4f46e5"
                      : "1px solid transparent",
                  background: name === value ? "#eef2ff" : "transparent",
                }}
              >
                <Icon size={22} />
                <span
                  style={{
                    fontSize: 10,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "100%",
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
            {filtered.length === 0 && (
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: 12,
                  color: "#cccccc",
                  textAlign: "center",
                }}
              >
                No icons found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
