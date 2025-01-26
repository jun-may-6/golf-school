import { createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../types/user";

const initialState:string = "";
const dateSlice = createSlice({
  name: 'date',
  initialState,
  reducers: {
    setDate: (state, action)=>{
      return action.payload;
    }
  }
})

export const {setDate} = dateSlice.actions;
export const dateReducer = dateSlice.reducer;