const API_BASE_URL = "http://localhost:8080";

export async function postJson(path, body) {
	const response = await fetch(`${API_BASE_URL}${path}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(body),
	});

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

export async function loginRequest(payload) {
	return postJson("/api/v1/login", payload);
}

export async function registerRequest(payload) {
	return postJson("/api/v1/register", payload);
}
