import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface UserData {
    userId?: string;
    token?: string;
    avatarUrl?: string;
    username?: string;
}

const user = createSlice({
    name: "user",
    initialState: {
        userId: undefined,
        token: undefined,
        avatarUrl: undefined,
    } as UserData,
    reducers: {
        login(state, action: PayloadAction<UserData>) {
            state.userId = action.payload.userId;
            state.token = action.payload.token;
            state.avatarUrl = action.payload.avatarUrl;
            state.username = action.payload.username;
        },
        logout(state) {
            state.token = undefined;
            state.userId = undefined;
            state.avatarUrl = undefined;
            state.username = undefined;
        },
    },
});

export const userActions = user.actions;

export default user;
