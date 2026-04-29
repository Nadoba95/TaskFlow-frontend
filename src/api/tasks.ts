import { baseURL } from "./config";
import type { Task } from "../types";

export async function fetchTasks() {
    const response = await baseURL.get("/tasks/");
    return response.data;
}

export async function addTask(task: Omit<Task, "id">) {
    const response = await baseURL.post("/tasks/", task);
    return response.data;
}

export async function updateTaskStatus(taskId: number, status: Task["status"]) {
    const response = await baseURL.patch(`/tasks/${taskId}/`, { status });
    return response.data;
}

export async function updateTask(taskId: number, task: Partial<Task>) {
    const response = await baseURL.put(`/tasks/${taskId}/`, task);
    return response.data;
}

export async function deleteTask(id: number) {
    await baseURL.delete(`/tasks/${id}/`);
    return id;
}
