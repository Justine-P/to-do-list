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
        <div className="min-h-screen bg-purple-50 flex items-center justify-center p-4">
            <div className="w-full max-w-sm">
                <div className="bg-white border border-purple-200 rounded-3xl p-6">
                    <h1 className="text-2xl font-bold text-center mb-2 text-purple-700">Login</h1>
                    <p className="text-center text-gray-500 text-sm mb-6">Welcome back!</p>

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

                    <div className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="text-purple-600 hover:underline">
                            Sign up
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
