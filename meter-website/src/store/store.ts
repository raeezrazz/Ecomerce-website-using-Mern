import {configureStore} from "@reduxjs/toolkit"
import userRed
// import adminReducer from './slice/adminSlice'

export const store = configureStore({
    reducer: {
        user: userReducer,
        // admin:adminReducer
    },
})

export type Rootstate = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch