import { useState } from "react";
import styles from "./ModalBase.module.scss";
import type { Task } from "../../types";
import StatusDropdown from "../StatusDropdown/StatusDropdown";

interface EditTaskModalProps {
    task: Task;
    onClose: () => void;
    onConfirm: (taskId: number, task: Partial<Task>) => void;
}

function EditTaskModal({ task, onClose, onConfirm }: EditTaskModalProps) {
    const [editedTask, setEditedTask] = useState<Task>(task);
    const [errors, setErrors] = useState({ title: false, description: false });

    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        const title = editedTask.title.trim();
        const description = editedTask.description.trim();

        const nextErrors = { title: title.length === 0, description: description.length === 0 };
        setErrors(nextErrors);

        if (nextErrors.title || nextErrors.description) return;

        onConfirm(task.id, { ...editedTask, title, description });
        onClose();
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Edit Task</h2>
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={editedTask.title}
                            className={errors.title ? styles.fieldError : ""}
                            onChange={(e) => {
                                setEditedTask({ ...editedTask, title: e.target.value });
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
                            value={editedTask.description}
                            className={errors.description ? styles.fieldError : ""}
                            onChange={(e) => {
                                setEditedTask({ ...editedTask, description: e.target.value });
                                if (errors.description) setErrors((prev) => ({ ...prev, description: false }));
                            }}
                            aria-invalid={errors.description}
                        />
                        {errors.description && <div className={styles.errorText}>Description is required</div>}
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="status">Status</label>
                        <StatusDropdown
                            id="status"
                            value={editedTask.status}
                            onChange={(status) => setEditedTask({ ...editedTask, status })}
                            portal
                        />
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

export default EditTaskModal;
