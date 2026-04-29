import { useState } from "react";
import { register } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import styles from "./AuthForm.module.scss";

function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [fieldErrors, setFieldErrors] = useState({ username: false, password: false });
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsLoading(true);
        setFieldErrors({ username: false, password: false });

        try {
            await register(username.trim(), password.trim());
            toast.success("User created successfully");
            navigate("/login");
        } catch (err) {
            let apiError: string | undefined;

            if (axios.isAxiosError(err)) {
                const data = err.response?.data as unknown;

                if (
                    data &&
                    typeof data === "object" &&
                    "error" in data &&
                    typeof (data as { error?: unknown }).error === "string"
                ) {
                    apiError = (data as { error: string }).error;
                }
            }

            const normalized = (apiError ?? "").toLowerCase();

            if (normalized.includes("required")) {
                setFieldErrors({ username: true, password: true });
            } else if (normalized.includes("already exists")) {
                setFieldErrors({ username: true, password: false });
            }

            toast.error(apiError || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <h2 className={styles.title}>Register</h2>

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
                        Register
                    </button>
                </form>

                <p className={styles.footer}>
                    Already have an account?{" "}
                    <Link className={styles.link} to="/login">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
