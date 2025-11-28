import { useState, useEffect } from 'react';
import { inviteUser, getEventAttendees, searchUsers } from '../lib/api';
import toast from 'react-hot-toast';
import StatusBadge from './StatusBadge';

export default function GuestList({ eventId, isOrganizer }) {
    const [attendees, setAttendees] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    // Search & Invite State
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [inviting, setInviting] = useState(false);

    useEffect(() => {
        loadAttendees();
    }, [eventId]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                performSearch(searchQuery);
            } else {
                setSearchResults([]);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    async function loadAttendees() {
        try {
            const data = await getEventAttendees(eventId);
            if (data && data.data) {
                if (Array.isArray(data.data.attendees)) {
                    setAttendees(data.data.attendees);
                } else {
                    setAttendees([]);
                }

                // Set stats if available
                const { going, maybe, not_going, no_response, total } = data.data;
                if (typeof total === 'number') {
                    setStats({ going, maybe, not_going, no_response, total });
                }
            } else {
                setAttendees([]);
            }
        } catch (error) {
            console.error("Failed to load attendees", error);
            setAttendees([]);
        } finally {
            setLoading(false);
        }
    }

    async function performSearch(query) {
        setIsSearching(true);
        try {
            const data = await searchUsers(query);
            if (data && data.success && Array.isArray(data.data)) {
                setSearchResults(data.data);
            } else {
                setSearchResults([]);
            }
        } catch (error) {
            console.error("Search failed", error);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    }

    function handleSelectUser(user) {
        setSelectedUser(user);
        setSearchQuery("");
        setSearchResults([]);
    }

    function handleClearSelection() {
        setSelectedUser(null);
    }

    async function handleInvite() {
        if (!selectedUser) return;

        setInviting(true);
        try {
            await inviteUser(eventId, [selectedUser.id]);
            toast.success(`Invitation sent to ${selectedUser.name}`);
            setSelectedUser(null);
            loadAttendees();
        } catch (error) {
            toast.error(error.message || "Failed to invite user");
        } finally {
            setInviting(false);
        }
    }

    if (loading) {
        return <div className="text-sm text-gray-500">Loading attendees...</div>;
    }

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <h3 className="font-semibold text-gray-900">Guest List</h3>
                <span className="text-xs font-medium bg-white px-2.5 py-1 rounded-full border border-gray-200 text-gray-600">
                    {Array.isArray(attendees) ? attendees.length : 0} Guests
                </span>
            </div>

            {isOrganizer && stats && (
                <div className="grid grid-cols-4 border-b border-gray-200 bg-gray-50 divide-x divide-gray-200">
                    <div className="p-3 text-center">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Going</div>
                        <div className="mt-1 text-lg font-semibold text-green-600">{stats.going}</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Maybe</div>
                        <div className="mt-1 text-lg font-semibold text-yellow-600">{stats.maybe}</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">No Reply</div>
                        <div className="mt-1 text-lg font-semibold text-gray-600">{stats.no_response}</div>
                    </div>
                    <div className="p-3 text-center">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider">Not Going</div>
                        <div className="mt-1 text-lg font-semibold text-red-600">{stats.not_going}</div>
                    </div>
                </div>
            )}

            <div className="p-6">
                {isOrganizer && (
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Invite Guests
                        </label>

                        {!selectedUser ? (
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search users by name or email..."
                                    className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                {isSearching && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
                                    </div>
                                )}

                                {searchResults.length > 0 && (
                                    <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                        {searchResults.map((user) => (
                                            <li
                                                key={user.id}
                                                onClick={() => handleSelectUser(user)}
                                                className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-50 cursor-pointer"
                                            >
                                                <div className="flex items-center">
                                                    <span className="font-medium block truncate">{user.name}</span>
                                                    <span className="ml-2 text-gray-500 truncate text-xs">({user.email})</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg border border-indigo-100">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {selectedUser.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-indigo-900">{selectedUser.name}</p>
                                        <p className="text-xs text-indigo-700">{selectedUser.email}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleInvite}
                                        disabled={inviting}
                                        className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
                                    >
                                        {inviting ? "Sending..." : "Send Invite"}
                                    </button>
                                    <button
                                        onClick={handleClearSelection}
                                        disabled={inviting}
                                        className="inline-flex items-center rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 border border-gray-300"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {!Array.isArray(attendees) || attendees.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                        No guests invited yet.
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {attendees.map((attendee) => (
                            <li key={attendee.user_id} className="py-3 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                                        {attendee.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{attendee.name}</p>
                                        <p className="text-xs text-gray-500">{attendee.email}</p>
                                    </div>
                                </div>
                                <StatusBadge status={attendee.status} />
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
