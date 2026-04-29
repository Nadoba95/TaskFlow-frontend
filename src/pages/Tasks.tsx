import { useState, useEffect, useMemo } from "react";
import { fetchTasks, addTask, updateTask, deleteTask, updateTaskStatus } from "../api/tasks";
import type { Task } from "../types";
import EditTaskModal from "../components/Modals/EditTaskModal";
import AddTaskModal from "../components/Modals/AddTaskModal";
import StatusDropdown from "../components/StatusDropdown/StatusDropdown";
import styles from "./Tasks.module.scss";
import Spinner from "../components/Spinner/Spinner";
import { toast } from "react-hot-toast";
import DeleteTaskModal from "../components/Modals/DeleteTaskModal";
import { STATUS_FILTER_OPTIONS, type StatusFilterValue } from "../constants";

type SortKey = "title" | "description" | "status";
type SortDir = "asc" | "desc";

const STATUS_SORT_ORDER: Record<Task["status"], number> = {
    todo: 0,
    in_progress: 1,
    done: 2,
};

export default function Tasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    // Loading
    const [loading, setLoading] = useState(true);

    // Search and filter
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<Task["status"] | "All">("All");

    useEffect(() => {
        const id = window.setTimeout(() => setDebouncedSearch(search), 300);
        return () => window.clearTimeout(id);
    }, [search]);

    // Modals
    const [showAddTaskModal, setShowAddTaskModal] = useState(false);
    const [showEditTaskModal, setShowEditTaskModal] = useState(false);
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);

    const [sortBy, setSortBy] = useState<SortKey>("title");
    const [sortDir, setSortDir] = useState<SortDir>("asc");

    const filteredTasks = tasks.filter((task) => {
        const matchesSearch = task.title.toLowerCase().includes(debouncedSearch.toLowerCase());

        const matchesStatus = task.status === statusFilter || statusFilter === "All";

        return matchesSearch && matchesStatus;
    });

    const sortedFilteredTasks = useMemo(() => {
        const list = [...filteredTasks];
        const factor = sortDir === "asc" ? 1 : -1;

        list.sort((a, b) => {
            if (sortBy === "title") {
                return factor * a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
            }
            if (sortBy === "description") {
                return factor * a.description.localeCompare(b.description, undefined, { sensitivity: "base" });
            }
            return factor * (STATUS_SORT_ORDER[a.status] - STATUS_SORT_ORDER[b.status]);
        });

        return list;
    }, [filteredTasks, sortBy, sortDir]);

    function handleSortClick(key: SortKey) {
        if (sortBy === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"));
        } else {
            setSortBy(key);
            setSortDir("asc");
        }
    }

    async function addTaskHandler(newTask: Omit<Task, "id">) {
        try {
            setLoading(true);
            const task = await addTask(newTask);
            setTasks((prevTasks) => [task, ...prevTasks]);
            toast.success("Task added successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add task");
        } finally {
            setLoading(false);
        }
    }

    async function updateTaskStatusHandler(taskId: number, status: Task["status"]) {
        try {
            setLoading(true);
            await updateTaskStatus(taskId, status);
            setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? { ...t, status } : t)));
            toast.success("Task status updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task status");
        } finally {
            setLoading(false);
        }
    }

    async function updateTaskHandler(taskId: number, task: Partial<Task>) {
        try {
            setLoading(true);
            const updatedTask = await updateTask(taskId, task);
            setTasks((prevTasks) => prevTasks.map((t) => (t.id === taskId ? updatedTask : t)));
            toast.success("Task updated successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task");
        } finally {
            setSelectedTask(null);
            setLoading(false);
        }
    }

    async function deleteTaskHandler(taskId: number) {
        try {
            setLoading(true);
            await deleteTask(taskId);
            setTasks((prevTasks) => prevTasks.filter((t) => t.id !== taskId));
            toast.success("Task deleted successfully");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        (async () => {
            try {
                const tasks = await fetchTasks();
                setTasks(tasks);
            } catch (error) {
                console.error(error);
                toast.error("Failed to fetch tasks");
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    return (
        <>
            <div className={styles.tableWrapper}>
                <div className={styles.actionsContainer}>
                    <input
                        className={styles.searchInput}
                        type="text"
                        id="search"
                        name="search"
                        autoFocus
                        placeholder="Search by title..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <div className={styles.statusDropdownContainer}>
                        <span className={styles.statusDropdownLabel}>Filter by status:</span>
                        <StatusDropdown<StatusFilterValue>
                            id="filter-status"
                            value={statusFilter}
                            onChange={(v) => {
                                setStatusFilter(v);
                                setSortBy("title");
                                setSortDir("asc");
                            }}
                            options={STATUS_FILTER_OPTIONS}
                            disabled={loading}
                            portal
                        />
                    </div>
                    <button
                        className={styles.resetFiltersButton}
                        onClick={() => {
                            setSearch("");
                            setStatusFilter("All");
                            setSortBy("title");
                            setSortDir("asc");
                        }}
                        disabled={loading}
                    >
                        Reset
                    </button>
                    <button
                        className={styles.addTaskButton}
                        onClick={() => setShowAddTaskModal(true)}
                        disabled={loading}
                    >
                        Add Task
                    </button>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th
                                aria-sort={
                                    sortBy === "title" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                                }
                            >
                                <button
                                    type="button"
                                    className={styles.sortButton}
                                    onClick={() => handleSortClick("title")}
                                >
                                    Title
                                    {sortBy === "title" && (
                                        <span className={styles.sortArrow} aria-hidden>
                                            {sortDir === "asc" ? " ↑" : " ↓"}
                                        </span>
                                    )}
                                </button>
                            </th>
                            <th
                                aria-sort={
                                    sortBy === "description" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                                }
                            >
                                <button
                                    type="button"
                                    className={styles.sortButton}
                                    onClick={() => handleSortClick("description")}
                                >
                                    Description
                                    {sortBy === "description" && (
                                        <span className={styles.sortArrow} aria-hidden>
                                            {sortDir === "asc" ? " ↑" : " ↓"}
                                        </span>
                                    )}
                                </button>
                            </th>
                            <th
                                aria-sort={
                                    sortBy === "status" ? (sortDir === "asc" ? "ascending" : "descending") : "none"
                                }
                            >
                                <button
                                    type="button"
                                    className={styles.sortButton}
                                    onClick={() => handleSortClick("status")}
                                >
                                    Status
                                    {sortBy === "status" && (
                                        <span className={styles.sortArrow} aria-hidden>
                                            {sortDir === "asc" ? " ↑" : " ↓"}
                                        </span>
                                    )}
                                </button>
                            </th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={4}>
                                    <Spinner />
                                </td>
                            </tr>
                        ) : tasks.length === 0 ? (
                            <tr>
                                <td colSpan={4}>No tasks found</td>
                            </tr>
                        ) : filteredTasks.length === 0 ? (
                            <tr>
                                <td colSpan={4}>No tasks match your filters</td>
                            </tr>
                        ) : (
                            sortedFilteredTasks.map((task) => (
                                <tr key={task.id}>
                                    <td>{task.title}</td>
                                    <td>{task.description}</td>
                                    <td>
                                        <StatusDropdown
                                            value={task.status}
                                            disabled={loading}
                                            portal
                                            onChange={(status) => updateTaskStatusHandler(task.id, status)}
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.editButton}
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setShowEditTaskModal(true);
                                                }}
                                                disabled={loading}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() => {
                                                    setSelectedTask(task);
                                                    setShowDeleteTaskModal(true);
                                                }}
                                                disabled={loading}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {showAddTaskModal && <AddTaskModal onClose={() => setShowAddTaskModal(false)} onConfirm={addTaskHandler} />}
            {showEditTaskModal && selectedTask && (
                <EditTaskModal
                    task={selectedTask}
                    onClose={() => {
                        setSelectedTask(null);
                        setShowEditTaskModal(false);
                    }}
                    onConfirm={updateTaskHandler}
                />
            )}
            {showDeleteTaskModal && selectedTask && (
                <DeleteTaskModal
                    taskId={selectedTask.id}
                    onClose={() => {
                        setSelectedTask(null);
                        setShowDeleteTaskModal(false);
                    }}
                    onConfirm={deleteTaskHandler}
                />
            )}
        </>
    );
}
