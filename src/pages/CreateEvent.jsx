import EventForm from '../components/EventForm';

export default function CreateEvent() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                <p className="text-gray-500">Fill in the details to schedule your event</p>
            </div>
            <EventForm />
        </div>
    );
}
