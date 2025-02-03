
import { day, month, scheduleInputData } from "../../types/calendar";
export function SelectDateCalendar({ month, setInputData, dateArray, onCloseModal }
  : { month: month, setInputData: React.Dispatch<React.SetStateAction<scheduleInputData>>, dateArray:string[], onCloseModal:()=>void }) {
  const onClickEvent = (day: day) => {
    if (!day.isCurrentMonth) return
    setInputData(state => {
      let newDateArray: string[] = []
      if (state.dateArray.includes(day.date)) {
        newDateArray = state.dateArray.filter(d => d != day.date)
      } else {
        newDateArray = [...state.dateArray, day.date];
      }
      return { ...state, dateArray: newDateArray }
    });
  }
  return <div className="date-select-area">
    <div className="header">날짜 선택</div>
    <div className="calendar-grid">
      <div className="sunday day">일</div>
      <div className="day">월</div>
      <div className="day">화</div>
      <div className="day">수</div>
      <div className="day">목</div>
      <div className="day">금</div>
      <div className="day">토</div>
      {[...month.beforeMonthDayArray, ...month.currentMonthDayArray, ...month.nextMonthDayArray].map(
        (day, index) => (
          <div
            key={index}
            id={day.date.toString()}
            className={`calendar-date-container`}
            onClick={() => { onClickEvent(day) }}>
            <div className={`calendar-date-box ${day.isCurrentMonth ? "" : "not-current"}`}>
              <div className={`date-box ${day.isToday ? "current" : "not-current"}`}>
                {new Date(day.date).getDate()}
              </div>
              <div className={`multi-selected-box ${dateArray.includes(day.date) ? "select" : "not-select"}`}></div>
            </div>
          </div>
        )
      )}
    </div>
    <button onClick={() => {onCloseModal()}}>선택 완료</button>
  </div>
}