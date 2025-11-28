import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AuthLayout from './layouts/AuthLayout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import OrganizedEvents from './pages/OrganizedEvents';
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import EventDetails from './pages/EventDetails';
import EditEvent from './pages/EditEvent';
function App() {
	return (
		<AuthProvider>
			<Routes>
				{/* Public Routes */}
				<Route element={<PublicLayout />}>
					<Route path="/" element={<Landing />} />
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>

				{/* Protected Routes */}
				<Route element={<AuthLayout />}>
					<Route path="/home" element={<Home />} />
					<Route path="/events" element={<Events />} />
					<Route path="/events/organized" element={<OrganizedEvents />} />
					<Route path="/events/create" element={<CreateEvent />} />
					<Route path="/events/:id" element={<EventDetails />} />
					<Route path="/events/:id/edit" element={<EditEvent />} />
				</Route>

				{/* Fallback */}
				<Route path="*" element={<Navigate to="/" replace />} />
			</Routes>
			<Toaster position="top-center" />
		</AuthProvider>
	);
}

export default App;
