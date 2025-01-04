import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  hasFetched: boolean
}

const initialState: LoadingState = {
  isLoading: false,
  hasFetched: false
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    endLoading(state) {
      state.isLoading = false;
    },
    hasFetched(state){
      state.hasFetched = true;
    },
    notHasFetched(state){
      state.hasFetched = false;
    }
  },
});

export const { startLoading, endLoading, hasFetched, notHasFetched } = loadingSlice.actions;

export const loadingReducer = loadingSlice.reducer;
