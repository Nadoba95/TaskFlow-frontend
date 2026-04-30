import type { User } from "../types";

export function saveTokens(access: string, refresh: string) {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
}

export function saveUser(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function getAccessToken() {
    return localStorage.getItem("access");
}

export function getRefreshToken() {
    return localStorage.getItem("refresh");
}

export function getUser() {
    return JSON.parse(localStorage.getItem("user"));
}

export function removeTokens() {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("user");
}
