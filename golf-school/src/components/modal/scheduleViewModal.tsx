import { useEffect, useState } from "react"
import { member, schedule } from "../../types/calendar"
import { callApi } from "../../apis/api";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../../store";
import { getSchedule } from "../../store/scheduleSlice";
import { Modal } from "./modal";

export function ScheduleViewModal({ selectedSchedule, monthRange, onClose }:
  {
    selectedSchedule: schedule,
    monthRange: { startDate: string, endDate: string },
    onClose: () => void
  }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const getScheduleMember = async () => {
      const response = await callApi.get(`schedules/${selectedSchedule.id}/members`)
      if (response.status == 200) {
        setMemberList(response.data)
      }
    }
    try {
      getScheduleMember();
    } catch (e) {
      alert("스케쥴 멤버 조회 실패.")
    } finally {
      setIsCallApi(false)
    }
  }, [])
  const userInfo = useAppSelector(state => state.userInfo);
  const [memberList, setMemberList] = useState<member[] | null>(null);
  const [attendanceInput, setAttendanceInput] = useState<{ order: string, message: string, scheduleMemberId: number }>({ order: "absence", message: "", scheduleMemberId: 0 });
  const [attendanceModal, setAttendanceModal] = useState<boolean>(false);
  const [isCallApi, setIsCallApi] = useState<boolean>(true);
  const cancelAbsence = async (id: number) => {
    if (!confirm("결석을 취소하시겠습니까?")) return
    try {
      const response = await callApi.post("/schedules/absence", { order: 'cancel', message: "", scheduleMemberId: id })
      if (response.status == 200) {
        dispatch(getSchedule(monthRange.startDate, monthRange.endDate))
        alert("결석 취소 완료")
        setAttendanceModal(false)
      }
    } catch {
      alert("취소 실패")
    }
  }
  const deleteSchedule = async (scheduleId: number) => {
    if (!confirm("삭제하시겠습니까?")) return
    try {
      const result = await callApi.delete("/schedules/" + scheduleId)
      onClose()
      alert("삭제 완료")
      if (result.status == 200) {
        dispatch(getSchedule(monthRange.startDate, monthRange.endDate))
      } else {
        dispatch(getSchedule(monthRange.startDate, monthRange.endDate))
      }
    } catch {
      alert("삭제 실패")
    }
  }
  const absenceRequest = async () => {
    if (!confirm("결석을 신청하시겠습니까?")) return
    try {
      const response = await callApi.post("/schedules/absence", attendanceInput)
      if (response.status == 200) {
        dispatch(getSchedule(monthRange.startDate, monthRange.endDate))
        alert("결석 신청 완료")
        setAttendanceModal(false)
      }
    } catch {
      alert("결석일 등록 실패")
    }
  }
  return <>
    <div className="schedule-view-modal">
      <div className="header">
        {selectedSchedule.title}
      </div>
      <div className="date">{selectedSchedule.date.split('T')[0]}</div>
      <div className="contents">
        <div className="title-area">
          <label>일정 설명</label>
        </div>
        <div className="detail">
          {selectedSchedule.description}
        </div>
        <div className="border" />
        {memberList == null ?
          <></>
          : <>
            <div className="title-area">
              <label>출석 인원 {`(
              ${memberList.length - memberList.filter(m => !m.attendance).length} / ${memberList.length}
              )`}</label>
            </div>
            <div className="detail">
              {isCallApi?<>로딩중...</>:memberList.map(m => {
                const profileImage = m.gender == "남" ? "icon/male.png" : "icon/female.png"
                return <><div className="profile">
                  <img src={profileImage} />
                  <div className="name">
                    {m.name}
                    <div className="attendance">
                      {m.attendance ? "" : "(결석)"}
                    </div>
                  </div>
                  <div className="reason">
                    {m.absenceReason ? <div className="message">{m.absenceReason}</div> : null}
                    {userInfo.userId == m.userId &&
                      m.attendance ?
                      <button style={{ marginLeft: "auto" }}
                        onClick={() => {
                          setAttendanceModal(true)
                          setAttendanceInput(state => ({ ...state, scheduleMemberId: m.id }))
                        }}>불참</button> :
                      userInfo.userId == m.userId &&
                        !m.attendance &&
                        !m.absenceReason ?
                        <button style={{ marginLeft: "auto" }}
                          onClick={() => cancelAbsence(m.id)}>취소</button>
                        : null}
                  </div>
                </div>
                  {userInfo.userId == m.userId &&
                    !m.attendance &&
                    m.absenceReason ?
                    <button onClick={() => cancelAbsence(m.id)}>취소</button>
                    : null}
                </>
              })}
            </div>
          </>

        }
      </div>
      <div className="button-area">
        <button className="cancel"
          onClick={onClose}>닫기</button>
        {userInfo.accessLevel == "ADMIN" ?
          <button className=""
            onClick={() => {
              deleteSchedule(selectedSchedule.id)
            }}>수정 / 삭제</button>
          : null}
      </div>
    </div>
    <Modal
      isOpen={attendanceModal}
      onRequestClose={() => { setAttendanceModal(false) }}>
      <div className="attendance-modal">
        <div className="header">결석 처리</div>
        <div className="contents">
          <div className="title-area">
            <label>일정 이름</label>
          </div>
          <div className="description">{selectedSchedule.title}</div>
          <div className="title-area">
            <label>일자</label>
          </div>
          <div className="description">{`${new Date(selectedSchedule.date).getFullYear()}
            ${new Date(selectedSchedule.date).getMonth() + 1}/
            ${new Date(selectedSchedule.date).getDate()}`}</div>
          <div className="title-area">
            <label>사유</label>
          </div>
          <div className="description">
            <input placeholder="간단한 사유를 입력해주세요." type="text"
              onChange={(e) => { setAttendanceInput(state => ({ ...state, message: e.target.value })) }} />
          </div>
          <div>
          </div>
          <div></div>
        </div>
        <div className="button-area">
          <button className="cancel"
            onClick={() => { setAttendanceModal(false) }}>취소</button>
          <button
            onClick={absenceRequest}
          >확인</button>
        </div>
      </div>
    </Modal>
  </>
}