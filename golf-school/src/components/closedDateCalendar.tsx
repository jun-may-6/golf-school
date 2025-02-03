
import { useEffect, useState } from "react";
import { day, month, scheduleInputData } from "../types/calendar";
import { callApi } from "../apis/api";
export function ClosedDateCalendar({ month, closedArray, refreshSchedule, closeModal }
  : { month: month, closedArray:string[], refreshSchedule:() => Promise<void>, closeModal: ()=>void }) {
  const [dateArray, setDateArray] = useState<string[]>([]);
  const onClickEvent = async () => {
    try {
      const parsedClosedDate = closedArray.map(d=> new Date(d).toISOString().split("T")[0])
      const insertList = dateArray
      const deleteList = parsedClosedDate.filter(d=> !dateArray.includes(d))
      const response = await callApi.post("schedules/closed", {insertList:insertList, deleteList:deleteList})
      if(response.status == 200) {
        await refreshSchedule()
        alert("휴일 업데이트 완료")
        closeModal()
      }
    } catch {
      alert("휴일 업데이트 실패.")
    }
  }
  useEffect(() => {
    if (!month || !closedArray || !refreshSchedule || !closeModal) return
    setDateArray(closedArray.map(d=>new Date(d).toISOString().split("T")[0]));
    return () => {
      setDateArray([])
    }
  }, [])
  return <>
    <div className="calendar-grid">
      <div className="sunday day">일</div>
      <div className="day">월</div>
      <div className="day">화</div>
      <div className="day">수</div>
      <div className="day">목</div>
      <div className="day">금</div>
      <div className="day">토</div>
      {[...month.beforeMonthDayArray, ...month.currentMonthDayArray, ...month.nextMonthDayArray].map(
        (day, index) => {
          const d = new Date(day.date)
          const date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
          const isClosed = dateArray.includes(date)
          return <div
            key={index}
            id={day.date.toString()}
            className={`calendar-date-container`}
            onClick={() => { 
              if(!day.isCurrentMonth) return
              setDateArray(state=>{
              if(state.includes(date)) {
                return state.filter(d=> d != date)
              } else {
                return [...state, date]
              }
            })}}>
            <div className={`calendar-date-box ${day.isCurrentMonth ? "" : "not-current"} ${isClosed?"closed":""}`}>
              <div className={`date-box ${day.isToday ? "current" : "not-current"}`}>
                {new Date(day.date).getDate()}
              </div>
            </div>
          </div>
        }
      )}
    </div>
    <div className="button-area">
    <button className="cancel" onClick={closeModal}>취소</button>
    <button onClick={onClickEvent}>휴일 등록</button>
    </div>
  </>
}