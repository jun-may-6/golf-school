import { day, month } from "../types/calendar";
export const parseDateString = (date:Date):string => {
  return date.getFullYear() + "-" +
  String(date.getMonth() + 1).padStart(2, '0') + "-" +
  String(date.getDate()).padStart(2, '0') + "T" +
  String(date.getHours()).padStart(2, '0') + ":" +
  String(date.getMinutes()).padStart(2, '0') + ":" +
  String(date.getSeconds()).padStart(2, '0') + "+09:00";
}
export const generateCalendarData = (monthRange: { startDate: Date, endDate: Date }): month[] => {
  const { startDate, endDate } = monthRange;
  const currentDate = new Date();
  const result: month[] = [];
  const createDay = (date: string, month:number, isToday: boolean = false):day => {
    const isCurrentMonth = month === new Date(date).getMonth();
    return {
      date: date,
      schedule: [],
      isNotAttendance: false,
      isClosedDate: false,
      isRelated: false,
      isToday: isToday,
      isCurrentMonth: isCurrentMonth
    }
  }
  let current: Date = new Date(startDate);
  while (current <= endDate) {
    const year = current.getFullYear();
    const month = current.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const startDayOfWeek = firstDayOfMonth.getDay();

    // Previous month days
    const beforeMonthDayArray: day[] = [];
    const prevMonthLastDate = new Date(year, month, 0);
    for (let i = startDayOfWeek; i > 0; i--) {
      const date = new Date(prevMonthLastDate);
      date.setDate(prevMonthLastDate.getDate() - (i - 1));
      beforeMonthDayArray.push(createDay(parseDateString(date), month));
    }

    // Current month days
    const currentMonthDayArray: day[] = [];
    for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
      const date = new Date(year, month, i);
      const isToday =
        currentDate.getFullYear() === date.getFullYear() &&
        currentDate.getMonth() === date.getMonth() &&
        currentDate.getDate() === date.getDate();

      currentMonthDayArray.push(createDay(parseDateString(date), month, isToday));
    }

    // Next month days
    const nextMonthDayArray: day[] = [];
    const lastDayOfWeek = lastDayOfMonth.getDay(); // 현재 달의 마지막 요일 인덱스 (0~6)
    const daysToAdd = 6 - lastDayOfWeek; // 토요일까지 부족한 일수 계산

    for (let i = 1; i <= daysToAdd; i++) {
      const date = new Date(year, month + 1, i);
      nextMonthDayArray.push(createDay(parseDateString(date), month));
    }

    // Add month data to result
    result.push({
      beforeMonthDayArray,
      currentMonthDayArray,
      nextMonthDayArray,
    });
    current = new Date(year, month + 1, 1);
  }

  return result;
}