import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { loginRequest } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
	const navigate = useNavigate();
	const location = useLocation();
	const { login, user } = useAuth();

	const [form, setForm] = useState({ email: "", password: "" });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [fieldErrors, setFieldErrors] = useState({});

	const from = location.state?.from?.pathname || "/home";

	useEffect(() => {
		if (user) {
			navigate(from, { replace: true });
		}
	}, [user, navigate, from]);

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
			const userData = data?.data?.user || data?.user || null;

			if (token && userData) {
				login(userData, token);
				toast.success(data?.message || "Login successful");
				// Navigation happens in useEffect
			} else {
				throw new Error("Invalid response from server");
			}
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
		<div className="min-h-[calc(100vh-65px)] flex items-center justify-center px-4 bg-gray-50">
			<div className="w-full max-w-md">
				<div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
					<div className="mb-8 text-center">
						<h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
						<p className="text-gray-500">Enter your credentials to access your account</p>
					</div>

					{error && (
						<div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200 flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 flex-shrink-0">
								<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
							</svg>
							{error}
						</div>
					)}

					<form onSubmit={handleSubmit} className="space-y-5">
						<div>
							<label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">Email address</label>
							<input
								type="email"
								id="email"
								name="email"
								value={form.email}
								onChange={handleChange}
								required
								className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${emailError ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"}`}
								placeholder="you@example.com"
							/>
							{emailError && <p className="mt-1.5 text-sm text-red-600 font-medium">{emailError}</p>}
						</div>
						<div>
							<div className="flex items-center justify-between mb-1.5">
								<label htmlFor="password" className="block text-sm font-semibold text-gray-700">Password</label>
								<a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">Forgot password?</a>
							</div>
							<input
								type="password"
								id="password"
								name="password"
								value={form.password}
								onChange={handleChange}
								required
								className={`block w-full rounded-lg border px-4 py-2.5 text-gray-900 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${passwordError ? "border-red-300 focus:border-red-500 focus:ring-red-200" : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-200"}`}
								placeholder="••••••••"
							/>
							{passwordError && <p className="mt-1.5 text-sm text-red-600 font-medium">{passwordError}</p>}
						</div>
						<button
							type="submit"
							disabled={loading}
							className="w-full inline-flex justify-center items-center rounded-lg bg-indigo-600 text-white font-semibold px-4 py-3 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
						>
							{loading ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Signing in...
								</>
							) : "Sign in"}
						</button>
					</form>
					<div className="mt-8 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account? <Link to="/register" className="text-indigo-600 hover:text-indigo-500 font-semibold hover:underline">Create an account</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}

