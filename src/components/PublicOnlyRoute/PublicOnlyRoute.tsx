import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store";

type Props = { children: React.ReactNode };

export default function PublicOnlyRoute({ children }: Props) {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
