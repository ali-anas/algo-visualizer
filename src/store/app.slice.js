import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: null,
}

export const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setTheme: (state, action) => {
      state.theme = action.payload;
      document.documentElement.setAttribute('data-theme', action.payload);
    },
  },
});

export const { setTheme } = appSlice.actions;

export default appSlice.reducer;
