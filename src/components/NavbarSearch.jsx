import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganizedEvents, getInvitedEvents } from '../lib/api';
import StatusBadge from './StatusBadge';

export default function NavbarSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim().length >= 1) {
                performSearch();
            } else {
                setResults([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [query]);

    async function performSearch() {
        setLoading(true);
        try {
            const [organized, invited] = await Promise.all([
                getOrganizedEvents().catch(() => ({ data: [] })),
                getInvitedEvents().catch(() => ({ data: [] }))
            ]);

            const organizedEvents = (organized.data || []).map(e => ({ ...e, _role: 'organizer' }));
            const invitedEvents = (invited.data || []).map(e => ({ ...e, _role: 'attendee' }));

            // Combine and remove duplicates (prefer organizer role if both exist, though unlikely)
            const allEventsMap = new Map();

            organizedEvents.forEach(e => allEventsMap.set(e.id, e));
            invitedEvents.forEach(e => {
                if (!allEventsMap.has(e.id)) {
                    allEventsMap.set(e.id, e);
                }
            });

            const allEvents = Array.from(allEventsMap.values());

            const lowerQuery = query.toLowerCase();
            
            const filtered = allEvents.filter(event => {
                console.log(event.date);
                return event.title.toLowerCase().includes(lowerQuery) ||
                (event.description && event.description.toLowerCase().includes(lowerQuery))
                || (event.location && event.location.toLowerCase().includes(lowerQuery))
                || (event.date && event.date.toLowerCase().includes(lowerQuery))
                || (event.time && event.time.toLowerCase().includes(lowerQuery))
               
            });
            
            // const filtered = allEvents.filter(event =>
            //     event.title.toLowerCase().includes(lowerQuery) ||
            //     (event.description && event.description.toLowerCase().includes(lowerQuery))
            //     || (event.date && event.date.toLowerCase().includes(lowerQuery))
            //     || (event.time && event.time.toLowerCase().includes(lowerQuery))
               
            // );

            setResults(filtered);
            setIsOpen(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    function handleSelect(eventId) {
        setIsOpen(false);
        setQuery("");
        navigate(`/events/${eventId}`);
    }

    return (
        <div className="relative w-full max-w-md mx-4 hidden md:block" ref={wrapperRef}>
            <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                    </svg>
                </div>
                <input
                    type="text"
                    className="block w-full rounded-md border-0 bg-gray-100 py-1.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="Search your events, date(YYYY-MM-DD) or time(HH:MM)..."
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        if (e.target.value.length >= 2) setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (query.length >= 2) setIsOpen(true);
                    }}
                />
                {loading && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent"></div>
                    </div>
                )}
            </div>

            {isOpen && results.length > 0 && (
                <ul className="absolute z-10 mt-1 max-h-80 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                    {results.map((event) => (
                        <li
                            key={event.id}
                            className="relative cursor-pointer select-none py-3 pl-3 pr-4 hover:bg-indigo-50 border-b border-gray-50 last:border-0"
                            onClick={() => handleSelect(event.id)}
                        >
                            <div className="flex justify-between items-center gap-4">
                                <div className="min-w-0 flex-1">
                                    <span className="block truncate font-medium text-gray-900">{event.title}</span>
                                    <span className="block truncate text-xs text-gray-500">{new Date(event.date).toLocaleDateString()}</span>
                                </div>
                                <div className="flex-shrink-0">
                                    {event._role === 'organizer' ? (
                                        <span className="inline-flex items-center rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700">Organizer</span>
                                    ) : (
                                        <StatusBadge status={event.my_status} />
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            {isOpen && results.length === 0 && query.length >= 2 && !loading && (
                <div className="absolute z-10 mt-1 w-full rounded-md bg-white py-2 px-3 text-sm text-gray-500 shadow-lg ring-1 ring-black ring-opacity-5">
                    No events found.
                </div>
            )}
        </div>
    );
}
