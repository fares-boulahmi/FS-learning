// IconRenderer.tsx
import type { IconBaseProps } from "react-icons";
import { twMerge } from "tailwind-merge";
import { iconMap } from "../../util/iconMap";

type IconRendererProps = {
  name: string; // exact export name, e.g. "FaRegCircle"
} & IconBaseProps;

export function IconRenderer({ name, className, ...props }: IconRendererProps) {
  const Icon = iconMap[name];
  if (!Icon) return null; // optionally swap in a fallback icon here
  return (
    <div
      className={twMerge(
        "border-2 border-(--outline-color)!  rounded m-2 p-2.5 max-w-fit text-3xl bg-(--light-background-color)  ",
        className,
      )}
    >
      <Icon {...props} />
    </div>
  );
}
