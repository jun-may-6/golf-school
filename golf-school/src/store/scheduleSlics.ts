import { createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../types/user";
import { schedule } from "../types/calendar";

const initialState:{schedule:schedule[], closed:string[]} = {schedule:[], closed:[]};
const scheduleSlice = createSlice({
  name: 'schedule',
  initialState,
  reducers: {
    setSchedule: (state, action)=>{
      return action.payload
    }
  }
})

export const {setSchedule} = scheduleSlice.actions;
export const scheduleReducer = scheduleSlice.reducer;