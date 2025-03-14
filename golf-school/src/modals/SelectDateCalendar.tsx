import modalStyles from "./modal.module.scss"
import calendarStyles from "./selectDateCalendar.module.scss"
import { day, month, scheduleInputData } from "../types/calendar";
import classNames from "classnames/bind";
import { useAppSelector } from "../store";
export function SelectDateCalendar({ month, setInputData, dateArray, onCloseModal }
  : { month: month, setInputData: React.Dispatch<React.SetStateAction<scheduleInputData>>, dateArray: string[], onCloseModal: () => void }) {
  const modalStyle = classNames.bind(modalStyles);
  const calendarStyle = classNames.bind(calendarStyles);
  const scheduleData = useAppSelector(state => state.schedule)
  const onClickEvent = (day: day) => {
    if (!day.isCurrentMonth) return
    setInputData(state => {
      let newDateArray: string[] = []
      if (state.dateArray.includes(day.date)) {
        newDateArray = state.dateArray.filter(d => d != day.date)
      } else {
        newDateArray = [...state.dateArray, day.date];
      }
      newDateArray.sort((a, b)=>(a > b ? 1 : -1))
      return { ...state, dateArray: newDateArray }
    });
  }
  return <div className={modalStyle("date-select-modal")}>
    <div className={modalStyle("header")}>날짜 선택</div>
    <div className={modalStyle("contents")}>
      <div className={calendarStyle("calendar-grid")}>
        <div className={calendarStyle("sunday", "day")}>일</div>
        <div className={calendarStyle("day")}>월</div>
        <div className={calendarStyle("day")}>화</div>
        <div className={calendarStyle("day")}>수</div>
        <div className={calendarStyle("day")}>목</div>
        <div className={calendarStyle("day")}>금</div>
        <div className={calendarStyle("day")}>토</div>
        {[...month.beforeMonthDayArray, ...month.currentMonthDayArray, ...month.nextMonthDayArray].map(
          (day, index) => (
            <div
              key={index}
              id={day.date.toString()}
              className={calendarStyle(`date-cell`, { "not-current": !day.isCurrentMonth })}
              onClick={() => { onClickEvent(day) }}>
              <div className={calendarStyle("date-box", { closed: scheduleData.closed.some(c => {
                  const parseC = new Date(c)
                  const date = new Date(day.date)
                  return `${parseC.getFullYear()}/${parseC.getMonth()}/${parseC.getDate()}` === `${date.getFullYear()}/${date.getMonth()}/${date.getDate()}`
                })})}>
                <div className={calendarStyle("date", { current: day.isToday })}>
                  {new Date(day.date).getDate()}
                </div>
                <div className={calendarStyle("select-box", { select: dateArray.includes(day.date) })}></div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
    <div className={modalStyle("button-area")}>
      <button onClick={() => { onCloseModal() }}>선택 완료</button>
    </div>
  </div>
}