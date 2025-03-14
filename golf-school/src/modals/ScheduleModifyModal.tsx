import { useEffect, useRef, useState } from "react";
import { member, schedule } from "../types/calendar";
import { Modal } from "./Modal";
import { ScheduleMemberSetModal } from "./ScheduleMemberSetModal";
import { userInfo } from "../types/user";
import { callApi, handleApiError } from "../apis/api";
import { useAppDispatch } from "../store";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";
import { getSchedule } from "../store/scheduleSlice";
import styles from "./modal.module.scss"
import classNames from "classnames/bind";
export function ScheduleModifyModal(
  {
    selectedSchedule,
    openViewModal,
    onClose
  }
    :
    {
      selectedSchedule: schedule | undefined;
      openViewModal: () => void;
      onClose: () => void;
    }
) {
  if (selectedSchedule == undefined) return
  const dispatch = useAppDispatch();
  const [isSetTime, setIsSetTime] = useState<boolean>(selectedSchedule.startTime != null && selectedSchedule.endTime != null);
  const [isOpenMemberModal, setIsOpenMemberModal] = useState<boolean>(false);
  const [userList, setUserList] = useState<userInfo[]>([]);
  useEffect(() => {
    const getScheduleMembers = async () => {
      try {
        dispatch(startGlobalLoading("회원 조회중"))
        const responseUserList = await callApi.get("/users")
        setUserList(responseUserList.data)
      } catch (e) {
        handleApiError(e)
      } finally {
        dispatch(endGlobalLoading())
      }
    }
    getScheduleMembers();
  }, [])
  const cx = classNames.bind(styles)


  const [modifyInput, setModifyInput] = useState<{
    id: number;
    title: string;
    description: string;
    date: string;
    startTime: string | null;
    endTime: string | null;
    color: string;
    isClosed: boolean;
    memberIdArray: string[]
  }>({
    id: selectedSchedule.id,
    title: selectedSchedule.title,
    description: selectedSchedule.description,
    date: selectedSchedule.date,
    startTime: selectedSchedule.startTime,
    endTime: selectedSchedule.endTime,
    color: selectedSchedule.color,
    isClosed: false,
    memberIdArray: selectedSchedule.memberList ? selectedSchedule.memberList.map(m => m.userId) : []
  });

  const onClickModifyButton = () => {
    const onClickFunction = async () => {
      try {
        dispatch(startGlobalLoading("수정중"))
        const response = await callApi.put("/schedules", modifyInput)
        dispatch(getSchedule())
        if (response.status == 200) {
          openViewModal()
          onClose()
        }
      } catch (e) {
        handleApiError(e)
      } finally {
        dispatch(endGlobalLoading())
      }
    }
    onClickFunction()
  }


  return <div className={cx("schedule-set-modal")}>
    <div className={cx("header")}>일정 수정</div>
    <div className={cx("contents")}>
      <div className={cx("set-schedule-input-area")}>
        <label>제목</label>
        <input
          placeholder="일정의 이름을 입력해주세요."
          value={modifyInput.title}
          onChange={(e) => { setModifyInput(state => { return { ...state, title: e.target.value } }) }} />
        <div className={cx("border")} />
        <label>설명</label>
        <textarea
          placeholder="일정에 대한 설명을 입력해주세요."
          value={modifyInput.description}
          onChange={(e) => { setModifyInput(state => { return { ...state, description: e.target.value } }) }} />
        <div className={cx("border")} />
        <div className={cx("title")}>
          <label>날짜 선택</label>
          <input
            type="date"
            value={modifyInput.date || ""}
            onChange={(e) => {
              setModifyInput(state => ({ ...state, date: e.target.value }))
            }}
          />
        </div>
        <div className={cx("border")} />
        <div className={cx("title")}>
          <label>인원 선택</label>
          <img src="user.png" onClick={() => { setIsOpenMemberModal(true) }} />
        </div>
        <div className={cx("member-preview")}>
          {userList.filter(u => modifyInput.memberIdArray.includes(u.userId)).map(user => {
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
            memberIdArray={modifyInput.memberIdArray}
            setMemberIdArray={(idArray: string[]) => { setModifyInput(state => ({ ...state, memberIdArray: idArray })) }}
            userList={userList}
            onClose={() => { setIsOpenMemberModal(false) }}
          />
        </Modal>
        <div className={cx("border")} />
        <div className={cx("title")}>
          <label>시간 설정</label>
          <input type="checkBox"
            defaultChecked={isSetTime}
            onChange={(e) => {
              if (e.target.checked) {
                setIsSetTime(true)
                setModifyInput(state => {
                  if (selectedSchedule.startTime != null && selectedSchedule.endTime != null) {
                    return {
                      ...state,
                      startTime: selectedSchedule.startTime, endTime: selectedSchedule.endTime
                    }
                  }
                  const current = new Date();
                  const time = `${current.getHours() > 9 ? current.getHours() : "0" + current.getHours()}:${current.getMinutes() > 9 ? current.getMinutes() : "0" + current.getMinutes()}`
                  return {
                    ...state,
                    startTime: time, endTime: time
                  }
                })
              } else {
                setIsSetTime(false)
                setModifyInput(state => { return { ...state, startTime: null, endTime: null } })
              }
            }} />
        </div>
        <div className={cx(`time-set-area`, { on: isSetTime })}>
          <input
            type="time"
            value={modifyInput.startTime || ""}
            onChange={(e) => {
              if (!(modifyInput.startTime && modifyInput.endTime)) return
              if (e.target.value > modifyInput.endTime) {
                setModifyInput(state => ({ ...state, startTime: e.target.value, endTime: e.target.value }));
              } else {
                setModifyInput(state => ({ ...state, startTime: e.target.value }))
              }
            }}
          /> ~
          <input
            type="time"
            value={modifyInput.endTime || ""}
            onChange={(e) => {
              if (!(modifyInput.endTime && modifyInput.startTime)) return
              if (e.target.value > modifyInput.startTime) {
                setModifyInput(prev => ({ ...prev, endTime: e.target.value }));
              } else {
                setModifyInput(prev => ({ ...prev, startTime: e.target.value, endTime: e.target.value }))
              }
            }}
          />
        </div>
        <div className={cx("border")} />
        <div className={cx("title")}>
          <label>휴일 등록</label>
          <input type="checkbox"
            checked={modifyInput.isClosed}
            onClick={(e) => {
              setModifyInput(state => {
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
            value={modifyInput.color}
            onChange={(e) => {
              setModifyInput(state => { return { ...state, color: e.target.value } })
            }} />
        </div>
      </div>
    </div>
    <div className={cx("button-area")}>
      <button className={cx("cancel")}
        onClick={() => {
          onClose()
          openViewModal()
        }}>취소</button>
      <button
        disabled={!(modifyInput.title != "" &&
          modifyInput.description != "")}
        onClick={onClickModifyButton}
      >수정</button>
    </div>
  </div>
}