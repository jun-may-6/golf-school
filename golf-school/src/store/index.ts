import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { loadingReducer } from "./gateLoadingSlice";
import { dateReducer } from "./dateSlice";
import { userReducer } from "./userSlice";
import { Action } from 'redux';
import { scheduleReducer } from "./scheduleSlice";
import { globalLoadintReducer } from "./globalLoadingSlice";

const store = configureStore({
  reducer: {
    loading: loadingReducer,
    date: dateReducer,
    userInfo: userReducer,
    schedule: scheduleReducer,
    globalLoading: globalLoadintReducer
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action
>;
// 커스텀 훅
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
