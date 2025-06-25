
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
}
