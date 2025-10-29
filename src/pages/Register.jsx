import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerRequest } from "../lib/api";

export default function Register() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ name: "", email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});

	useEffect(() => {
		const token = localStorage.getItem("auth_token");
		if (token) {
			navigate("/home", { replace: true });
		}
	}, [navigate]);

	function handleChange(e) {
		const { name, value } = e.target;
		setForm((prev) => ({ ...prev, [name]: value }));
		setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError("");
		setFieldErrors({});
		setLoading(true);
		try {
			const data = await registerRequest({
				name: form.name.trim(),
				email: form.email.trim(),
				password: form.password,
			});
			toast.success(data?.message || "Account created successfully. Please login.");
			navigate("/login", { replace: true });
		} catch (err) {
			setError(err.message || "Registration failed");
			if (err.details && typeof err.details === "object") {
				setFieldErrors(err.details);
			}
		} finally {
			setLoading(false);
		}
	}

	const nameError = fieldErrors?.name;
	const emailError = fieldErrors?.email;
	const passwordError = fieldErrors?.password;

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="bg-white shadow-lg rounded-xl p-8">
					<h1 className="text-2xl font-semibold text-gray-900 mb-1">Create account</h1>
					<p className="text-sm text-gray-600 mb-6">Register to get started</p>
					{error ? (
						<div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
							{error}
						</div>
					) : null}
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
							<input
								type="text"
								id="name"
								name="name"
								value={form.name}
								onChange={handleChange}
								required
								className={`block w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${nameError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"}`}
							/>
							{nameError ? (
								<p className="mt-1 text-sm text-red-600">{nameError}</p>
							) : null}
						</div>
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
							<input
								type="email"
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								required
								className={`block w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${emailError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"}`}
							/>
							{emailError ? (
								<p className="mt-1 text-sm text-red-600">{emailError}</p>
							) : null}
						</div>
						<div>
							<label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
							<input
								type="password"
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
								required
								className={`block w-full rounded-lg border px-3 py-2 text-gray-900 shadow-sm focus:outline-none focus:ring-2 ${passwordError ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"}`}
							/>
							{passwordError ? (
								<p className="mt-1 text-sm text-red-600">{passwordError}</p>
							) : null}
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 text-white font-medium px-4 py-2.5 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
						>
							{loading ? "Creating account..." : "Register"}
						</button>
					</form>
					<p className="mt-6 text-sm text-gray-600">
						Already have an account? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">Login</Link>
					</p>
				</div>
				<p className="text-center text-xs text-gray-500 mt-4">Event Planner</p>
			</div>
		</div>
	);
}
