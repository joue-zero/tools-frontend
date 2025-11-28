import { Link, Outlet } from 'react-router-dom';

export default function PublicLayout() {
    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                    <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-indigo-600 hover:text-indigo-500 transition-colors">
                        <span>Event Planner</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link to="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
                            Login
                        </Link>
                        <Link
                            to="/register"
                            className="rounded-full bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all"
                        >
                            Register
                        </Link>
                    </nav>
                </div>
            </header>
            <main>
                <Outlet />
            </main>
        </div>
    );
}
