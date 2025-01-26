import { createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../types/user";

const initialState:string[] = [];
const dateSlice = createSlice({
  name: 'selectedDate',
  initialState,
  reducers: {
    dateToggle: (state, action)=>{
      if(state.includes(action.payload)){
        return state.filter(date=>date !== action.payload)
      } else {
        return [...state, action.payload]
      }
    }
    ,
    addSelectedDate: (state, action)=>{
      return [...state, action.payload]
    },
    removeSelectedDate:(state, action)=>{
      return state.filter((date)=>date !== action.payload)
    },
    cleanSelectedDate:()=>{
      return []
    }
  }
})

export const {addSelectedDate, removeSelectedDate, cleanSelectedDate, dateToggle} = dateSlice.actions;
export const selectedDateReducer = dateSlice.reducer;