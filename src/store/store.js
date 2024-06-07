
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app.slice";
import pathfinderReducer from "./pathfinder.slice";

export const store = configureStore({
  reducer: {
    app: appReducer,
    pathfinder: pathfinderReducer,
  },
})

export default store;