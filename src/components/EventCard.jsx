import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

export default function EventCard({ event, isOrganizer }) {
    const date = new Date(event.date).toLocaleDateString(undefined, {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return (
        <Link
            to={`/events/${event.id}`}
            className="group block bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all duration-200 overflow-hidden"
        >
            <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                    <div className="bg-indigo-50 text-indigo-700 text-xs font-bold px-2.5 py-1 rounded-md uppercase tracking-wide">
                        {date}
                    </div>
                    {isOrganizer ? (
                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Organizer</span>
                    ) : (
                        <StatusBadge status={event.my_status} />
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-1">
                    {event.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                    {event.description}
                </p>

                <div className="flex items-center text-sm text-gray-500 gap-4">
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {event.time}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate max-w-[150px]">{event.location}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
