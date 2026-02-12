import { useState } from "react";
import axios from 'axios';
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim() || !password.trim()) {
            setError('Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/login`, { username, password });
            console.log(response.data);
            navigate("/home")
        } catch (error) {
            console.error('There was an error!', error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-purple-50 flex items-center justify-center p-6">
            <div className="w-full max-w-6xl flex flex-col md:flex-row bg-transparent gap-0 shadow-sm rounded-3xl overflow-hidden">
                {/* Left - purple intro */}
                <div className="md:w-1/2 flex flex-col justify-center px-8 py-12 bg-purple-600 text-white md:rounded-l-3xl">
                    <h1 className="text-4xl font-extrabold heading-tight mb-4">Organize your day — simple, focused to‑dos</h1>
                    <p className="text-purple-100/90 mb-6 text-lg">Quickly capture tasks, prioritize what matters, and complete more every day.</p>
                    <ul className="text-sm text-purple-100 space-y-2 list-disc ml-5">
                        <li>Clean, distraction-free interface</li>
                        <li>Fast task creation & completion</li>
                        <li>Sync-free, local-first experience</li>
                    </ul>
                </div>

                {/* Middle divider */}
                <div className="hidden md:block w-[1px] bg-white/30" />

                {/* Right - login card */}
                <div className="md:w-1/2 flex items-center justify-center px-6 py-12 bg-white md:rounded-r-3xl">
                    <div className="w-full max-w-sm bg-white border border-purple-200 rounded-3xl p-6 shadow-sm">
                        <h2 className="text-2xl font-semibold text-purple-700 mb-2 heading-tight">Welcome back</h2>
                        <p className="text-gray-500 text-sm mb-6">Sign in to continue to your tasks.</p>

                        {error && (
                            <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        <form onSubmit={handleLogin}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400"
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>

                        <div className="mt-4 text-sm text-gray-600">
                            Don't have an account?{' '}
                            <a href="/register" className="text-purple-600 hover:underline">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
