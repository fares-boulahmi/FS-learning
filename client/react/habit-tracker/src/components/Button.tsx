import type { JSX } from "react";

export default function Button({
  title,
  theme,
}: {
  title: string;
  theme: boolean;
}): JSX.Element {
  let btnStyle: string = "bg-[#222222] text-[#CCCCCC] border-[#444444]";
  if (theme) {
    btnStyle = "bg-[#E8E8E8] text-[#111111] border-[#000000] font-medium";
  }

  return (
    <div
      className={`${btnStyle} flex items-center py-2 px-6 border-2 rounded-xs text-2xl min-w-fit uppercase tracking-wide
`}
    >
      {title}
    </div>
  );
}
