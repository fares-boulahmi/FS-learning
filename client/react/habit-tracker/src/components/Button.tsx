import type { ComponentProps, JSX } from "react";
import { twMerge } from "tailwind-merge";
type CustomButtonProps = {
  theme: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
} & ComponentProps<"button">;

export default function Button({
  theme,
  onClick,
  className,
  ...props
}: CustomButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      {...props}
      className={twMerge(
        btnTheme(theme),
        " flex items-center py-3 px-10 border-2 rounded min-w-fit  tracking-wide cursor-pointer transition-opacity disabled:cursor-not-allowed disabled:opacity-40 ",
        className,
      )}
    />
  );
}
function btnTheme(theme: boolean) {
  switch (theme) {
    case true:
      return "bg-(--white-color) text-(--background-color) border-(--background-color) font-bold hover:opacity-90";
    case false:
      return "bg-(--dark-background-color) text-(--white-color) border-[--outline-color]";
  }
}
