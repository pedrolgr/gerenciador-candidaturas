import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function PrivateRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Carregando...</div>; // Or a proper spinner component
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/signin" replace />;
}
