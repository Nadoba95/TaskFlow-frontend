import type { Task } from "./types";

export type StatusFilterValue = Task["status"] | "All";

export const STATUS_OPTIONS: Array<{ value: Task["status"]; label: string }> = [
    { value: "todo", label: "Todo" },
    { value: "in_progress", label: "In Progress" },
    { value: "done", label: "Done" },
];

/** Filter toolbar only — includes All + concrete statuses */
export const STATUS_FILTER_OPTIONS: Array<{ value: StatusFilterValue; label: string }> = [
    { value: "All", label: "All" },
    ...STATUS_OPTIONS,
];
