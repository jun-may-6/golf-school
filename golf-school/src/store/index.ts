import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loadingReducer } from "./gateLoadingSlice";
import { dateReducer } from "./dateSlice";
import { userReducer } from "./userSlice";
import { selectedDateReducer } from "./selectedDateSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    date: dateReducer,
    userInfo: userReducer,
    selectedDate: selectedDateReducer
  }
})

// 타입 정의
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// 커스텀 훅
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
