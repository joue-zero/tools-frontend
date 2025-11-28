import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { getOrganizedEvents, getInvitedEvents } from '../lib/api';

export default function Home() {
	const { user } = useAuth();
	const [stats, setStats] = useState({
		organized: 0,
		invited: 0,
		loading: true
	});

	useEffect(() => {
		loadStats();
	}, []);

	async function loadStats() {
		try {
			const [organizedData, invitedData] = await Promise.all([
				getOrganizedEvents().catch(() => ({ data: [] })),
				getInvitedEvents().catch(() => ({ data: [] }))
			]);

			setStats({
				organized: organizedData.data?.length || 0,
				invited: invitedData.data?.length || 0,
				loading: false
			});
		} catch (error) {
			console.error("Failed to load stats", error);
			setStats(prev => ({ ...prev, loading: false }));
		}
	}

	if (!user) {
		return null;
	}

	return (
		<div className="space-y-6">
			<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
				<div className="mb-8">
					<h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name}!</h1>
					<p className="text-gray-500 mt-1">Here's what's happening with your events.</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<Link to="/events" state={{ tab: 'organized' }} className="block group">
						<div className="bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 rounded-xl p-6 shadow-sm group-hover:shadow-md transition-all">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-indigo-600 rounded-lg text-white shadow-md">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
								<div>
									<p className="text-sm font-medium text-indigo-600">Organized Events</p>
									<p className="text-2xl font-bold text-gray-900">
										{stats.loading ? "..." : stats.organized}
									</p>
								</div>
							</div>
						</div>
					</Link>

					<Link to="/events" state={{ tab: 'invited' }} className="block group">
						<div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 rounded-xl p-6 shadow-sm group-hover:shadow-md transition-all">
							<div className="flex items-center gap-4">
								<div className="p-3 bg-emerald-600 rounded-lg text-white shadow-md">
									<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
									</svg>
								</div>
								<div>
									<p className="text-sm font-medium text-emerald-600">Invited To</p>
									<p className="text-2xl font-bold text-gray-900">
										{stats.loading ? "..." : stats.invited}
									</p>
								</div>
							</div>
						</div>
					</Link>
				</div>

				<div className="mt-10">
					<h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
						<Link to="/events/create" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left">
							<div className="flex items-center justify-between mb-2">
								<div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
								</div>
							</div>
							<div className="font-semibold text-gray-900">Create Event</div>
							<div className="text-sm text-gray-500 mt-1">Start planning a new event</div>
						</Link>

						<Link to="/events/organized" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left">
							<div className="flex items-center justify-between mb-2">
								<div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
									</svg>
								</div>
							</div>
							<div className="font-semibold text-gray-900">Invite Guests</div>
							<div className="text-sm text-gray-500 mt-1">Send invitations to people</div>
						</Link>

						<Link to="/events" className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left">
							<div className="flex items-center justify-between mb-2">
								<div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</div>
							</div>
							<div className="font-semibold text-gray-900">View Calendar</div>
							<div className="text-sm text-gray-500 mt-1">See your schedule</div>
						</Link>

						<button className="group p-4 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all text-left">
							<div className="flex items-center justify-between mb-2">
								<div className="p-2 bg-indigo-50 rounded-lg text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
									<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
									</svg>
								</div>
							</div>
							<div className="font-semibold text-gray-900">Settings</div>
							<div className="text-sm text-gray-500 mt-1">Manage your account</div>
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
