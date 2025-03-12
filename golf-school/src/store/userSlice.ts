import { createSlice } from "@reduxjs/toolkit";
import { userInfo } from "../types/user";

const initialState:userInfo = {
  userId: "",
  name: "",
  email: "",
  joinDate: "",
  leaveDate: null,
  birthday: "",
  gender: "",
  accessLevel: "",
  profileImagePath: null
};
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action)=>{
      return {
        userId: action.payload.userId,
        name: action.payload.name,
        email: action.payload.email,
        joinDate: action.payload.joinDate,
        leaveDate: action.payload.leaveDate,
        birthday: action.payload.birthday,
        gender: action.payload.gender,
        accessLevel:action.payload.accessLevel,
        profileImagePath: action.payload.profileImagePath
      }
    }
  }
})

export const {setUser} = userSlice.actions;
export const userReducer = userSlice.reducer;