import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createEvent, updateEvent } from '../lib/api';

export default function EventForm({ initialData, isEdit = false }) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [form, setForm] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: ""
    });

    useEffect(() => {
        if (initialData) {
            // Format date to YYYY-MM-DD for input
            const formattedDate = initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : "";
            setForm({
                ...initialData,
                date: formattedDate
            });
        }
    }, [initialData]);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Clear previous errors

        try {
            if (isEdit) {
                await updateEvent(initialData.id, form);
                toast.success("Event updated successfully");
                navigate(`/events/${initialData.id}`);
            } else {
                const response = await createEvent(form);
                toast.success("Event created successfully");
                // Assuming response.data.id exists or we navigate to list
                navigate('/events');
            }
        } catch (error) {
            console.error("Submission error:", error);
            if (error.details) {
                setErrors(error.details);
            }
            toast.error(error.message || "Failed to save event");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div className="grid grid-cols-1 gap-6">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g. Annual Team Meeting"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                    )}
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows={4}
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Describe your event..."
                    />
                    {errors.description && (
                        <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={form.date}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.date && (
                            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                        <input
                            type="time"
                            id="time"
                            name="time"
                            value={form.time}
                            onChange={handleChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        />
                        {errors.time && (
                            <p className="mt-1 text-sm text-red-600">{errors.time}</p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="e.g. Conference Room A or Zoom Link"
                    />
                    {errors.location && (
                        <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving...
                        </>
                    ) : (isEdit ? "Update Event" : "Create Event")}
                </button>
            </div>
        </form>
    );
}
