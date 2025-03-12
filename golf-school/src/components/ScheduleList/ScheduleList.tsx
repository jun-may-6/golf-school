import { useNavigate } from "react-router-dom";
import { schedule } from "../../types/calendar"
import styles from "./scheduleList.module.scss"
import classNames from "classnames/bind";
export function ScheduleList({ scheduleData, onClickSchedule }: { scheduleData: schedule[], onClickSchedule:(id:number)=>void }) {
  return <>
    {scheduleData.map((schedule, index, arr) => {
      const cx = classNames.bind(styles);
      // startTime이 존재하는 첫 번째 일정 찾기
      const firstScheduleWithTime = arr.find(s => s.startTime != null);
      // startTime이 존재하는 마지막 일정 찾기
      const lastScheduleWithTime = [...arr].reverse().find(s => s.startTime != null);

      const isFirst = schedule === firstScheduleWithTime;
      const isLast = schedule === lastScheduleWithTime;

      return (
        <div key={index} className={cx("schedule-box")}
          onClick={() => {
            onClickSchedule(schedule.id)
          }}>
          <div className={cx("timeline")}>
            <div className={cx("border", {start: isFirst, end: isLast, "not-continuous": !schedule.startTime})}/>
            <div className={cx("color")} style={{ backgroundColor: schedule.color }} />
          </div>
          <div className={cx("title-area")}>
            <div className={cx("title")}>{schedule.title}</div>
            <div className={cx("description")}>{schedule.description}</div>
          </div>
          <div className={cx("timezone")}>
            <div className={cx("time")}>
              {schedule.startTime != null && schedule.endTime != null
                ? `${schedule.startTime.split(":").slice(0, 2).join(":")}~${schedule.endTime.split(":").slice(0, 2).join(":")}`
                : ``}
            </div>
          </div>
        </div>
      );
    }
    )}
  </>
}