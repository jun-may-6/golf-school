import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../store";
import { month } from "../../types/calendar";
import { setDate } from "../../store/dateSlice";

export function Calendar({ monthData, isFullCalendar, setIsFullCalendar }: { monthData: month, isFullCalendar: boolean, setIsFullCalendar:React.Dispatch<React.SetStateAction<boolean>> }) {
  const dispatch = useAppDispatch();
  const date = useAppSelector(state => state.date)
  const scheduleData = useAppSelector(state => state.schedule)
  const getContrastTextColor = (color: string): string => {
    let r: number, g: number, b: number;
    const hex = color.replace("#", "");

    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    // W3C 명도 공식 적용 (올바르게 수정)
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    // HEX 코드 반환 (6자리 유지)
    return brightness > 125 ? "#2a2a2a" : "#e0e0e0";
  };
  return (
    <div className="calendar">
      <div className="calendar-header">
        {new Date(monthData.currentMonthDayArray[0].date).toLocaleString("default", { month: "long", year: "numeric" })}
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
          (day, index) => {
            return <div
              key={index}
              id={day.date}
              className={`calendar-date-container`}
              onClick={() => {
                setIsFullCalendar(false)
                if (day.isCurrentMonth) dispatch(setDate(day.date.toString()))
              }}>
              {/* 디버깅 필요 항목 */}
              <div className={`calendar-date-box ${day.isCurrentMonth ? "" : "not-current"} ${scheduleData.closed.some(c => {
                const parseC = new Date(c)
                const date = new Date(day.date)
                return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
              }) ? "closed" : ""
                }`}>
                <div className={`date-box ${day.isToday ? "current" : "not-current"}`}>
                  {new Date(day.date).getDate()}
                </div>
              </div>
              <div className={`selected-box ${day.date == date ? "select" : "not-select"}`}></div>
              <div className={`mini-calendar-schedule-grid ${isFullCalendar ? "full" : ""}`}>
                {scheduleData.schedule.filter(s => {
                  const parseC = new Date(s.date)
                  const date = new Date(day.date)
                  return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
                }).map(s => <div className="item" style={{ backgroundColor: s.color }}></div>)}
              </div>
              <div className={`full-calendar-schedule-grid ${isFullCalendar ? "full" : ""}`}>
                {scheduleData.schedule.filter(s => {
                  const parseC = new Date(s.date)
                  const date = new Date(day.date)
                  return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
                }).slice(0, 5)
                .map(s => <div className="item" style={{ backgroundColor: s.color, color: getContrastTextColor(s.color) }}>{s.title}</div>)}
              </div>
            </div>
          }
        )}
      </div>
    </div>
  );
}