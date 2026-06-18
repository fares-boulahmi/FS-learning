import type { JSX } from "react";
import calendar from "../assets/calendar.svg";

export default function TargetDate({
  TargetDate,
}: {
  TargetDate?: Date;
}): JSX.Element {
  let today = TargetDate;
  if (!today) {
    today = new Date();
  }
  // Date in dd/MM/yyyy format
  const formattedDate = today.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  // Day name
  const dayName = today.toLocaleDateString("en-US", {
    weekday: "long",
  });
  return (
    <div className="flex flex-row gap-1">
      <div className="flex flex-col items-end ">
        <h3 className="text-sm">{dayName}</h3>
        <div>{formattedDate}</div>
      </div>
      <img src={calendar} alt="Calendar" />
    </div>
  );
}
