import { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';


function register() {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (!name.trim() || !username.trim() || !password.trim() || !confirmPass.trim()) {
            setError('Please fill in all fields');
            return;
        }

        if (password !== confirmPass) {
            setError('Passwords do not match');
            return;
        }


        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/register`, { name, username, password, confirm: confirmPass });
            console.log(response.data);
            navigate("/");
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

                {/* Left - register card */}
                <div className="md:w-1/2 flex items-center justify-center px-6 py-12 bg-white md:rounded-l-3xl">
                    <div className="w-full max-w-sm bg-white border border-purple-200 rounded-3xl p-6 shadow-sm">
                        <h1 className="text-2xl font-bold mb-2 text-purple-700">Create Account</h1>
                      
                        {error && (
                            <p className="text-red-600 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</p>
                        )}

                        <form onSubmit={handleRegister}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Username</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400"
                                    value={username}
                                    onChange={(e) => {
                                        setUsername(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <div className="mb-5">
                                <label className="block text-sm font-medium mb-1 text-gray-700">Confirm Password</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-purple-200 rounded-lg focus:outline-none focus:border-purple-400"
                                    value={confirmPass}
                                    onChange={(e) => {
                                        setConfirmPass(e.target.value);
                                        if (error) setError('');
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>

                        <div className="mt-4 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <a href="/" className="text-purple-600 hover:underline">Login here</a>
                        </div>
                    </div>
                </div>

                {/* Middle divider */}
                <div className="hidden md:block w-[1px] bg-gray-200/60" />

                {/* Right - purple description */}
                <div className="md:w-1/2 flex flex-col justify-center px-8 py-12 bg-purple-600 text-white md:rounded-r-3xl">
                    <h2 className="text-3xl font-extrabold heading-tight mb-4">Create your free account</h2>
                    <p className="text-purple-100/90 mb-6 text-lg">Keep your day organized — add tasks, mark progress, and stay focused with a minimalist to‑do app.</p>
                    <ul className="text-sm text-purple-100 space-y-2 list-disc ml-5">
                        <li>Unlimited lists and tasks</li>
                        <li>Quick keyboard-first workflow</li>
                        <li>Lightweight & battery friendly</li>
                    </ul>
                </div>

            </div>
        </div>
    );
}

export default register;