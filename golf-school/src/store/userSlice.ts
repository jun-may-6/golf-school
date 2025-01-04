import { createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../types/user";

const initialState:userInfo = {
  userId: "",
  name: "",
  email: "",
  joinDate: new Date,
  birthday: new Date,
  emailVerification: false,
  accessLevel: ""
};
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action)=>{
      state = {
        userId: action.payload.userId,
        name: action.payload.name,
        email: action.payload.email,
        joinDate: action.payload.joinDate,
        birthday: action.payload.birthday,
        emailVerification: action.payload.emailVerification,
        accessLevel:action.payload.accessLevel
      }
    }
  }
})