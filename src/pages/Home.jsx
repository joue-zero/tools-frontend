import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
	const navigate = useNavigate();
	const [user, setUser] = useState(null);

	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		const userData = localStorage.getItem("auth_user");
		
		if (!token) {
			navigate("/login", { replace: true });
			return;
		}

		if (userData) {
			try {
				setUser(JSON.parse(userData));
			} catch (err) {
				console.error("Failed to parse user data:", err);
			}
		}
	}, [navigate]);

	const handleLogout = () => {
		localStorage.removeItem("auth_token");
		localStorage.removeItem("auth_user");
		navigate("/login", { replace: true });
	};

	if (!user) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
					<p className="mt-2 text-gray-600">Loading...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				<div className="bg-white rounded-lg shadow-sm p-6">
					<div className="flex items-center justify-between mb-6">
						<div>
							<h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
							<p className="text-gray-600">Manage your events and stay organized</p>
						</div>
						<button
							onClick={handleLogout}
							className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
						>
							Logout
						</button>
					</div>
					
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						<div className="bg-indigo-50 rounded-lg p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-indigo-500 rounded-md flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
										</svg>
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
									<p className="text-sm text-gray-600">0 events scheduled</p>
								</div>
							</div>
						</div>

						<div className="bg-green-50 rounded-lg p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
										</svg>
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-medium text-gray-900">Guests</h3>
									<p className="text-sm text-gray-600">0 total guests</p>
								</div>
							</div>
						</div>

						<div className="bg-purple-50 rounded-lg p-6">
							<div className="flex items-center">
								<div className="flex-shrink-0">
									<div className="w-8 h-8 bg-purple-500 rounded-md flex items-center justify-center">
										<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
										</svg>
									</div>
								</div>
								<div className="ml-4">
									<h3 className="text-lg font-medium text-gray-900">Analytics</h3>
									<p className="text-sm text-gray-600">View insights</p>
								</div>
							</div>
						</div>
					</div>

					<div className="mt-8">
						<h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
							<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
								<div className="text-sm font-medium text-gray-900">Create Event</div>
								<div className="text-sm text-gray-500">Plan a new event</div>
							</button>
							<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
								<div className="text-sm font-medium text-gray-900">Invite Guests</div>
								<div className="text-sm text-gray-500">Send invitations</div>
							</button>
							<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
								<div className="text-sm font-medium text-gray-900">View Calendar</div>
								<div className="text-sm text-gray-500">See all events</div>
							</button>
							<button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 text-left">
								<div className="text-sm font-medium text-gray-900">Settings</div>
								<div className="text-sm text-gray-500">Manage account</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
