// IconRenderer.tsx
import type { IconBaseProps } from "react-icons";
import { iconMap } from "../util/iconMap";

interface IconRendererProps extends IconBaseProps {
  name: string; // exact export name, e.g. "FaRegCircle"
}

export function IconRenderer({ name, ...props }: IconRendererProps) {
  const Icon = iconMap[name];
  if (!Icon) return null; // optionally swap in a fallback icon here
  return (
    <div className="border-2 border-(--outline-color)!  rounded m-2 p-2.5 max-w-fit text-3xl bg-(--light-background-color)  ">
      <Icon {...props} />
    </div>
  );
}
