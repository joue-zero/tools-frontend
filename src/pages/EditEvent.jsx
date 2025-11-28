import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getEvent } from '../lib/api';
import EventForm from '../components/EventForm';
import toast from 'react-hot-toast';

export default function EditEvent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadEvent();
    }, [id]);

    async function loadEvent() {
        try {
            const data = await getEvent(id);
            setEvent(data.data);
        } catch (error) {
            toast.error("Failed to load event");
            navigate('/events');
        } finally {
            setLoading(false);
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

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
                <p className="text-gray-500">Update the details for "{event.title}"</p>
            </div>
            <EventForm initialData={event} isEdit={true} />
        </div>
    );
}
