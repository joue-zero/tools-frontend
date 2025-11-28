const API_BASE_URL = "http://localhost:8080";

async function request(path, options = {}) {
	const token = localStorage.getItem("auth_token");
	const headers = {
		"Content-Type": "application/json",
		...options.headers,
	};

	if (token) {
		headers["Authorization"] = `Bearer ${token}`;
	}

	const config = {
		...options,
		headers,
	};

	const response = await fetch(`${API_BASE_URL}${path}`, config);
	const data = await response.json().catch(() => ({}));

	if (!response.ok) {
		const message = data?.message || data?.error || "Request failed";
		const error = new Error(message);
		error.details = data?.errors || null;
		error.status = response.status;
		throw error;
	}
	return data;
}

// Auth
export async function loginRequest(payload) {
	return request("/api/v1/login", { method: "POST", body: JSON.stringify(payload) });
}

export async function registerRequest(payload) {
	return request("/api/v1/register", { method: "POST", body: JSON.stringify(payload) });
}

// Events
export async function createEvent(payload) {
	return request("/api/v1/events", { method: "POST", body: JSON.stringify(payload) });
}

export async function getEvent(id) {
	return request(`/api/v1/events/${id}`, { method: "GET" });
}

export async function updateEvent(id, payload) {
	return request(`/api/v1/events/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export async function deleteEvent(id) {
	return request(`/api/v1/events/${id}`, { method: "DELETE" });
}

export async function getOrganizedEvents() {
	return request("/api/v1/events/organized", { method: "GET" });
}

export async function getInvitedEvents() {
	return request("/api/v1/events/invited", { method: "GET" });
}

export async function getAllEvents() {
	return request("/api/v1/all-events", { method: "GET" });
}

export async function inviteUser(eventId, userIds) {
	return request(`/api/v1/events/${eventId}/invite`, {
		method: "POST",
		body: JSON.stringify({ user_ids: userIds })
	});
}

// Event Status
export async function updateEventStatus(eventId, status) {
	return request(`/api/v1/events/${eventId}/status`, {
		method: "POST",
		body: JSON.stringify({ status })
	});
}

export async function getEventStatus(eventId) {
	return request(`/api/v1/events/${eventId}/status`, { method: "GET" });
}

export async function getEventAttendees(eventId) {
	return request(`/api/v1/events/${eventId}/attendees`, { method: "GET" });
}

export async function getAttendeesByStatus(eventId, status) {
	return request(`/api/v1/events/${eventId}/attendees/status?status=${status}`, { method: "GET" });
}

// Search
export async function searchEvents(params) {
	// params can be an object for body (POST) or query string (GET)
	// The API supports both, let's use POST for advanced search as it's more flexible with body
	return request("/api/v1/search", {
		method: "POST",
		body: JSON.stringify(params)
	});
}

export async function searchEventsByKeyword(keyword) {
	return request(`/api/v1/search/keyword?q=${encodeURIComponent(keyword)}`, { method: "GET" });
}

export async function searchUsers(query) {
	return request(`/api/v1/users/search?q=${encodeURIComponent(query)}`, { method: "GET" });
}
