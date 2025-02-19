import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LoadingState {
  isLoading: boolean;
  message: string
}

const initialState: LoadingState = {
  isLoading: false,
  message: "로딩중..."
};

export const globalLoadingSlice = createSlice({
  name: "globalLoading",
  initialState,
  reducers: {
    startGlobalLoading(state, action) {
      if (action.payload) 
        state.message = action.payload
      state.isLoading = true;
    },
    endGlobalLoading(state) {
      state.isLoading = false;
    }
  },
});

export const { startGlobalLoading, endGlobalLoading } = globalLoadingSlice.actions;

export const globalLoadintReducer = globalLoadingSlice.reducer;
