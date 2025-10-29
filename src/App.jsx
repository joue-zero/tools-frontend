import { Routes, Route, Navigate, Link, Outlet, useNavigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'

function Landing() {
	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="max-w-md w-full text-center">
				<h1 className="text-3xl font-semibold mb-2">Event Planner</h1>
				<p className="text-gray-600 mb-6">Please login or register to get started</p>
				<div className="flex items-center justify-center gap-3">
					<Link to="/login" className="inline-flex items-center rounded-lg bg-indigo-600 text-white font-medium px-4 py-2.5 hover:bg-indigo-700">Login</Link>
					<Link to="/register" className="inline-flex items-center rounded-lg border border-gray-300 text-gray-900 font-medium px-4 py-2.5 hover:bg-gray-50">Register</Link>
				</div>
			</div>
		</div>
	);
}

function PublicLayout() {
	return (
		<div>
			<header className="border-b bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<Link to="/" className="text-base font-semibold text-gray-900">Event Planner</Link>
					<nav className="flex items-center gap-4 text-sm">
						<Link to="/login" className="text-gray-700 hover:text-indigo-700">Login</Link>
						<Link to="/register" className="text-gray-700 hover:text-indigo-700">Register</Link>
					</nav>
				</div>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}

function AuthLayout() {
	const navigate = useNavigate();
	const user = (() => {
		try {
			return JSON.parse(localStorage.getItem('auth_user')) || null;
		} catch {
			return null;
		}
	})();
	const token = localStorage.getItem('auth_token');

	function handleLogout() {
		localStorage.removeItem('auth_token');
		localStorage.removeItem('auth_user');
		navigate('/login', { replace: true });
	}

	// Simple guard: if no token, bounce to login
	if (!token) {
		navigate('/login', { replace: true });
		return null;
	}

	return (
		<div>
			<header className="border-b bg-white">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<Link to="/home" className="text-base font-semibold text-gray-900">Event Planner</Link>
					<nav className="flex items-center gap-4 text-sm">
						<Link to="/home" className="text-gray-700 hover:text-indigo-700">Home</Link>
						{user ? <span className="text-gray-600">Hi, {user.name}</span> : null}
						<button onClick={handleLogout} className="text-gray-700 hover:text-indigo-700">Logout</button>
					</nav>
				</div>
			</header>
			<main>
				<Outlet />
			</main>
		</div>
	);
}

function App() {
	return (
		<div>
			<Routes>
				<Route element={<PublicLayout />}>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>
				<Route element={<AuthLayout />}>
					<Route path="/home" element={<Home />} />
				</Route>
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster position="top-center" />
		</div>
	)
}

export default App
