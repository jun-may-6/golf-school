export type month = {
  beforeMonthDayArray:day[];
  currentMonthDayArray:day[];
  nextMonthDayArray:day[];
}
export type day = {
  date:string;
  schedule:schedule[];
  isNotAttendance:boolean;
  isClosedDate:boolean;
  isRelated:boolean;
  isToday:boolean;
  isCurrentMonth:boolean;
}
export type schedule = {
  id:number;
  title:string;
  description:string;
  date:string;
  startTime:string | null;
  endTime:string | null;
  createDate:string;
  updateDate:string;
  color:string;
  members:{
    id:number;
    name:string;
    email:string;
    userId:string;
    attendance:boolean;
    absenceReason:string;
    gender:string;
  }[]
}
export type scheduleInputData = {
  title: string;
  description?: string;
  dateArray: string[];
  startTime: string | null;
  endTime: string | null;
  isClosed: boolean;
  color: string;
  memberIdArray: string[]
}