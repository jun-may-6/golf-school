import { useState } from "react";
import { day, month } from "../types/calendar";
import { useAppDispatch, useAppSelector } from "../store";
import { addSelectedDate, dateToggle } from "../store/selectedDateSlice";

export function SelectDateCalendar({scheduleData, month}:{scheduleData:any, month:month}){
  const dispatch = useAppDispatch();
  const selectedDate = useAppSelector(state=>state.selectedDate)
  const onClickEvent = (day:day) => {
    if(!day.isCurrentMonth) return 
    const date = day.date
    dispatch(dateToggle(date.toString()))
  }
  return <div className="date-select-">
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
                onClick={() => {onClickEvent(day)}}>
                <div className={`calendar-date-box ${day.isCurrentMonth?"":"not-current"}`}>
                  <div className={`date-box ${day.isToday ? "current" : "not-current"}`}>
                    {day.date.getDate()}
                  </div>
                <div className={`multi-selected-box ${selectedDate.includes(day.date.toString()) ? "select" : "not-select"}`}></div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
}