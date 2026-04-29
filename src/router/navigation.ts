import type { NavigateFunction } from "react-router-dom";

let navigateRef: NavigateFunction | null = null;

export function setNavigate(navigate: NavigateFunction) {
    navigateRef = navigate;
}

export function navigateTo(path: string, options?: { replace?: boolean }) {
    navigateRef?.(path, { replace: options?.replace ?? true });
}
