import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getOrganizedEvents, getInvitedEvents, searchEventsByKeyword } from '../lib/api';
import EventCard from '../components/EventCard';
import { useAuth } from '../context/AuthContext';

export default function Events() {
    const { user } = useAuth();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(location.state?.tab || 'organized');
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        setSearchQuery("");
        loadEvents();
    }, [activeTab]);

    async function loadEvents() {
        setLoading(true);
        try {
            let data;
            if (activeTab === 'organized') {
                data = await getOrganizedEvents();
            } else {
                data = await getInvitedEvents();
            }
            setEvents(data?.data || []);
        } catch (error) {
            console.error("Failed to load events", error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSearch(e) {
        e.preventDefault();
        if (!searchQuery.trim()) {
            loadEvents();
            return;
        }

        setLoading(true);
        try {
            // Fetch all events for the current tab to filter them
            let data;
            if (activeTab === 'organized') {
                data = await getOrganizedEvents();
            } else {
                data = await getInvitedEvents();
            }

            const allEvents = data?.data || [];
            const query = searchQuery.toLowerCase();
            const filtered = allEvents.filter(event =>
                event.title.toLowerCase().includes(query) ||
                (event.description && event.description.toLowerCase().includes(query)) ||
                (event.location && event.location.toLowerCase().includes(query))
                || (event.date && event.date.toLowerCase().includes(query))
                || (event.time && event.time.toLowerCase().includes(query))
                || (event._role && event._role.toLowerCase().includes(query))
                || (event.my_status && event.my_status.toLowerCase().includes(query))
            
            );

            setEvents(filtered);
        } catch (error) {
            console.error("Search failed", error);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Events</h1>
                    <p className="text-gray-500">Manage your events and invitations</p>
                </div>
                <Link
                    to="/events/create"
                    className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create Event
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <nav className="flex -mb-px">
                        <button
                            onClick={() => setActiveTab('organized')}
                            className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${activeTab === 'organized' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Organized by Me
                        </button>
                        <button
                            onClick={() => setActiveTab('invited')}
                            className={`flex-1 py-4 px-1 text-center border-b-2 text-sm font-medium ${activeTab === 'invited' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                        >
                            Invited To
                        </button>
                    </nav>
                </div>

                <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <form onSubmit={handleSearch} className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-indigo-500 focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            placeholder="Search events by keyword..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>

                <div className="p-6">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="text-center py-12">
                            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {activeTab === 'organized' ? "You haven't organized any events yet." : "You haven't been invited to any events yet."}
                            </p>
                            {activeTab === 'organized' && (
                                <div className="mt-6">
                                    <Link
                                        to="/events/create"
                                        className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        Create New Event
                                    </Link>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map(event => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    isOrganizer={activeTab === 'organized'}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
