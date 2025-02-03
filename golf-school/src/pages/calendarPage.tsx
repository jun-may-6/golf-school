import { useEffect, useRef, useState } from "react";
import { generateCalendarData } from "../utils/calendarUtils";
import { month, schedule } from "../types/calendar";
import { Calendar } from "../components/layout/calendar";
import React from "react";
import ReactModal from "react-modal";
import { useAppDispatch, useAppSelector } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { SelectDateCalendar } from "../components/modal/selectDateCalendar";
import { Modal } from "../components/modal/modal";
import { ScheduleSetModal } from "../components/modal/scheduleSetModal";
import { callApi } from "../apis/api";
import { setSchedule } from "../store/scheduleSlics";
import { ClosedDateCalendar } from "../components/closedDateCalendar";

export function CalendarPage() {
  const dispatch = useAppDispatch();
  const now = new Date();
  const scheduleData = useAppSelector(state => state.schedule)
  const selectedDate = useAppSelector(state => state.date)
  const userInfo = useAppSelector(state => state.userInfo)

  const [monthRange, setMonthRange] = useState<{ startDate: Date, endDate: Date }>({
    startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0)
  });
  const [preparedMonthRange, setPreparedMonthRange] = useState<{ startDate: string, endDate: string }>({
    startDate: `${monthRange.startDate.getFullYear()}-${(monthRange.startDate.getMonth() + 1) > 9 ? monthRange.startDate.getMonth() + 1 : '0' + (monthRange.startDate.getMonth() + 1)}`,
    endDate: `${monthRange.endDate.getFullYear()}-${(monthRange.endDate.getMonth() + 1) > 9 ? monthRange.endDate.getMonth() + 1 : '0' + (monthRange.endDate.getMonth() + 1)}`
  })
  const [calendarData, setCalendarData] = useState<month[]>(generateCalendarData(monthRange));

  useEffect(() => {
    const newCalendarData = generateCalendarData(monthRange);
    setCalendarData(newCalendarData)
    const getMonthDifference = (startDate: Date, endDate: Date) => {
      const startYear = startDate.getFullYear();
      const startMonth = startDate.getMonth();
      const endYear = endDate.getFullYear();
      const endMonth = endDate.getMonth();
      return (endYear - startYear) * 12 + (endMonth - startMonth);
    }
    setCurrentIndex(Math.ceil(getMonthDifference(monthRange.startDate, monthRange.endDate) / 2))
    try {
      getScheduleData()
    } catch {
      alert("일정 조회 실패")
    }
  }, [monthRange])
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isFullCalendar, setIsFullCalendar] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState<schedule>({
    id: 0,
    title: "로딩중..",
    description: "",
    date: new Date().toISOString(),
    startTime: null,
    endTime: null,
    createDate: "",
    updateDate: "",
    color: "",
    members: []
  })

  const containerRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const dragDistanceX = useRef(0);
  const dragDistanceY = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    dragDistanceX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touchX = e.touches[0].clientX;
    const touchY = e.touches[0].clientY;
    dragDistanceX.current = touchX - startX.current;
    dragDistanceY.current = touchY - startY.current;
  };

  const handleTouchEnd = () => {
    const threshold = 100;
    if (dragDistanceX.current > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      startX.current = 0;
      dragDistanceX.current = 0;
      return;
    } else if (dragDistanceX.current < -threshold && currentIndex < calendarData.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      startX.current = 0;
      dragDistanceX.current = 0;
      return;
    }
    if (dragDistanceY.current < - threshold) {
      setIsFullCalendar(false);
    } else if (dragDistanceY.current > threshold) {
      setIsFullCalendar(true);
    }
  };
  const absenceRequest = async () => {
    if (!confirm("결석을 신청하시겠습니까?")) return
    try {
      const response = await callApi.post("/schedules/absence", attendanceInput)
      if (response.status == 200) {
        await getScheduleData()
        alert("결석 신청 완료")
        setScheduleModal(state => ({ ...state, attendance: false }))
      }
    } catch {
      alert("결석일 등록 실패")
    }
  }
  const cancelAbsence = async (id: number) => {
    if (!confirm("결석을 취소하시겠습니까?")) return
    try {
      const response = await callApi.post("/schedules/absence", { order: 'cancel', message: "", scheduleMemberId: id })
      if (response.status == 200) {
        await getScheduleData()
        alert("결석 취소 완료")
        setScheduleModal(state => ({ ...state, attendance: false }))
      }
    } catch {
      alert("취소 실패")
    }
  }
  useEffect(() => {
    setSelectedSchedule(state => {
      const updatedSchedule = scheduleData.schedule.find(s => s.id === state.id);
      return updatedSchedule || {
        id: 0,
        title: "로딩중..",
        description: "",
        date: new Date().toISOString(),
        startTime: null,
        endTime: null,
        createDate: "",
        updateDate: "",
        color: "",
        members: []
      };
    });
  }, [scheduleData]);
  const getScheduleData = async () => {
    const response = await callApi.get(`/schedules?startDate=${monthRange.startDate}&endDate=${monthRange.endDate}`)
    const scheduleData = response.data as { schedule: schedule[], closed: Date[] }
    dispatch(setSchedule(scheduleData))
  }

  React.useEffect(() => {
    containerRef.current!.style.transform = `translateX(${-currentIndex * 100}%)`;
  }, [currentIndex]);


  /* modal */
  const [scheduleModal, setScheduleModal] = useState<{
    select: boolean,
    class: boolean,
    range: boolean,
    schedule: boolean,
    attendance: boolean,
    closed: boolean
  }>({
    select: false,
    class: false,
    range: false,
    schedule: false,
    attendance: false,
    closed: false
  });

  const [attendanceInput, setAttendanceInput] = useState<{ order: string, message: string, scheduleMemberId: number }>({ order: "absence", message: "", scheduleMemberId: 0 });

  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const [reloadDisable, setReloadDisable] = useState<boolean>(false);
  const deleteSchedule = async (scheduleId: number) => {
    if (!confirm("삭제하시겠습니까?")) return
    try {
      const result = await callApi.delete("/schedules/" + scheduleId)
      setScheduleModal(state=>({...state, schedule:false}))
      alert("삭제 완료")
      setSelectedSchedule({
        id: 0,
        title: "로딩중..",
        description: "",
        date: new Date().toISOString(),
        startTime: null,
        endTime: null,
        createDate: "",
        updateDate: "",
        color: "",
        members: []
      })
      getScheduleData()
    } catch {
      alert("삭제 실패")
    }
  }
  return <div className="main-page">

    <header>
      <div className="header-left-side">
        <div className="header-icon-box">
          <img src="filter.png" className="header-icon-img" onClick={() => { setScheduleModal(state => ({ ...state, range: true })) }}></img>
        </div>
      </div>
      <div className="header-center">
        캘린더
      </div>
      <div className="header-right-side">
        <div className={`header-icon-box ${reloadDisable ? "disable" : ""}`}>
          <img src="icon/reload.png" className="header-icon-img" onClick={() => {
            !reloadDisable && getScheduleData()
            setReloadDisable(true);
            setTimeout(() => {
              setReloadDisable(false)
            }, 3000)
          }}></img>
        </div>
        {userInfo.accessLevel == "ADMIN" ?
          <div className="header-icon-box" onClick={() => { setScheduleModal(state => { return { ...state, select: true } }) }}>
            <img src="plus.png" className="header-icon-img"></img>
          </div>
          : null}
      </div>
    </header>
    <div className="calendar-page">
      <div className={`calendar-window${isFullCalendar ? " full" : ""}`}>
        <div
          className={`calendar-container`}
          ref={containerRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {calendarData.map((month, index) => (
            <Calendar key={index} monthData={month} isFullCalendar={isFullCalendar} setIsFullCalendar={setIsFullCalendar} />
          ))}
        </div>
      </div>
      <div className="calendar-schedule-window">
        {
          scheduleData.schedule
            .filter(s => {
              const selected = new Date(selectedDate);
              const scheduleDate = new Date(s.date);
              return (
                selected.getFullYear() === scheduleDate.getFullYear() &&
                selected.getMonth() === scheduleDate.getMonth() &&
                selected.getDate() === scheduleDate.getDate()
              );
            })
            .sort((a, b) => {
              if (a.startTime == null) return -1;
              if (b.startTime == null) return 1;
              return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
            })
            .map((schedule, index, arr) => {
              // startTime이 존재하는 첫 번째 일정 찾기
              const firstScheduleWithTime = arr.find(s => s.startTime != null);
              // startTime이 존재하는 마지막 일정 찾기
              const lastScheduleWithTime = [...arr].reverse().find(s => s.startTime != null);

              const isFirst = schedule === firstScheduleWithTime;
              const isLast = schedule === lastScheduleWithTime;

              return (
                <div key={index} className="schedule-box"
                  onClick={() => {
                    setSelectedSchedule(scheduleData.schedule.find(s => s.id == schedule.id) || scheduleData.schedule[0])
                    setScheduleModal(state => ({ ...state, schedule: true }))
                  }}>
                  <div className="timeline">
                    <div className={`border ${isFirst ? "start" : ""} ${isLast ? "end" : ""} ${schedule.startTime ? "" : "not-continuous"}`} />
                    <div className="color" style={{ backgroundColor: schedule.color }} />
                  </div>
                  <div className="title-area">
                    <div className="title">{schedule.title}</div>
                    <div className="description">{schedule.description}</div>
                  </div>
                  <div className="timezone">
                    <div className="time">
                      {schedule.startTime != null && schedule.endTime != null
                        ? `${schedule.startTime.split(":").slice(0, 2).join(":")}~${schedule.endTime.split(":").slice(0, 2).join(":")}`
                        : ``}
                    </div>
                  </div>
                </div>
              );
            })
        }
      </div>
    </div>
    {/* 스케쥴 열람 모달 */}
    <Modal
      isOpen={scheduleModal.schedule}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, schedule: false } }) }}
    >
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
          <div className="title-area">
            <label>출석 인원 {`(
            ${selectedSchedule.members.length - selectedSchedule.members.filter(m => !m.attendance).length} / ${selectedSchedule.members.length}
            )`}</label>
          </div>
          <div className="detail">
            {selectedSchedule.members.map(m => {
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
                        setScheduleModal(state => ({ ...state, attendance: true }))
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
        </div>
        <div className="button-area">
          <button className="cancel"
            onClick={() => {
              setScheduleModal(state => ({ ...state, schedule: false }))
            }}>닫기</button>
          {userInfo.accessLevel == "ADMIN" ?
            <button className=""
              onClick={() => {
                deleteSchedule(selectedSchedule.id)
              }}>수정 / 삭제</button>
            : null}
        </div>
      </div>
    </Modal>
    <Modal
      isOpen={scheduleModal.select}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, select: false } }) }}
    >
      <div className="schedule-modal">
        <div className="header">{new Date(calendarData[currentIndex].currentMonthDayArray[0].date).getMonth() + 1}월 일정 추가</div>
        <div className="contents">
          <div className="select-box" onClick={() => {
            setScheduleModal(state => { return { ...state, select: false, class: true } })
          }}>
            <div className="icon">
              <img src="icon/schedule.png"></img>
            </div>
            <div className="message">일정 등록</div>
          </div>
          <div className="select-box" onClick={() => {
            setScheduleModal(state => ({ ...state, closed: true, select: false }))
          }}>
            <div className="icon">
              <img src="icon/closed.png"></img>
            </div>
            <div className="message">휴일 등록</div>
          </div>
        </div>
      </div>
    </Modal>
    <Modal
      isOpen={scheduleModal.class}
      onRequestClose={() => {
        setScheduleModal(state => { return { ...state, class: false } })
      }}
    >
      <ScheduleSetModal
        closeModalFunction={() => {
          setScheduleModal(state => { return { ...state, class: false } })
        }}
        monthRange={monthRange}
        month={calendarData[currentIndex]}
      />
    </Modal>
    <Modal
      isOpen={scheduleModal.range}
      onRequestClose={() => { setScheduleModal(state => ({ ...state, range: false })) }}
    >
      <div className="range-modal">
        <div className="header">조회 기간</div>
        <div className="contents">
          <input type="month"
            value={preparedMonthRange.startDate || ""}
            onChange={(e) => {
              if (preparedMonthRange.endDate && preparedMonthRange.endDate < e.target.value) {
                setPreparedMonthRange({ startDate: e.target.value, endDate: e.target.value })
              } else {
                setPreparedMonthRange(state => ({ ...state, startDate: e.target.value }))
              }
            }}
          />
          ~
          <input type="month"
            value={preparedMonthRange.endDate || ""}
            onChange={(e) => {
              if (preparedMonthRange.startDate && preparedMonthRange.startDate > e.target.value) {
                setPreparedMonthRange({ startDate: e.target.value, endDate: e.target.value })
              } else {
                setPreparedMonthRange(state => ({ ...state, endDate: e.target.value }))
              }
            }}
          />
        </div>
        <div className="button-area">
          <button className="cancel">취소</button>
          <button className="register"
            onClick={() => {
              setMonthRange({ startDate: new Date(preparedMonthRange.startDate), endDate: new Date(preparedMonthRange.endDate) })
              setScheduleModal(state => ({ ...state, range: false }))
            }}
          >조회</button>
        </div>
      </div>
    </Modal>
    <Modal
      isOpen={scheduleModal.attendance}
      onRequestClose={() => { setScheduleModal(state => ({ ...state, attendance: false })) }}>
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
            onClick={() => { setScheduleModal(state => ({ ...state, attendance: false })) }}>취소</button>
          <button
            onClick={absenceRequest}
          >확인</button>
        </div>
      </div>
    </Modal>
    <Modal
      isOpen={scheduleModal.closed}
      onRequestClose={() => { setScheduleModal(state => ({ ...state, closed: false })) }}>
      <div className="date-select-area">
        <div className="header">
          {new Date(calendarData[currentIndex].currentMonthDayArray[0].date).getMonth() + 1}월 휴일 등록
        </div>
        <ClosedDateCalendar month={calendarData[currentIndex]} closedArray={scheduleData.closed} refreshSchedule={getScheduleData} closeModal={() => { setScheduleModal(state => ({ ...state, closed: false })) }} />
      </div>
    </Modal>
  </div>
} 