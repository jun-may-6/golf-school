import { useEffect, useRef, useState } from "react";
import { generateCalendarData } from "../utils/calendarUtils";
import { schedule } from "../types/calendar";
import { Calendar } from "../components/Calendar/Calendar";
import React from "react";
import { useAppDispatch, useAppSelector } from "../store";
import { Modal } from "../modals/Modal";
import { callApi } from "../apis/api";
import { decreaseIndex, getSchedule, increaseIndex, setMonthRange, setSchedule } from "../store/scheduleSlice";
import { ScheduleViewModal } from "../modals/ScheduleViewModal";
import { ScheduleModifyModal } from "../modals/ScheduleModifyModal";
import styles from "./calendarPage.module.scss"
import classNames from "classnames/bind";
import { ScheduleSetModal } from "../modals/ScheduleSetModal";
import { ScheduleManageModal } from "../modals/ScheduleManageModal";
import { SetRangeModal } from "../modals/SetRangeModal";
import { ScheduleList } from "../components/ScheduleList/ScheduleList";
import { SetClosedDateModal } from "../modals/SetClosedDateModal";

export function CalendarPage() {
  const cx = classNames.bind(styles);
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
  const isDragging = useRef(false);

  const handleDragStart = (e: React.TouchEvent | React.MouseEvent) => {
    isDragging.current = true;
    if ('touches' in e) {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
    } else {
      startX.current = e.clientX;
      startY.current = e.clientY;
    }
    dragDistanceX.current = 0;
    dragDistanceY.current = 0;
  };

  const handleDragMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging.current) return;
    if ('touches' in e) {
      dragDistanceX.current = e.touches[0].clientX - startX.current;
      dragDistanceY.current = e.touches[0].clientY - startY.current;
    } else {
      dragDistanceX.current = e.clientX - startX.current;
      dragDistanceY.current = e.clientY - startY.current;
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
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
  return <div className={cx("container")}>
    <header>
      <div className={cx("left-side")}>
        <div className={cx("icon-box")}>
          <img src="filter.png" onClick={() => { setScheduleModal(state => ({ ...state, range: true })) }}></img>
        </div>
      </div>
      <div className={cx("center")}>
        캘린더
      </div>
      <div className={cx("right-side")}>
        <div className={cx("icon-box", { disable: reloadDisable })}>
          <img src="icon/reload.png" onClick={() => {
            !reloadDisable && dispatch(getSchedule())
            setReloadDisable(true);
            setTimeout(() => {
              setReloadDisable(false)
            }, 3000)
          }}></img>
        </div>
        {userInfo.accessLevel == "ADMIN" &&
          <div className={cx("icon-box")} onClick={() => {setScheduleModal(state => { return { ...state, select: true } })}}>
            <img src="plus.png"/>
          </div>}
      </div>
    </header>
    <div className={cx("main")}>
        <div
          className={cx("calendar-window", {full:isFullCalendar})}

          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
        >
          <div className={cx("calendar-container")}          
          ref={containerRef}>
          {calendarData.map((month, index) => (
            <Calendar key={index} monthData={month} isFullCalendar={isFullCalendar} setIsFullCalendar={setIsFullCalendar} />
          ))}
          </div>
        </div>
      <div className={cx("schedule-window")}>
        <ScheduleList
        onClickSchedule ={(id:number)=>{
          setScheduleModal(state=>({...state, schedule: true}))
          setSelectedScheduleId(id)
        }}
        scheduleData={scheduleData.schedule
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
          })}/>
      </div>
    </div>
    <Modal
      isOpen={scheduleModal.schedule}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, schedule: false } }) }}
    >
      <ScheduleViewModal
        selectedSchedule={scheduleData.schedule.find(s => s.id == selectedScheduleId)}
        openModifyModal={() => { setScheduleModal(state => ({ ...state, modify: true })) }}
        onClose={() => { setScheduleModal(state => { return { ...state, schedule: false } }) }} />
    </Modal>
    <Modal
      isOpen={scheduleModal.modify}
      onRequestClose={() => { setScheduleModal(state => ({ ...state, modify: false })) }}
    >
      <ScheduleModifyModal
        selectedSchedule={scheduleData.schedule.find(s => s.id == selectedScheduleId)}
        openViewModal={() => { setScheduleModal(state => ({ ...state, schedule: true })) }}
        onClose={() => { setScheduleModal(state => { return { ...state, modify: false } }) }} />
    </Modal>
    <Modal
      isOpen={scheduleModal.select}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, select: false } }) }}
    >
      <ScheduleManageModal
        month={new Date(calendarData[currentIndex].currentMonthDayArray[0].date).getMonth() + 1}
        setScheduleModal={setScheduleModal}
      />
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
      <SetRangeModal/>
    </Modal>

    <Modal
      isOpen={scheduleModal.closed}
      onRequestClose={() => { setScheduleModal(state => ({ ...state, closed: false })) }}>
        <SetClosedDateModal month={calendarData[currentIndex]} closedArray={scheduleData.closed} refreshSchedule={getScheduleData} closeModal={() => { setScheduleModal(state => ({ ...state, closed: false })) }} />
    </Modal>
  </div>
} 