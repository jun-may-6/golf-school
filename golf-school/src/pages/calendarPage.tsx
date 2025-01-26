import { useEffect, useRef, useState } from "react";
import { generateCalendarData } from "../utils/calendarUtils";
import { month, schedule } from "../types/calendar";
import { Calendar } from "../components/layout/calendar";
import React from "react";
import Modal from 'react-modal';
import ReactModal from "react-modal";
import { useAppSelector } from "../store";
import { Link, useNavigate } from "react-router-dom";
import { SelectDateCalendar } from "../components/selectDateCalendar";

export function CalendarPage() {

  const navigate = useNavigate();
  const now = new Date();
  const [monthRange, setMonthRange] = useState<{ startDate: Date, endDate: Date }>({
    startDate: new Date(now.getFullYear(), now.getMonth() - 2, 1),
    endDate: new Date(now.getFullYear(), now.getMonth() + 3, 0)
  });
  const [scheduleData, setScheduleData] = useState<schedule>();
  const [calendarData, setCalendarData] = useState<month[]>(generateCalendarData(monthRange));
  useEffect(() => {
    const newCalendarData = generateCalendarData(monthRange);
    setCalendarData(newCalendarData)
  }, [monthRange])
  const [currentIndex, setCurrentIndex] = useState(2);
  const [isFullCalendar, setIsFullCalendar] = useState(false);

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
  const userData = useAppSelector(state => state.userInfo)

  // 슬라이드 인덱스 변경 시 transform 적용
  React.useEffect(() => {
    containerRef.current!.style.transform = `translateX(${-currentIndex * 100}%)`;
  }, [currentIndex]);


  /* modal */
  const [scheduleModal, setScheduleModal] = useState<{ select: boolean, class: boolean, holyday: boolean, field: boolean, other: boolean }>({
    select: false,
    class: false,
    holyday: false,
    field: false,
    other: false
  });
  const scheduleModalStyle: Record<string, ReactModal.Styles> = {
    select: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
      content: {
        padding: '5vw',
        top: '37vh',
        bottom: '37vh'
      }
    },
    class: {
      overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      },
      content: {
        padding: '5vw',
        top: '30vh',
        bottom: '30vh'
      }
    }
  }
  const [rangeSetModal, setRangeSetModal] = useState<boolean>(false);
  const rangeSetModalStyle: ReactModal.Styles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    content: {
      padding: '5vw',
      top: '30vh',
      bottom: '30vh'
    },
  }

  return <div className="main-page">
    {/* 일정 모달 */}
    <Modal
      isOpen={scheduleModal.select}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, select: false } }) }}
      style={scheduleModalStyle.select}
    >
      <div className="schedule-modal">
        <div className="header">{calendarData[currentIndex].currentMonthDayArray[0].date.getMonth() + 1}월 일정 추가</div>
        <div className="contents">
          <div className="select-box" onClick={() => {
            setScheduleModal(state => { return { ...state, select: false, class: true } })
          }}>
            <div className="icon">
              <img src="icon/schedule.png"></img>
            </div>
            <div className="message">일정 등록</div>
          </div>
          <div className="select-box">
            <div className="icon">
              <img src="icon/closed.png"></img>
            </div>
            <div className="message">휴일 등록</div>
          </div>
        </div>
      </div>
    </Modal>

    {/* 수업일정 모달 */}
    <Modal
      isOpen={scheduleModal.class}
      onRequestClose={() => { setScheduleModal(state => { return { ...state, class: false } }) }}
      style={scheduleModalStyle.class}
    >
      <div className="schedule-set-modal vw100">
        <SelectDateCalendar scheduleData={scheduleData} month={calendarData[currentIndex]}/>
      </div>
    </Modal>
    <Modal
      isOpen={rangeSetModal}
      onRequestClose={() => { setRangeSetModal(false) }}
      style={rangeSetModalStyle}
    >
      <div className="range-modal">
        <div className="header">조회 기간</div>
      </div>
    </Modal>
    <header>
      <div className="header-left-side">
        <div className="header-icon-box">
          <img src="filter.png" className="header-icon-img" onClick={() => { setRangeSetModal(true) }}></img>
        </div>
      </div>
      <div className="header-center">
        캘린더
      </div>
      <div className="header-right-side">
        <div className="header-icon-box" onClick={() => { setScheduleModal(state => { return { ...state, select: true } }) }}>
          <img src="plus.png" className="header-icon-img"></img>
        </div>
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
            <Calendar key={index} monthData={month} />
          ))}
        </div>
      </div>
      <div className="calendar-schedule-window">
      </div>
    </div>
  </div>
} 