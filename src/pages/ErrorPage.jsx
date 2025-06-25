

import { useNavigate } from 'react-router';
import { Ghost } from 'lucide-react';

const ErrorPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 text-gray-800 p-6">
            <Ghost className="w-24 h-24 text-blue-600 animate-bounce mb-4" />

            <h1 className="text-5xl font-bold mb-2">404</h1>
            <p className="text-xl mb-6">Oops! The page you're looking for doesn't exist.</p>

            <button
                color="primary"
                onClick={() => navigate('/')}
                className="rounded-full px-8 py-3 text-lg shadow-md transition-all duration-300 hover:scale-105 cursor-pointer"
            >
                Go Back Home
            </button>
        </div>
    );
};

export default ErrorPage;
