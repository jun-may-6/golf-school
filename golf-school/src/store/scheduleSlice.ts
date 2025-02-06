import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppThunk } from ".";
import { schedule } from "../types/calendar";
import { callApi } from "../apis/api";

interface ScheduleState {
  schedule: schedule[];
  closed: string[];
}

const initialState: ScheduleState = { schedule: [], closed: [] };

const scheduleSlice = createSlice({
  name: "schedule",
  initialState,
  reducers: {
    setSchedule: (state, action: PayloadAction<ScheduleState>) => {
      return action.payload;
    },
  },
});

export const { setSchedule } = scheduleSlice.actions;

export const getSchedule = (startDate:string, endDate:string): AppThunk => async (dispatch) => {
  try {
    const response = await callApi.get(`/schedules?startDate=${startDate}&endDate=${endDate}`); // API 호출
    const data: ScheduleState = await response.data;

    dispatch(setSchedule(data)); // 스토어 업데이트
  } catch (error) {
    console.error("Failed to fetch schedule:", error);
  }
};

export const scheduleReducer = scheduleSlice.reducer;
