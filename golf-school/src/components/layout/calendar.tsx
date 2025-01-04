import { useState } from "react";

export function Calendar() {
  const now = new Date();
  const [monthRange, setMonthRange] = useState<{ startDate: Date, endDate: Date }>({
    startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0)
  });
  const data = [
    {}
  ]
  return <div
    className="main-page">
    a
  </div>
}