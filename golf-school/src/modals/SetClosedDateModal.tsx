
import { useEffect, useState } from "react";
import { day, month, scheduleInputData } from "../types/calendar";
import { callApi } from "../apis/api";
import { useAppDispatch } from "../store";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";
import styles from "./modal.module.scss"
import calendarStyles from "./selectDateCalendar.module.scss"
import classNames from "classnames/bind";
export function SetClosedDateModal({ month, closedArray, refreshSchedule, closeModal }
  : { month: month, closedArray: string[], refreshSchedule: () => Promise<void>, closeModal: () => void }) {
  const [dateArray, setDateArray] = useState<string[]>([]);
  const dispatch = useAppDispatch();
  const calendarStyle = classNames.bind(calendarStyles);
  const cx = classNames.bind(styles);
  const onClickEvent = async () => {
    try {
      dispatch(startGlobalLoading("등록중"))
      const parsedClosedDate = closedArray.map(d => new Date(d).toISOString().split("T")[0])
      const insertList = dateArray
      const deleteList = parsedClosedDate.filter(d => !dateArray.includes(d))
      const response = await callApi.post("schedules/closed", { insertList: insertList, deleteList: deleteList })
      if (response.status == 200) {
        await refreshSchedule()
        alert("휴일 업데이트 완료")
        closeModal()
      }
    } catch {
      alert("휴일 업데이트 실패.")
    } finally {
      dispatch(endGlobalLoading())
    }
  }
  useEffect(() => {
    if (!month || !closedArray || !refreshSchedule || !closeModal) return
    setDateArray(closedArray.map(d => new Date(d).toISOString().split("T")[0]));
    return () => {
      setDateArray([])
    }
  }, [])
  return <div className={cx("set-closed-date-modal")}>
    <div className={cx("header")}>휴일 지정</div>
    <div className={cx("contents")}>
      <div className={calendarStyle("calendar-grid")}>
        <div className={calendarStyle("sunday", "day")}>일</div>
        <div className={calendarStyle("day")}>월</div>
        <div className={calendarStyle("day")}>화</div>
        <div className={calendarStyle("day")}>수</div>
        <div className={calendarStyle("day")}>목</div>
        <div className={calendarStyle("day")}>금</div>
        <div className={calendarStyle("day")}>토</div>
        {[...month.beforeMonthDayArray, ...month.currentMonthDayArray, ...month.nextMonthDayArray].map(
          (day, index) => {
            const d = new Date(day.date)
            const date = `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
            const isClosed = dateArray.includes(date)
            return <div
              key={index}
              id={day.date.toString()}
              className={calendarStyle(`date-cell`, { "not-current": !day.isCurrentMonth })}
              onClick={() => {
                if (!day.isCurrentMonth) return
                setDateArray(state => {
                  if (state.includes(date)) {
                    return state.filter(d => d != date)
                  } else {
                    return [...state, date]
                  }
                })
              }}>
              <div className={calendarStyle("date-box", {
                closed: isClosed
              })}>
                <div className={calendarStyle("date", { current: day.isToday })}>
                  {new Date(day.date).getDate()}
                </div>
                <div className={calendarStyle("select-box", { select: dateArray.includes(day.date) })}></div>
              </div>
            </div>
          }

        )}
      </div>
    </div>
    <div className={cx("button-area")}>
      <button className={cx("cancel")} onClick={closeModal}>취소</button>
      <button onClick={onClickEvent}>등록</button>
    </div>
  </div>
}