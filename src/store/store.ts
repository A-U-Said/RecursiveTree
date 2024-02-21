import { configureStore } from '@reduxjs/toolkit'
import treeReducer from "./treeReducer";


const store = configureStore({
    reducer: treeReducer,
    devTools: true
  });


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;