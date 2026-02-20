import Header from "../components/header";
import { useState, useEffect } from "react";
import axios from "axios";
import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function home() {
    const [title, setTitle] = useState("");
    const [status, setStatus] = useState("");
    const navigate = useNavigate();
    const [lists, setLists] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const handleLogout = async () => {
        try {
            const response = await axios.post(`${API_URL}/logout`);
            console.log(response.data);
            setSuccess(response.data?.message || "Logged out Successfully");
            setTimeout(() => navigate("/"), 1000);
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleAdd = async () => {
    try {
        const response = await axios.post(`${API_URL}/add-list`, {
            title,
            status,
        });

        setSuccess(response.data?.message || "List Added successfully");
        console.log(response.data);

        fetchList();
        resetForm();

    } catch (error) {
        console.error(
            "There was an error!",
            error.response?.data || error.message
        );
        setError(
            error.response?.data?.message || error.message || "An error occurred"
        );
    }
};

    const handleEditSubmit = async () => {
    try {
        const response = await axios.post(`${API_URL}/edit-list`, {
            id: editingItem.id,
            title,
            status,
        });

        setSuccess(response.data?.message || "List Updated successfully");
        console.log(response.data);

        fetchList();
        resetForm();

    } catch (error) {
        console.error(
            "There was an error!",
            error.response?.data || error.message
        );
        setError(
            error.response?.data?.message || error.message || "An error occurred"
        );
    }
};
    const resetForm = () => {
    setTitle("");
    setStatus("");
    setEditingItem(null);
    setShowForm(false);
    navigate("/home");
};
    
   const handleSubmit = async () => {
    if (editingItem) {
        await handleEditSubmit();
    } else {
        await handleAdd();
    }
};
    const handleDelete = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/delete-list`, { id });
            console.log(response.data);
            setSuccess(response.data?.message || "List Deleted successfully");
            fetchList();
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    const handleEdit = (item) => {
        setTitle(item.title);
        setStatus(item.status);
        setEditingItem(item);
        setShowForm(true);
    };

    const handleOpen = (item) => {
        navigate('/list-item', { state: { listId: item.id, listTitle: item.title } });
    };
  

    const fetchList = async () => {
        try {
            const response = await axios.get(`${API_URL}/get-list`);
            console.log(response.data);
            setLists(response.data.list);
        } catch (error) {
            console.error(
                "There was an error!",
                error.response?.data || error.message,
            );
            setError(
                error.response?.data?.message || error.message || "An error occurred",
            );
        }
    };

    useEffect(() => {
        fetchList();
    }, []);

    return (
        <div className="min-h-screen bg-purple-50">
            <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-extrabold text-purple-900">My Tasks</h1>
                    <button
                        onClick={handleLogout}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 font-medium"
                    >
                        Logout
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 text-sm mb-6 p-4 rounded-xl shadow-sm animate-pulse">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-50 border border-green-200 text-green-600 text-sm mb-6 p-4 rounded-xl shadow-sm">
                        {success}
                    </div>
                )}

                <div className="bg-white border border-purple-100 p-8 rounded-[2rem] shadow-xl shadow-purple-900/5">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Your Lists</h2>
                            <p className="text-gray-500 text-sm mt-1">Manage and organize your tasks effectively.</p>
                        </div>
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl transition-all shadow-lg shadow-purple-200 active:scale-95 font-semibold flex items-center gap-2"
                        >
                            <span className="text-xl leading-none">+</span> Add New List
                        </button>
                    </div>

                    {/* Modal form (appears as centered dialog) */}
                    {showForm && (
                        <div
                            className="fixed inset-0 z-40 flex items-center justify-center bg-black/40"
                            onClick={() => {
                                setShowForm(false);
                                setEditingItem(null);
                                setTitle("");
                                setStatus("");
                            }}
                        >
                            <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg" onClick={(e) => e.stopPropagation()}>
                                <h3 className="text-xl font-bold mb-6 text-purple-900 flex items-center gap-2">
                                    {editingItem ? "✏️ Edit List" : "✨ Create New List"}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-purple-900/70 uppercase">List Title</label>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 text-purple-900/70 uppercase">Status</label>
                                        <select
                                            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent bg-white shadow-sm transition-all"
                                            value={status}
                                            onChange={(e) => setStatus(e.target.value)}
                                        >
                                            <option value="">Select status...</option>
                                            <option value="Pending">Pending</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={() => {
                                            setShowForm(false);
                                            setEditingItem(null);
                                            setTitle("");
                                            setStatus("");
                                        }}
                                        className="px-6 py-3 bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 rounded-xl transition-all font-semibold"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        className="px-8 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold active:scale-95"
                                    >
                                        {editingItem ? "Update Changes" : "Create List"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {lists.length === 0 ? (
                        <div className="text-center py-16 bg-purple-50/50 rounded-2xl border-2 border-dashed border-purple-100">
                            <div className="text-4xl mb-4">📝</div>
                            <p className="text-gray-500 font-medium">No lists yet. Create your first list to get started!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {lists.map((item, index) => (
                                <div key={item.id || index} className="bg-white border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start gap-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                                            <p className="text-xs text-gray-400 mt-2">{item.description || ''}</p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.status === 'Completed' ? 'bg-green-100 text-green-700' : item.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpen(item)}
                                            className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-all active:scale-90 text-sm"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleEdit(item)}
                                            className="px-3 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-all active:scale-90 text-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all active:scale-90 text-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}


                </div>
            </div>
        </div>
    );
}

export default home;
