import { useLocation, Navigate } from 'react-router-dom'
import useAuth from "./useAuth";

function RequireAuth({ children }) {
    const { authed } = useAuth();
    const location = useLocation();

    return authed === true ? (
        children
    ) : (
        <Navigate to="/login" replace state={{ path: location.pathname }} />
    );
}

export default RequireAuth;