import { Link, Outlet, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import NavbarSearch from '../components/NavbarSearch';

export default function AuthLayout() {
    const { user, token, logout } = useAuth();
    const location = useLocation();

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-1 items-center gap-8">
                        <Link to="/home" className="text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-500 transition-colors">
                            Event Planner
                        </Link>
                        <NavbarSearch />
                    </div>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/home" className="text-gray-600 hover:text-indigo-600 transition-colors">
                            Home
                        </Link>
                        <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
                            {user && (
                                <span className="text-gray-900">
                                    Hi, <span className="font-semibold">{user.name}</span>
                                </span>
                            )}
                            <button
                                onClick={logout}
                                className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-colors"
                            >
                                Logout
                            </button>
                        </div>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                <Outlet />
            </main>
        </div>
    );
}
