import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginRequest } from "../lib/api";

export default function Login() {
	const navigate = useNavigate();
	const [form, setForm] = useState({ email: "", password: "" });
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
			const data = await loginRequest({
				email: form.email.trim(),
				password: form.password,
			});
			const token = data?.data?.token || data?.token || data?.accessToken || data?.jwt;
			const user = data?.data?.user || data?.user || null;
			if (token) {
				localStorage.setItem("auth_token", token);
			}
			if (user) {
				localStorage.setItem("auth_user", JSON.stringify(user));
			}
			toast.success(data?.message || "Login successful");
			navigate("/home", { replace: true });
		} catch (err) {
			setError(err.message || "Login failed");
			if (err.details && typeof err.details === "object") {
				setFieldErrors(err.details);
			}
		} finally {
			setLoading(false);
		}
	}

	const emailError = fieldErrors?.email;
	const passwordError = fieldErrors?.password;

	return (
		<div className="min-h-screen flex items-center justify-center px-4">
			<div className="w-full max-w-md">
				<div className="bg-white shadow-lg rounded-xl p-8">
					<h1 className="text-2xl font-semibold text-gray-900 mb-1">Welcome back</h1>
					<p className="text-sm text-gray-600 mb-6">Login to your account</p>
					{error ? (
						<div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
							{error}
						</div>
					) : null}
					<form onSubmit={handleSubmit} className="space-y-4">
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
							{loading ? "Logging in..." : "Login"}
						</button>
					</form>
					<p className="mt-6 text-sm text-gray-600">
						Don&apos;t have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">Register</Link>
					</p>
				</div>
				<p className="text-center text-xs text-gray-500 mt-4">Event Planner</p>
			</div>
		</div>
	);
}
