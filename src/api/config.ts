import axios from "axios";
import { store } from "../store";
import { logout, setTokens } from "../store/slices/auth-slice";
import { navigateTo } from "../router/navigation";

export const baseURL = axios.create({ baseURL: import.meta.env.VITE_API_URL + "api/" });

baseURL.interceptors.request.use((config) => {
    const token = store.getState().auth.accessToken;

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

baseURL.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const originalUrl: string = originalRequest?.url ?? "";

        // Don't attempt refresh for auth endpoints (401 is expected there)
        if (
            error.response?.status === 401 &&
            (originalUrl.includes("/token/") || originalUrl.includes("/token/refresh/") || originalUrl.includes("/auth/register/"))
        ) {
            return Promise.reject(error);
        }

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refresh = store.getState().auth.refreshToken;
                if (!refresh) return Promise.reject(error);

                const res = await axios.post(import.meta.env.VITE_API_URL + "api/token/refresh/", { refresh });

                const newAccess = res.data.access;

                store.dispatch(setTokens({ access: newAccess, refresh }));

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;

                return baseURL(originalRequest);
            } catch {
                store.dispatch(logout());
                navigateTo("/login");
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);
