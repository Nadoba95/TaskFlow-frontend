import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

type Props = { children: React.ReactNode };

export default function ProtectedRoute({ children }: Props) {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return <>{children}</>;
}
