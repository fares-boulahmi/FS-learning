import type { JSX } from "react";
type CustomButtonProps = {
  theme: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  children: React.ReactNode;
  disable?: boolean;
  type?: "button" | "submit" | "reset";
  fontSize: number;
};

export default function Button({
  theme,
  onClick,
  children,
  disable = false,
  type = "button",
  fontSize = 12,
}: CustomButtonProps): JSX.Element {
  let btnStyle: string =
    "bg-(--dark-background-color) text-(--white-color) border-[#444444]";
  if (theme) {
    btnStyle =
      "bg-[#E8E8E8] text-[#111111] border-[#000000] font-bold hover:opacity-90 ";
  }

  return (
    <button
      onClick={onClick}
      disabled={disable}
      type={type}
      className={`${btnStyle} flex items-center py-3 px-10 border-2 rounded min-w-fit  tracking-wide cursor-pointer transition-opacity disabled:cursor-not-allowed disabled:opacity-40 text-[${fontSize}px]
`}
    >
      {children}
    </button>
  );
}
