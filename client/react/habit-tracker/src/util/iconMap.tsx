// iconMap.ts
import type { IconType } from "react-icons";
import * as FaIcons from "react-icons/fa";

// Converts "FaRegCircle" -> "Reg Circle" (strips the "Fa" prefix, splits PascalCase)
function toLabel(exportName: string): string {
  return exportName
    .replace(/^Fa/, "")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim();
}

export interface IconEntry {
  name: string; // exact export name, e.g. "FaRegCircle" — this is what you save in the DB
  label: string; // human-readable, e.g. "Reg Circle" — this is what the user searches by
  Icon: IconType;
}

export const iconList: IconEntry[] = Object.entries(FaIcons)
  .filter(([name]) => name.startsWith("Fa"))
  .map(([name, Icon]) => ({
    name,
    label: toLabel(name),
    Icon: Icon as IconType,
  }));

// Quick lookup by exact name (for rendering, once you know the saved string)
export const iconMap: Record<string, IconType> = Object.fromEntries(
  iconList.map(({ name, Icon }) => [name, Icon]),
);

// Search by label (for your icon picker UI)
export function searchIcons(query: string): IconEntry[] {
  const q = query.toLowerCase();
  return iconList.filter(({ label }) => label.toLowerCase().includes(q));
}
