import { useState } from "react";
import { IconPicker } from "./IconPicker";
import { IconRenderer } from "./IconRender";

export default function EmptyHabit() {
  const [iconName, setIconName] = useState<string>("FaBiking");
  return (
    <div>
      <IconPicker value={iconName} onChange={setIconName} />
      {/* preview of what gets saved */}
      {iconName && (
        <div
          style={{
            marginTop: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <IconRenderer name={iconName} size={20} />
          <code>{iconName}</code>
        </div>
      )}

      {/* <Icon iconName="FaAccessibleIcon" /> */}
    </div>
  );
}
