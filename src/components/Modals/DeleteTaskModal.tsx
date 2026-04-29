import styles from "./ModalBase.module.scss";

interface DeleteTaskModalProps {
    taskId: number;
    onClose: () => void;
    onConfirm: (taskId: number) => void;
}

function DeleteTaskModal({ taskId, onClose, onConfirm }: DeleteTaskModalProps) {
    function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        onConfirm(taskId);
        onClose();
    }

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2 className={styles.modalTitle}>Delete Task</h2>
                <form onSubmit={handleSubmit}>
                    <p className={styles.modalDescription}>Are you sure you want to delete this task?</p>
                    <div className={[styles.actions, styles.deleteTaskActions].join(" ")}>
                        <button onClick={onClose}>No</button>
                        <button type="submit">Yes</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default DeleteTaskModal;
