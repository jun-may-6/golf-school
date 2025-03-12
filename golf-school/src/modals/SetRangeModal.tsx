import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { getSchedule, setMonthRange } from "../store/scheduleSlice";
import classNames from "classnames/bind";
import styles from "./modal.module.scss";

const cx = classNames.bind(styles);

export function SetRangeModal() {
  const dispatch = useAppDispatch();
  const monthRange = { startDate: useAppSelector(state => state.schedule.startDate), endDate: useAppSelector(state => state.schedule.endDate) };
  const [preparedMonthRange, setPreparedMonthRange] = useState<{ startDate: string, endDate: string }>({
    startDate: monthRange.startDate,
    endDate: monthRange.endDate
  });
  function setScheduleModal(arg0: (state: any) => any) {
    throw new Error("Function not implemented.");
  }

  return  <div className={cx("range-modal")}>
    <div className={cx("header")}>조회 기간</div>
    <div className={cx("contents")}>
      <input type="month"
        value={preparedMonthRange.startDate.slice(0, 7) || ""}
        onChange={(e) => {
          if (preparedMonthRange.endDate && preparedMonthRange.endDate < e.target.value) {
            setPreparedMonthRange({ startDate: e.target.value + "-01", endDate: e.target.value + "-01" });
          } else {
            setPreparedMonthRange(state => ({ ...state, startDate: e.target.value + "-01" }));
          }
        }}
      />
      ~
      <input type="month"
        value={preparedMonthRange.endDate.slice(0, 7) || ""}
        onChange={(e) => {
          if (preparedMonthRange.startDate && preparedMonthRange.startDate > e.target.value) {
            setPreparedMonthRange({ startDate: e.target.value + "-01", endDate: e.target.value + "-01" });
          } else {
            setPreparedMonthRange(state => ({ ...state, endDate: e.target.value + "-01" }));
          }
        }}
      />
    </div>
    <div className={cx("button-area")}>
      <button className={cx("cancel")}>취소</button>
      <button className={cx("register")}
        onClick={() => {
          dispatch(setMonthRange({ startDate: preparedMonthRange.startDate, endDate: preparedMonthRange.endDate }));
          dispatch(getSchedule());
          setScheduleModal(state => ({ ...state, range: false }));
        }}
      >조회</button>
    </div>
  </div>;
}
