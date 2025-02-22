import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from ".";
import { comment, member, schedule } from "../types/calendar";
import { callApi, handleApiError } from "../apis/api";

interface ScheduleState {
  schedule: schedule[];
  closed: string[];
  startDate: string;
  endDate: string;
  currentIndex: number;
}
const now = new Date();
const initialState: ScheduleState = {
  schedule: [],
  closed: [],
  startDate: new Date(now.getFullYear(), now.getMonth() - 2, 2).toISOString().split("T")[0],
  endDate: new Date(now.getFullYear(), now.getMonth() + 3, 1).toISOString().split("T")[0],
  currentIndex: 2
}
  ;

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<{ schedule: schedule[], closed: string[] }>) => {
      state.schedule = action.payload.schedule.map(s => ({ ...s, date: s.date.split("T")[0] }));
      state.closed = action.payload.closed;
    },
    setMonthRange: (state, action: PayloadAction<{ startDate: string, endDate: string }>) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.currentIndex = Math.ceil(getMonthDifference(action.payload.startDate, action.payload.endDate) / 2)
    },
    increaseIndex: (state) => {
      state.currentIndex = state.currentIndex + 1
    },
    decreaseIndex: (state) => {
      state.currentIndex = state.currentIndex - 1
    },
    setScheduleMember: (state, action: PayloadAction<{ scheduleId: number, memberList: member[] }>) => {
      const { scheduleId, memberList } = action.payload;
      const scheduleIndex = state.schedule.findIndex(s => s.id === scheduleId);
      if (scheduleIndex !== -1) {
        state.schedule[scheduleIndex].memberList = memberList;
      }
    },
    setScheduleComment: (state, action: PayloadAction<{scheduleId:number, commentList: comment[]}>)=>{
      const {scheduleId, commentList} = action.payload
      const scheduleIndex = state.schedule.findIndex(s => s.id === scheduleId);
      if (scheduleIndex !== -1) {
        state.schedule[scheduleIndex].commentList = commentList;
      }
    }
  },
});

export const { setSchedule, setMonthRange, increaseIndex, decreaseIndex, setScheduleMember, setScheduleComment } = scheduleSlice.actions;


const getMonthDifference = (startDate: string, endDate: string) => {
  const sD = new Date(startDate)
  const eD = new Date(endDate)
  const startYear = sD.getFullYear();
  const startMonth = sD.getMonth();
  const endYear = eD.getFullYear();
  const endMonth = eD.getMonth();
  return (endYear - startYear) * 12 + (endMonth - startMonth);
}


export const getSchedule = (): AppThunk => async (dispatch, getState) => {
  try {
    const state = getState();
    const { startDate, endDate } = state.schedule;
    const response = await callApi.get(`/schedules?startDate=${startDate}&endDate=${endDate}`); // API 호출
    const data: ScheduleState = await response.data;
    dispatch(setSchedule(data)); // 스토어 업데이트
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
  }
};

export const scheduleReducer = scheduleSlice.reducer;

