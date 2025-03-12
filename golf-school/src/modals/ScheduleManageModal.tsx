import classNames from "classnames/bind";
import styles from "./modal.module.scss";

export function ScheduleManageModal(
  { month, setScheduleModal }:
    {
      month: number, setScheduleModal: React.Dispatch<React.SetStateAction<{
        select: boolean;
        class: boolean;
        range: boolean;
        schedule: boolean;
        attendance: boolean;
        closed: boolean;
        modify: boolean;
      }>>
    }
) {
  const cx = classNames.bind(styles);
  return <div className={cx("manage-modal")}>
    <div className={cx("header")}>{month}월 일정 추가</div>
    <div className={cx("contents")}>
      <div className={cx("select-box")} onClick={() => {
        setScheduleModal(state => { return { ...state, select: false, class: true } })
      }}>
        <div className={cx("item")}>
          <img src="icon/schedule.png"></img>
        <div className={cx("message")}>일정 등록</div>
        </div>
      </div>
      <div className={cx("select-box")} onClick={() => {
        setScheduleModal(state => ({ ...state, closed: true, select: false }))
      }}>
        <div className={cx("item")}>
          <img src="icon/closed.png"></img>
        <div className={cx("message")}>휴일 등록</div>  
        </div>
      </div>
    </div>
  </div>
}
