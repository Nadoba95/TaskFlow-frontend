export interface Task {
    id: number;
    title: string;
    description: string;
    status: "todo" | "in_progress" | "done";
}

export interface User {
    id: number;
    username: string;
}
