import {configureStore} from "@reduxjs/toolkit"
import userSlice from "./Slice/userSlice";
// import adminReducer from './slice/adminSlice'

export const store = configureStore({
    reducer: {
        user: userSlice,
        // admin:adminReducer
    },
})

export type Rootstate = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch