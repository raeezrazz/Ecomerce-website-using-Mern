import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userInfo {
  _id: string;
  name: string;
  email: string;
}

export interface userState {
  userInfo: userInfo | null;
}

const initialState: userState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo") as string)
    : null,
};

export const userTypeSlce = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<userInfo>) => {
      console.log(action, "here is the action data");
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
      localStorage.removeItem("accessToken");
    },
  },
});

export const { setCredentials, logout } = userTypeSlce.actions;
export default userTypeSlce.reducer;
