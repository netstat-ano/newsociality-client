import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface UserData {
    userId?: string;
    token?: string;
}

const user = createSlice({
    name: "user",
    initialState: {
        userId: undefined,
        token: undefined,
    } as UserData,
    reducers: {
        login(state, action: PayloadAction<UserData>) {
            state.userId = action.payload.userId;
            state.token = action.payload.token;
        },
        logout(state) {
            state.token = undefined;
            state.userId = undefined;
        },
    },
});

export const userActions = user.actions;

export default user;
