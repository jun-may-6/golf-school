import { useEffect, useState } from "react"
import { member, schedule } from "../../types/calendar"
import { callApi, handleApiError } from "../../apis/api";
import { useAppDispatch, useAppSelector } from "../../store";
import { getSchedule, setScheduleMember } from "../../store/scheduleSlice";
import { Modal } from "./modal";
import { endGlobalLoading, startGlobalLoading } from "../../store/globalLoadingSlice";
import { SmallLoadingComponent } from "../smallLoading";
import { CommentComponent } from "../commentComponent";

export function ScheduleViewModal({ selectedSchedule, openModifyModal, onClose }:
  {
    selectedSchedule: schedule | undefined,
    openModifyModal: () => void,
    onClose: () => void
  }) {
  
  if(selectedSchedule == undefined) return
  const dispatch = useAppDispatch();
  const getScheduleMember = async ()=>{
    try {
      setLoadingStatus(state=>({...state, member: false}))
      const response = await callApi.get(`schedules/${selectedSchedule.id}/members`)
      dispatch(setScheduleMember({scheduleId:selectedSchedule.id, memberList: response.data}))
    } catch (e) {
      handleApiError(e)
    } finally {
      setLoadingStatus(state=>({...state, member: true}))
    }
  }
  const [loadingStatus, setLoadingStatus] = useState<{
    member: boolean;
    reply: boolean;
  }>({
    member: false,
    reply: false
  })
  useEffect(() => {
    if(selectedSchedule.memberList == null){
      getScheduleMember();
    }
  }, [selectedSchedule])
  const userInfo = useAppSelector(state => state.userInfo);
  const [attendanceInput, setAttendanceInput] = useState<{ order: string, message: string, scheduleMemberId: number }>({ order: "absence", message: "", scheduleMemberId: 0 });
  const [attendanceModal, setAttendanceModal] = useState<boolean>(false);
  const cancelAbsence = async (id: number) => {
    if (!confirm("결석을 취소하시겠습니까?")) return
    try {
      dispatch(startGlobalLoading("시작"))
      const response = await callApi.post("/schedules/absence", { order: 'cancel', message: "", scheduleMemberId: id })
      if (response.status == 200) {
        getScheduleMember()
        alert("결석 취소 완료")
        setAttendanceModal(false)
      }
    } catch (e){
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
    <div className={`schedule-view-modal`}>
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
        {<>
          <div className="title-area">
            <label>출석 인원 {selectedSchedule.memberList == null ?
              <SmallLoadingComponent/>
              : `(${selectedSchedule.memberList.length - selectedSchedule.memberList.filter(m => !m.attendance).length} / ${selectedSchedule.memberList.length})`}</label>
          </div>
          {selectedSchedule.memberList != null &&
            <div className="detail">
              {selectedSchedule.memberList.map(m => {
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
                        }}>결석</button> :
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
          }
        </>
        }
        <CommentComponent schedule={selectedSchedule}/>
      </div>
      <div className={`button-area${userInfo.accessLevel == "ADMIN" ?"-admin":""}`}>
        <button className="cancel"
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
          <button className="delete"
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