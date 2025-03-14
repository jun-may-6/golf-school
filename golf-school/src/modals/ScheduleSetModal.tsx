import { useEffect, useState } from "react";
import { month, schedule, scheduleInputData } from "../types/calendar";
import { SelectDateCalendar } from "./SelectDateCalendar";
import { Modal } from "./Modal";
import { userInfo } from "../types/user";
import { callApi } from "../apis/api";
import { useAppDispatch } from "../store";
import { setSchedule } from "../store/scheduleSlice";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";
import { ScheduleMemberSetModal } from "./ScheduleMemberSetModal";
import styles from "./modal.module.scss"
import classNames from "classnames/bind";
export function ScheduleSetModal({ closeModalFunction, month, monthRange }: { closeModalFunction: () => void, month: month, monthRange: { startDate: string, endDate: string } }) {
  const cx = classNames.bind(styles);
  const dispatch = useAppDispatch();
  const [inputData, setInputData] = useState<scheduleInputData>({
    title: "",
    description: "",
    dateArray: [],
    startTime: null,
    endTime: null,
    isClosed: false,
    color: "#aadaba",
    memberIdArray: []
  });
  const [userList, setUserList] = useState<userInfo[]>([]);
  useEffect(() => {
    const getUserList = async () => {
      const response = await callApi("/users")
      setUserList(response.data)
    }
    try {
      getUserList()
    } catch {
      console.log("api호출 실패")
    }
  }, [])


  const [isSetTime, setIsSetTime] = useState<boolean>(false);
  const [isOpenCalendar, setIsOpenCalendar] = useState<boolean>(false);
  const [isOpenMemberModal, setIsOpenMemberModal] = useState<boolean>(false);

  const registerButtonHandler = async () => {
    const refreshScheduleData = async () => {
      const response = await callApi.get(`/schedules?startDate=${monthRange.startDate}&endDate=${monthRange.endDate}`)
      dispatch(setSchedule(response.data))
    }
    try {
      dispatch(startGlobalLoading("등록중.."))
      const response = await callApi.post("/schedules", inputData)
      if (response.status == 200) {
        refreshScheduleData();
        alert("등록 성공")
        closeModalFunction();
      }
    } catch (e) {
      alert("에러 발생" + e)
    } finally {
      dispatch(endGlobalLoading())
    }
  }

  return <div className={cx("schedule-set-modal")}>
    <div className={cx("header")}>{new Date(month.currentMonthDayArray[0].date).getMonth() + 1}월 일정 등록</div>
    <div className={cx("contents")}>
      <div className={cx("title")}>
        <label>제목</label>
      </div>
      <input placeholder="일정의 이름을 입력해주세요." onChange={(e) => { setInputData(state => { return { ...state, title: e.target.value } }) }} />
      <div className={cx("border")} />
      <div className={cx("title")}>
      <label>설명</label>
      </div>
      <textarea placeholder="일정에 대한 설명을 입력해주세요." onChange={(e) => { setInputData(state => { return { ...state, description: e.target.value } }) }} />
      <div className={cx("border")} />
      <div className={cx("title")}>
        <label>날짜 선택</label>
        <img src="calendar.png" onClick={() => { setIsOpenCalendar(true) }} />
      </div>
      <div className={cx("date-preview")}>
      {inputData.dateArray.map(d=>{
        const date = new Date(d)
        return <div className={cx("date")} key={d}>{date.getFullYear() + "년 " + (date.getMonth() + 1) + "월 " + date.getDate()+"일"}</div>
        })}
      </div>
      <Modal isOpen={isOpenCalendar} onRequestClose={() => { setIsOpenCalendar(false) }}>
        <SelectDateCalendar month={month} setInputData={setInputData} dateArray={inputData.dateArray} onCloseModal={() => { setIsOpenCalendar(false) }} />
      </Modal>
      <div className={cx("border")} />
      <div className={cx("title")}>
        <label>인원 선택</label>
        <img src="user.png" onClick={() => { setIsOpenMemberModal(true) }} />
      </div>
      <div className={cx("member-preview")}>
            {userList.filter(u => inputData.memberIdArray.includes(u.userId)).map(user => {
              const profileImage = user.gender == '여' ? "icon/female.png" : "icon/male.png";
              const birthday = new Date(user.birthday);
              return (
                <div key={user.userId} className={cx("profile")}>
                  <div className={cx("icon")}>
                    <img src={profileImage} />
                  </div>
                  <div className={cx("name-area")}>
                    <div className={cx("name")}>{user.name}</div>
                    <div className={cx("birthday")}>{`${birthday.getFullYear()}.${birthday.getMonth() + 1}.${birthday.getDate()}`}</div>
                  </div>
                </div>
              );
            })}
          </div>
      <Modal isOpen={isOpenMemberModal} onRequestClose={() => { setIsOpenMemberModal(false) }}>
        <ScheduleMemberSetModal
          memberIdArray={inputData.memberIdArray}
          setMemberIdArray={(idArray: string[]) => { setInputData(state => ({ ...state, memberIdArray: idArray })) }}
          userList={userList}
          onClose={() => { setIsOpenMemberModal(false) }}
        />
      </Modal>
      <div className={cx("border")} />
      <div className={cx("title")}>
        <label>시간 설정</label>
        <input type="checkBox"
          onChange={(e) => {
            if (e.target.checked) {
              setIsSetTime(true)
              setInputData(state => {
                const current = new Date();
                const time = `${current.getHours() > 9 ? current.getHours() : "0" + current.getHours()}:${current.getMinutes() > 9 ? current.getMinutes() : "0" + current.getMinutes()}`
                return {
                  ...state,
                  startTime: time, endTime: time
                }
              })
            } else {
              setIsSetTime(false)
              setInputData(state => { return { ...state, startTime: null, endTime: null } })
            }
          }} />
      </div>
      <div className={cx(`time-set-area`, {on:isSetTime})}>
        <input
          type="time"
          value={inputData.startTime || ""}
          onChange={(e) => {
            if (!(inputData.startTime && inputData.endTime)) return
            if (e.target.value > inputData.endTime) {
              setInputData(state => ({ ...state, startTime: e.target.value, endTime: e.target.value }));
            } else {
              setInputData(state => ({ ...state, startTime: e.target.value }))
            }
          }}
        /> ~
        <input
          type="time"
          value={inputData.endTime || ""}
          onChange={(e) => {
            if (!(inputData.endTime && inputData.startTime)) return
            if (e.target.value > inputData.startTime) {
              setInputData(prev => ({ ...prev, endTime: e.target.value }));
            } else {
              setInputData(prev => ({ ...prev, startTime: e.target.value, endTime: e.target.value }))
            }
          }}
        />
      </div>
      <div className={cx("border")} />
      <div className={cx("title")}>
        <label>휴일 등록</label>
        <input type="checkbox"
          checked={inputData.isClosed}
          onClick={(e) => {
            setInputData(state => {
              return { ...state, isClosed: !state.isClosed }
            })
          }}
          onChange={() => { }}
        />
      </div>
      <div className={cx("border")} />
      <div className={cx("title")}>
        <label>색상</label>
        <input type="color"
          value={inputData.color}
          onChange={(e) => {
            setInputData(state => { return { ...state, color: e.target.value } })
          }} />
      </div>
    </div>
    <div className={cx("button-area")}>
      <button className={cx("cancel")}
        onClick={closeModalFunction}>취소</button>
      <button

        disabled={!(inputData.title != "" &&
          inputData.description != "" &&
          inputData.dateArray.length != 0)}
        onClick={registerButtonHandler}
      >등록</button>
    </div>
  </div>
}