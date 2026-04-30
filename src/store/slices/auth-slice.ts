import { createSlice } from "@reduxjs/toolkit";
import { getAccessToken, getRefreshToken, getUser, removeTokens, saveTokens, saveUser } from "../../utils/auth";
import type { User } from "../../types";

interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    user: User | null;
}

const initialState: AuthState = {
    accessToken: getAccessToken() || null,
    refreshToken: getRefreshToken() || null,
    isAuthenticated: !!getAccessToken(),
    user: getUser() || null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setTokens: (state, action) => {
            saveTokens(action.payload.access, action.payload.refresh);
            state.accessToken = action.payload.access;
            state.refreshToken = action.payload.refresh;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            removeTokens();
            state.accessToken = null;
            state.refreshToken = null;
            state.isAuthenticated = false;
            state.user = null;
        },
        setUser: (state, action) => {
            saveUser(action.payload);
            state.user = action.payload;
        },
    },
});

export const { setTokens, logout, setUser } = authSlice.actions;
export default authSlice.reducer;
