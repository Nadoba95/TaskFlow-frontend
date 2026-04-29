import { useState } from "react";
import styles from "./ModalBase.module.scss";
import type { Task } from "../../types";

interface AddTaskModalProps {
    onClose: () => void;
    onConfirm: (newTask: Omit<Task, "id">) => void;
}

function AddTaskModal({ onClose, onConfirm }: AddTaskModalProps) {
    const [newTask, setNewTask] = useState<Omit<Task, "id">>({ title: "", description: "", status: "todo" });
    const [errors, setErrors] = useState({ title: false, description: false });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const title = newTask.title.trim();
        const description = newTask.description.trim();

        const nextErrors = { title: title.length === 0, description: description.length === 0 };
        setErrors(nextErrors);

        if (nextErrors.title || nextErrors.description) return;

        onConfirm({ ...newTask, title, description });
        onClose();
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Add Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={newTask.title}
                            className={errors.title ? styles.fieldError : ""}
                            onChange={(e) => {
                                setNewTask({ ...newTask, title: e.target.value });
                                if (errors.title) setErrors((prev) => ({ ...prev, title: false }));
                            }}
                            aria-invalid={errors.title}
                        />
                        {errors.title && <div className={styles.errorText}>Title is required</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={newTask.description}
                            className={errors.description ? styles.fieldError : ""}
                            onChange={(e) => {
                                setNewTask({ ...newTask, description: e.target.value });
                                if (errors.description) setErrors((prev) => ({ ...prev, description: false }));
                            }}
                            aria-invalid={errors.description}
                        />
                        {errors.description && <div className={styles.errorText}>Description is required</div>}
                    </div>
                    <div className={styles.actions}>
                        <button type="button" onClick={onClose}>
                            Close
                        </button>
                        <button type="submit">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddTaskModal;
