import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setNavigate } from "./navigation";

/** Registers react-router navigate for use outside components (e.g. axios interceptors). */
export default function NavigationSetter() {
    const navigate = useNavigate();

    useEffect(() => {
        setNavigate(navigate);
    }, [navigate]);

    return null;
}
