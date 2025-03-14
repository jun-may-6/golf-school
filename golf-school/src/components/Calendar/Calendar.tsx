import { useAppDispatch, useAppSelector } from "../../store";
import { month } from "../../types/calendar";
import { setDate } from "../../store/dateSlice";
import styles from "./calendar.module.scss"
import classNames from "classnames/bind";

export function Calendar({ monthData, isFullCalendar, setIsFullCalendar }: { monthData: month, isFullCalendar: boolean, setIsFullCalendar: React.Dispatch<React.SetStateAction<boolean>> }) {
  const cx = classNames.bind(styles)
  const dispatch = useAppDispatch();
  const date = useAppSelector(state => state.date)
  const scheduleData = useAppSelector(state => state.schedule)
  const getContrastTextColor = (color: string): string => {
    let r: number, g: number, b: number;
    const hex = color.replace("#", "");

    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);

    const brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness > 125 ? "#2a2a2a" : "#e0e0e0";
  };
  return (
    <div className={cx("container")}>
      <div className={cx("header", { full: isFullCalendar })}>
        {new Date(monthData.currentMonthDayArray[0].date).toLocaleString("default", { month: "long", year: "numeric" })}
      </div>

      <div className={cx("calendar")}>
        <div className={cx("sunday", "day")}>일</div>
        <div className={cx("day")}>월</div>
        <div className={cx("day")}>화</div>
        <div className={cx("day")}>수</div>
        <div className={cx("day")}>목</div>
        <div className={cx("day")}>금</div>
        <div className={cx("day")}>토</div>
        {[...monthData.beforeMonthDayArray, ...monthData.currentMonthDayArray, ...monthData.nextMonthDayArray].map(
          (day, index) => {
            return <div className={cx("date-container")} key={day.date}>
              <div className={cx("selected-box", { select: day.date == date })}/>
              <div
                key={index}
                id={day.date}
                className={cx("date-cell", { 'not-current': !day.isCurrentMonth })}
                onClick={() => {
                  setIsFullCalendar(false)
                  if (day.isCurrentMonth) dispatch(setDate(day.date.toString()))
                }}>
                {/* 디버깅 필요 항목 */}
                <div className={cx("date-box", {
                  closed: scheduleData.closed.some(c => {
                    const parseC = new Date(c)
                    const date = new Date(day.date)
                    return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
                  })
                })}>
                  <div className={cx("date-header", { current: day.isToday })}>
                    {new Date(day.date).getDate()}
                  </div>
                </div>
                <div className={cx(`mini-schedule-container`, isFullCalendar ? "full" : "mini")}>
                  {scheduleData.schedule.filter(s => {
                    const parseC = new Date(s.date)
                    const date = new Date(day.date)
                    return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
                  }).map(s => <div key={s.id} className={cx("schedule")} style={{ backgroundColor: s.color }}></div>)}
                </div>
                <div className={cx(`full-schedule-container`, isFullCalendar ? "full" : "mini")}>
                  {scheduleData.schedule.filter(s => {
                    const parseC = new Date(s.date)
                    const date = new Date(day.date)
                    return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
                  }).slice(0, 5)
                    .map(s => <div key={s.id} className={cx("schedule")} style={{ backgroundColor: s.color, color: getContrastTextColor(s.color) }}>{s.title}</div>)}
                </div>
              </div>
            </div>
          }
        )}
      </div>
    </div>
  );
}