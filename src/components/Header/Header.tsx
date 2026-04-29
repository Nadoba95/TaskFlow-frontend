import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../store/slices/auth-slice";
import type { RootState } from "../../store";
import styles from "./Header.module.scss";

function Header() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const user = useSelector((state: RootState) => state.auth.user);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    return (
        <header className={styles.header}>
            <div className={styles.brand}>
                <span className={styles.brandMark} aria-hidden="true" />
                <span className={styles.brandText}>TaskFlow</span>
            </div>

            {isAuthenticated && (
                <div className={styles.userInfo}>
                    <span className={styles.userName}>User: {user?.username || "Guest"}</span>
                    <button
                        className={styles.logoutButton}
                        type="button"
                        onClick={() => {
                            dispatch(logout());
                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    );
}

export default Header;
