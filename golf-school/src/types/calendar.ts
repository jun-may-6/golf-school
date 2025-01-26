export type month = {
  beforeMonthDayArray:day[];
  currentMonthDayArray:day[];
  nextMonthDayArray:day[];
}
export type day = {
  date:Date;
  schedule:schedule[];
  isNotAttendance:boolean;
  isClosedDate:boolean;
  isRelated:boolean;
  isToday:boolean;
  isCurrentMonth:boolean;
}
export type schedule = {
  name:string;
  renderIndex:number;
  id:number;
  color:string;
  isStart:boolean;
  isEnd:boolean;
}