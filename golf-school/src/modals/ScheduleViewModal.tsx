import { useEffect, useState } from "react"
import { member, schedule } from "../types/calendar"
import { callApi, handleApiError } from "../apis/api";
import { useAppDispatch, useAppSelector } from "../store";
import { getSchedule, setScheduleMember } from "../store/scheduleSlice";
import { endGlobalLoading, startGlobalLoading } from "../store/globalLoadingSlice";
import { FitLoading } from "../components/FitLoading/FitLoading";
import { ScheduleComment } from "../components/ScheduleComment/ScheduleComment";
import { Modal } from "./Modal";
import styles from "./modal.module.scss";
import classNames from "classnames/bind";
export function ScheduleViewModal({ selectedSchedule, openModifyModal, onClose }:
  {
    selectedSchedule: schedule | undefined,
    openModifyModal: () => void,
    onClose: () => void
  }) {
  const cx = classNames.bind(styles);
  if (selectedSchedule == undefined) return
  const dispatch = useAppDispatch();
  const getScheduleMember = async () => {
    try {
      const response = await callApi.get(`schedules/${selectedSchedule.id}/members`)
      dispatch(setScheduleMember({ scheduleId: selectedSchedule.id, memberList: response.data }))
    } catch (e) {
      handleApiError(e)
    }
  }
  useEffect(() => {
    getScheduleMember();
  }, [])
  const userInfo = useAppSelector(state => state.userInfo);
  const [attendanceInput, setAttendanceInput] = useState<{ order: string, message: string, scheduleMemberId: number }>({ order: "absence", message: "", scheduleMemberId: 0 });
  const [attendanceModal, setAttendanceModal] = useState<boolean>(false);
  const cancelAbsence = async (id: number) => {
    if (!confirm("결석을 취소하시겠습니까?")) return
    try {
      dispatch(startGlobalLoading("취소중"))
      const response = await callApi.post("/schedules/absence", { order: 'cancel', message: "", scheduleMemberId: id })
      if (response.status == 200) {
        getScheduleMember()
        alert("결석 취소 완료")
        setAttendanceModal(false)
      }
    } catch (e) {
      handleApiError(e)
    } finally {
      dispatch(endGlobalLoading())
    }
  }
  const deleteSchedule = async (scheduleId: number) => {
    if (!confirm("삭제하시겠습니까?")) return
    try {
      dispatch(startGlobalLoading("삭제중..."))
      const result = await callApi.delete("/schedules/" + scheduleId)
      dispatch(getSchedule())
      onClose()
      alert("삭제 완료")
    } catch {
      alert("삭제 실패")
    } finally {
      dispatch(endGlobalLoading())
    }
  }
  const absenceRequest = async () => {
    if (!confirm("결석을 신청하시겠습니까?")) return
    try {
      dispatch(startGlobalLoading("신청중"))
      const response = await callApi.post("/schedules/absence", attendanceInput)
      if (response.status == 200) {
        getScheduleMember();
        alert("결석 신청 완료")
        setAttendanceModal(false)
      }
    } catch {
      alert("결석일 등록 실패")
    } finally {
      dispatch(endGlobalLoading())
    }
  }
  return <>
    <div className={cx("schedule-view-modal")}>
      <div className={cx("header")}>
        {selectedSchedule.title}
      </div>
      <div className={cx("sub-header")}>{selectedSchedule.date.split('T')[0]}</div>
      <div className={cx("contents")}>
        <div className={cx("title")}>
          <label>일정 설명</label>
        </div>
        <div className={cx("description")}>
          {selectedSchedule.description}
        </div>
        <div className={cx("border")} />
        {<>
          <div className={cx("title")}>
            <label>출석 인원 {selectedSchedule.memberList == null ?
              <FitLoading />
              : `(${selectedSchedule.memberList.length - selectedSchedule.memberList.filter(m => !m.attendance).length} / ${selectedSchedule.memberList.length})`}</label>
          </div>
          {selectedSchedule.memberList != null &&
            <div className={cx("description")}>
              {selectedSchedule.memberList.map(m => {
                const profileImage = m.gender == "남" ? "icon/male.png" : "icon/female.png"
                return <> <div className={cx("member")}>
                  <img src={profileImage} />
                  <div className={cx("name")}>
                    {m.name}
                    <div className={cx("attendance")}>
                      {m.attendance ? "" : "(결석)"}
                    </div>
                  </div>
                  <div className={cx("reason")}>
                    {m.absenceReason ? <div className={cx("message")}>{m.absenceReason}</div> : null}
                    {userInfo.userId == m.userId &&
                      m.attendance ?
                      <button className={cx("btn")} style={{ marginLeft: "auto" }}
                        onClick={() => {
                          setAttendanceModal(true)
                          setAttendanceInput(state => ({ ...state, message: "", scheduleMemberId: m.id }))
                        }}>결석</button> :
                      userInfo.userId == m.userId &&
                        !m.attendance &&
                        !m.absenceReason ?
                        <button className={cx("btn")} style={{ marginLeft: "auto" }}
                          onClick={() => cancelAbsence(m.id)}>취소</button>
                        : null}
                  </div>
                </div>
                  {userInfo.userId == m.userId &&
                    !m.attendance &&
                    m.absenceReason ?
                    <button className={cx("cancel-btn")} onClick={() => cancelAbsence(m.id)}>취소</button>
                    : null}
                    </>
              })}
            </div>
          }
        </>
        }
        <ScheduleComment schedule={selectedSchedule} />
      </div>
      <div className={cx(`button-area`)}>
        <button className={cx("cancel")}
          onClick={onClose}>닫기</button>
        {userInfo.accessLevel == "ADMIN" ?
          <>
            <button
              onClick={() => {
                openModifyModal()
                onClose()
              }}>
              수정
            </button>
            <button className={cx("delete")}
              onClick={() => {
                deleteSchedule(selectedSchedule.id)
              }}>삭제</button>
          </>
          : null}
      </div>
    </div>
    <Modal
      isOpen={attendanceModal}
      onRequestClose={() => { setAttendanceModal(false) }}>
      <div className={cx("attendance-modal")}>
        <div className={cx("header")}>결석 처리</div>
        <div className={cx("contents")}>
          <div className={cx("title")}>
            <label>일정 이름</label>
          </div>
          <div className={cx("description")}>{selectedSchedule.title}</div>
          <div className={cx("title")}>
            <label>일자</label>
          </div>
          <div className={cx("description")}>{`${new Date(selectedSchedule.date).getFullYear()}
        ${new Date(selectedSchedule.date).getMonth() + 1}/
        ${new Date(selectedSchedule.date).getDate()}`}</div>
          <div className={cx("title")}>
            <label>사유</label>
          </div>
          <div className={cx("description")}>
            <input className={cx("input")} placeholder="간단한 사유를 입력해주세요." type="text"
            value={attendanceInput.message}
              onChange={(e) => { setAttendanceInput(state => ({ ...state, message: e.target.value })) }} />
          </div>
          <div>
          </div>
          <div></div>
        </div>
        <div className={cx("button-area")}>
          <button className={cx("cancel")}
            onClick={() => { setAttendanceModal(false) }}>취소</button>
          <button
            onClick={absenceRequest}
          >확인</button>
        </div>
      </div>
    </Modal>
  </>
}