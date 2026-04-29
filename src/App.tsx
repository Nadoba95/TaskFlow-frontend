import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Tasks from "./pages/Tasks";
import Register from "./pages/Register";
import Login from "./pages/Login";
import { useSelector } from "react-redux";
import type { RootState } from "./store";
import Header from "./components/Header/Header";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import PublicOnlyRoute from "./components/PublicOnlyRoute/PublicOnlyRoute";

function App() {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    return (
        <main>
            <Toaster position={isAuthenticated ? "top-right" : "top-center"} />
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Tasks />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <PublicOnlyRoute>
                            <Login />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <PublicOnlyRoute>
                            <Register />
                        </PublicOnlyRoute>
                    }
                />
                <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
            </Routes>
        </main>
    );
}

export default App;
