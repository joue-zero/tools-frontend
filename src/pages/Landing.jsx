import { Link } from 'react-router-dom';

export default function Landing() {
    return (
        <div className="flex min-h-[calc(100vh-65px)] flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50 px-4 text-center">
            <div className="max-w-3xl space-y-8">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
                    Plan your next event <span className="text-indigo-600">with ease</span>
                </h1>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                    Streamline your event planning process. Manage guests, schedules, and details all in one place.
                    Join thousands of successful event planners today.
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Link
                        to="/login"
                        className="rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-indigo-500 hover:shadow-xl transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Get Started
                    </Link>
                    <Link
                        to="/register"
                        className="rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-md ring-1 ring-inset ring-gray-200 hover:bg-gray-50 hover:ring-gray-300 transition-all"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
