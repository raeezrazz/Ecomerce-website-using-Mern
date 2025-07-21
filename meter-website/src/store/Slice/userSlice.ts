import { createSlice } from "@reduxjs/toolkit";

export interface userState {
    userInfo:userInfo | null;
}

export interface userInfo {
    _id: string;
    name: string;
    email: string;

}

const initialState: userState = {
    userInfo: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo") as string) : null
}


export const userTypeSlce = createSlice({
    name: "user",
    initialState,
    reducers:{
        setCredentials: (state, action) =>{
            console.log(action,"here is the actio data")
            state.userInfo = action.payload.data;

        },
        logout: (state) => {
            state.userInfo = null;
            localStorage.removeItem("userInfo");
            localStorage.removeItem('accessToken')
        },
        

    }
})

export const { setCredentials ,logout} = userTypeSlce.actions;

export default userTypeSlce.reducer;