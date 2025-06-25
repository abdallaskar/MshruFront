
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router';

export default function LogoutRoute({ children }) {

    const { user } = useAuth();

    if (user) {
        return <Navigate to="/" />;
    }

    return children;
}

