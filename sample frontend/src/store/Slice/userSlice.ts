import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { safeGetJson, safeRemoveItem } from "@/lib/safeStorage";

export interface userInfo {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

export interface userState {
  userInfo: userInfo | null;
}

const initialState: userState = {
  userInfo: safeGetJson<userInfo>("userInfo"),
};

export const userTypeSlce = createSlice({
  name: "user",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<userInfo>) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
      safeRemoveItem("userInfo");
      safeRemoveItem("accessToken");
      safeRemoveItem("userToken");
      safeRemoveItem("userData");
      safeRemoveItem("refreshToken");
    },
  },
});

export const { setCredentials, logout } = userTypeSlce.actions;
export default userTypeSlce.reducer;
