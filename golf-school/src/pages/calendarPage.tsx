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
import { ClosedDateCalendar } from "../components/closedDateCalendar";
import { ScheduleMemberSetModal } from "../components/modal/scheduleMemberSetModal";
import { decreaseIndex, getSchedule, increaseIndex, setMonthRange, setSchedule } from "../store/scheduleSlice";
import { ScheduleViewModal } from "../components/modal/scheduleViewModal";
import { ScheduleModifyModal } from "../components/modal/scheduleModifyModal";

export function CalendarPage() {
  const dispatch = useAppDispatch();
  const scheduleData = useAppSelector(state => state.schedule)
  const selectedDate = useAppSelector(state => state.date)
  const userInfo = useAppSelector(state => state.userInfo)
  const monthRange = { startDate: useAppSelector(state => state.schedule.startDate), endDate: useAppSelector(state => state.schedule.endDate) }
  const currentIndex: number = useAppSelector(state => state.schedule.currentIndex)
  const calendarData = generateCalendarData(monthRange);

  useEffect(() => {
    dispatch(getSchedule())
  }, [])

  const [isFullCalendar, setIsFullCalendar] = useState(true);
  const [selectedScheduleId, setSelectedScheduleId] = useState<number>(1);

  const [preparedMonthRange, setPreparedMonthRange] = useState<{ startDate: string, endDate: string }>({
    startDate: monthRange.startDate,
    endDate: monthRange.endDate
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
      dispatch(decreaseIndex())
      startX.current = 0;
      dragDistanceX.current = 0;
      return;
    } else if (dragDistanceX.current < -threshold && currentIndex < calendarData.length - 1) {
      dispatch(increaseIndex())
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


  // useEffect(() => {
  //   setSelectedSchedule(state => {
  //     if(scheduleData == null) return state
  //     if(state == null) return state
  //     const updatedSchedule = scheduleData.schedule.find(s => s.id === state.id);
  //     return updatedSchedule || {
  //       id: 0,
  //       title: "로딩중..",
  //       description: "",
  //       date: new Date().toISOString(),
  //       startTime: null,
  //       endTime: null,
  //       createDate: "",
  //       updateDate: "",
  //       color: "",
  //       memberList: []
  //     };
  //   });
  // }, [scheduleData]);
  const getScheduleData = async () => {
    const response = await callApi.get(`/schedules?startDate=${monthRange.startDate}&endDate=${monthRange.endDate}`)
    const scheduleData = response.data as { schedule: schedule[], closed: string[] }
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
    closed: boolean,
    modify: boolean
  }>({
    select: false,
    class: false,
    range: false,
    schedule: false,
    attendance: false,
    closed: false,
    modify: false
  });



  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };
  const [reloadDisable, setReloadDisable] = useState<boolean>(false);
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
            !reloadDisable && dispatch(getSchedule())
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
                    setSelectedScheduleId(schedule.id)
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
    <Modal
      isOpen={scheduleModal.schedule}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, schedule: false } }) }}
    >
      <ScheduleViewModal
        selectedSchedule={scheduleData.schedule.find(s=>s.id == selectedScheduleId)}
        openModifyModal={() => { setScheduleModal(state => ({ ...state, modify: true })) }}
        onClose={() => { setScheduleModal(state => { return { ...state, schedule: false } }) }} />
    </Modal>
    <Modal
      isOpen={scheduleModal.modify}
      onRequestClose={() => { setScheduleModal(state => ({ ...state, modify: false })) }}
    >
      <ScheduleModifyModal
        selectedSchedule={scheduleData.schedule.find(s=>s.id == selectedScheduleId)}
        openViewModal={() => { setScheduleModal(state => ({ ...state, schedule: true })) }}
        onClose={() => { setScheduleModal(state => { return { ...state, modify: false } }) }} />
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
            value={preparedMonthRange.startDate.slice(0, 7) || ""}
            onChange={(e) => {
              if (preparedMonthRange.endDate && preparedMonthRange.endDate < e.target.value) {
                setPreparedMonthRange({ startDate: e.target.value + "-01", endDate: e.target.value + "-01" })
              } else {
                setPreparedMonthRange(state => ({ ...state, startDate: e.target.value + "-01" }))
              }
            }}
          />
          ~
          <input type="month"
            value={preparedMonthRange.endDate.slice(0, 7) || ""}
            onChange={(e) => {
              if (preparedMonthRange.startDate && preparedMonthRange.startDate > e.target.value) {
                setPreparedMonthRange({ startDate: e.target.value + "-01", endDate: e.target.value + "-01" })
              } else {
                setPreparedMonthRange(state => ({ ...state, endDate: e.target.value + "-01" }))
              }
            }}
          />
        </div>
        <div className="button-area">
          <button className="cancel">취소</button>
          <button className="register"
            onClick={() => {
              dispatch(setMonthRange({ startDate: preparedMonthRange.startDate, endDate: preparedMonthRange.endDate }))
              dispatch(getSchedule())
              // setMonthRange({ startDate: preparedMonthRange.startDate, endDate: preparedMonthRange.endDate })
              setScheduleModal(state => ({ ...state, range: false }))
            }}
          >조회</button>
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