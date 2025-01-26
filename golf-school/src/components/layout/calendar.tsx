import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { month } from "../../types/calendar";
import { setDate } from "../../store/dateSlice";

export function Calendar({ monthData }: { monthData: month }) {
  const dispatch = useAppDispatch();
  const date = useAppSelector(state => state.date)
  return (
    <div className="calendar">
      <div className="calendar-header">
        {monthData.currentMonthDayArray[0].date.toLocaleString("default", { month: "long", year: "numeric" })}
      </div>
      <div className="calendar-grid">
        <div className="sunday day">일</div>
        <div className="day">월</div>
        <div className="day">화</div>
        <div className="day">수</div>
        <div className="day">목</div>
        <div className="day">금</div>
        <div className="day">토</div>
        {[...monthData.beforeMonthDayArray, ...monthData.currentMonthDayArray, ...monthData.nextMonthDayArray].map(
          (day, index) => (
            <div
              key={index}
              id={day.date.toString()}
              className={`calendar-date-container`}
              onClick={() => {
                if(day.isCurrentMonth) dispatch(setDate(day.date.toString()))
              }}>
              <div className={`calendar-date-box ${day.isCurrentMonth?"":"not-current"}`}>
                <div className={`date-box ${day.isToday ? "current" : "not-current"}`}>
                  {day.date.getDate()}
                </div>
              </div>
              <div className={`selected-box ${day.date.toString() == date ? "select" : "not-select"}`}></div>
            </div>
          )
        )}
      </div>
    </div>
  );
}