import { baseURL } from "./config";

export async function login(username: string, password: string) {
    const res = await baseURL.post("/token/", { username, password });
    return res.data;
}

export async function register(username: string, password: string) {
    const res = await baseURL.post("/auth/register/", { username, password });
    return res.data;
}

export async function getMe() {
    const response = await baseURL.get("/auth/me/");
    return response.data;
}
