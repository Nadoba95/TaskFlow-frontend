import { useState } from "react";
import { getMe, login } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import styles from "./AuthForm.module.scss";
import { setTokens, setUser } from "../store/slices/auth-slice";
import { useDispatch } from "react-redux";

function hasStringArrayProp(value: unknown, key: string): value is Record<string, string[]> {
    if (!value || typeof value !== "object") return false;
    if (!(key in value)) return false;
    const prop = (value as Record<string, unknown>)[key];
    return Array.isArray(prop) && prop.every((x) => typeof x === "string");
}

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ username: false, password: false });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({ username: false, password: false });

        try {
            const { access, refresh } = await login(username, password);
            dispatch(setTokens({ access, refresh }));
            const user = await getMe();
            dispatch(setUser(user));
            navigate("/");
        } catch (err) {
            let apiError: string | undefined;
            let nextFieldErrors = { username: false, password: false };
            let isCredentialError = false;

            if (axios.isAxiosError(err)) {
                const data = err.response?.data as unknown;

                // DRF field errors e.g. { username: ["This field may not be blank."] }
                if (hasStringArrayProp(data, "username")) {
                    nextFieldErrors.username = true;
                }
                if (hasStringArrayProp(data, "password")) {
                    nextFieldErrors.password = true;
                }

                // DRF auth error e.g. { detail: "No active account found..." }
                if (
                    data &&
                    typeof data === "object" &&
                    "detail" in data &&
                    typeof (data as { detail?: unknown }).detail === "string"
                ) {
                    const detail = (data as { detail: string }).detail;
                    apiError =
                        detail === "No active account found with the given credentials"
                            ? "Invalid username or password"
                            : detail;
                    nextFieldErrors = { username: true, password: true };
                    isCredentialError = true;
                }
            }

            if (nextFieldErrors.username || nextFieldErrors.password) {
                setFieldErrors(nextFieldErrors);
            }

            const toastMessage = isCredentialError
                ? apiError || "Invalid credentials"
                : nextFieldErrors.username && nextFieldErrors.password
                ? "Username and password are required"
                : nextFieldErrors.username
                ? "Username is required"
                : nextFieldErrors.password
                ? "Password is required"
                : apiError || "Login failed";

            toast.error(toastMessage);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h2 className={styles.title}>Login</h2>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <input
                        className={`${styles.input} ${fieldErrors.username ? styles.inputError : ""}`}
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (fieldErrors.username) setFieldErrors((prev) => ({ ...prev, username: false }));
                        }}
                        placeholder="Username"
                        aria-label="Username"
                        aria-invalid={fieldErrors.username}
                    />

                    <input
                        className={`${styles.input} ${fieldErrors.password ? styles.inputError : ""}`}
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (fieldErrors.password) setFieldErrors((prev) => ({ ...prev, password: false }));
                        }}
                        placeholder="Password"
                        aria-label="Password"
                        aria-invalid={fieldErrors.password}
                    />

                    <button className={styles.button} type="submit" disabled={isLoading}>
                        Login
                    </button>
                </form>

                <p className={styles.footer}>
                    Don't have an account?{" "}
                    <Link className={styles.link} to="/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Login;
