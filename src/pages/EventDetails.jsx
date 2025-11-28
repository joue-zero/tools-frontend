import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEvent, deleteEvent, updateEventStatus, getEventStatus } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import GuestList from '../components/GuestList';
import StatusBadge from '../components/StatusBadge';

export default function EventDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [myStatus, setMyStatus] = useState(null);
    const [updatingStatus, setUpdatingStatus] = useState(false);

    useEffect(() => {
        loadEventDetails();
    }, [id]);

    async function loadEventDetails() {
        try {
            const [eventData, statusData] = await Promise.all([
                getEvent(id),
                getEventStatus(id).catch(() => null) // Ignore error if status not found
            ]);

            setEvent(eventData.data);
            if (statusData && statusData.data) {
                setMyStatus(statusData.data.status);
            }
        } catch (error) {
            toast.error("Failed to load event details");
            navigate('/events');
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete() {
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await deleteEvent(id);
            toast.success("Event deleted successfully");
            navigate('/events');
        } catch (error) {
            toast.error(error.message || "Failed to delete event");
        }
    }

    async function handleStatusChange(newStatus) {
        setUpdatingStatus(true);
        try {
            await updateEventStatus(id, newStatus);
            setMyStatus(newStatus);
            toast.success(`Status updated to ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        } finally {
            setUpdatingStatus(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!event) return null;

    const isOrganizer = event.participants?.some(p => p.user_id === user?.id && p.role === 'organizer');

    // Check if event is past
    // Assuming event.date is ISO string YYYY-MM-DD... and event.time is HH:MM
    const eventDateStr = event.date.split('T')[0];
    const eventDateTime = new Date(`${eventDateStr}T${event.time}`);
    const isPast = eventDateTime < new Date();

    const date = new Date(event.date).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 sm:p-8">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className="bg-indigo-100 text-indigo-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                    {date}
                                </span>
                                {isOrganizer && (
                                    <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                        Organizer
                                    </span>
                                )}
                                {isPast && (
                                    <span className="bg-gray-100 text-gray-800 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wide">
                                        Past Event
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{event.title}</h1>
                            <div className="flex items-center text-gray-500 gap-6 text-sm">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {event.time}
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {isOrganizer ? (
                                <>
                                    <Link
                                        to={`/events/${id}/edit`}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={handleDelete}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                    >
                                        Delete
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-end gap-2">
                                    <div className={`flex items-center gap-2 bg-gray-50 p-1.5 rounded-lg border border-gray-200 ${isPast ? 'opacity-50 pointer-events-none' : ''}`}>
                                        <button
                                            onClick={() => handleStatusChange('going')}
                                            disabled={updatingStatus || isPast}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${myStatus === 'going' ? 'bg-green-100 text-green-800 shadow-sm' : 'text-gray-600 hover:bg-white'}`}
                                        >
                                            Going
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('maybe')}
                                            disabled={updatingStatus || isPast}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${myStatus === 'maybe' ? 'bg-yellow-100 text-yellow-800 shadow-sm' : 'text-gray-600 hover:bg-white'}`}
                                        >
                                            Maybe
                                        </button>
                                        <button
                                            onClick={() => handleStatusChange('not_going')}
                                            disabled={updatingStatus || isPast}
                                            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${myStatus === 'not_going' ? 'bg-red-100 text-red-800 shadow-sm' : 'text-gray-600 hover:bg-white'}`}
                                        >
                                            Not Going
                                        </button>
                                    </div>
                                    {isPast && (
                                        <span className="text-xs text-gray-500">Event has ended</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="prose max-w-none text-gray-600">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">About this event</h3>
                        <p className="whitespace-pre-wrap">{event.description}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    {/* Placeholder for future features like comments or map */}
                </div>
                <div>
                    {isOrganizer && <GuestList eventId={id} isOrganizer={isOrganizer} />}
                </div>
            </div>
        </div>
    );
}
