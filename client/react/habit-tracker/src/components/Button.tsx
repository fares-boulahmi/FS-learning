import type { JSX } from "react";

export default function Button({
  title,
  theme,
}: {
  title: string;
  theme: boolean;
}): JSX.Element {
  let btnStyle: string =
    "bg-(--dark-background-color) text-(--white-color) border-[#444444]";
  if (theme) {
    btnStyle = "bg-[#E8E8E8] text-[#111111] border-[#000000] font-bold";
  }

  return (
    <div
      className={`${btnStyle} flex items-center py-3 px-10 border-2 rounded text-2xl min-w-fit  tracking-wide cursor-pointer
`}
    >
      {title}
    </div>
  );
}
