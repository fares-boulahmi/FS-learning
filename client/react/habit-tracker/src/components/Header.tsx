import type { JSX } from "react";
import TargetDate from "./TargetDate";
export default function Header({
  title = "Daily View",
  child = false,
}: {
  title: string;
  child: boolean;
}): JSX.Element {
  const today: Date = new Date();
  return (
    <header className="flex  justify-between items-end p-2">
      <Title child={child} title={title}></Title>
      <TargetDate TargetDate={today}></TargetDate>
    </header>
  );
}
function Title({
  title = "Daily View",
  child = false,
}: {
  title: string;
  child: boolean;
}): JSX.Element {
  if (child) {
    return <div></div>;
  } else {
    return (
      <div className="flex flex-col gap-1">
        <h3 className="text-sm uppercase text-secondary font-medium mt-2">
          Current Perspective
        </h3>
        <h1 className="text-3xl font-bold ">{title}</h1>
      </div>
    );
  }
}
