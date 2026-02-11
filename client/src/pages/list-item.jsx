import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ListItem() {
    const location = useLocation();
    const navigate = useNavigate();
    const { listId, listTitle } = location.state || {};
    const [desc, setDesc] = useState("");
    const [items, setItems] = useState([]);
    const [editingItem, setEditingItem] = useState(null);
    const [editDesc, setEditDesc] = useState("");
    const [itemStatus, setItemStatus] = useState("pending");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [addingItem, setAddingItem] = useState(false);

    const fetchItems = async () => {
        try {
            const response = await axios.post(`${API_URL}/get-items`, { listId });
            setItems(response.data.items);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const handleAddItem = async () => {
        if (!desc.trim()) {
            setError("Please enter a description");
            return;
        }

        setAddingItem(true);
        setError("");
        try {
            const response = await axios.post(`${API_URL}/add-items`, { listId, desc, status: itemStatus });
            setDesc("");
            setItemStatus("pending");
            setError("");
            setSuccess("Item added successfully");
            fetchItems();
        } catch (error) {
            console.error("Error adding item:", error);
            setError(error.response?.data?.message || "Error adding item");
        } finally {
            setAddingItem(false);
        }
    };

    const handleEditClick = (item) => {
        setEditingItem(item.id);
        setEditDesc(item.description);
    };

    const handleSaveEdit = async () => {
        if (!editDesc.trim()) {
            setError("Description cannot be empty");
            return;
        }

        try {
            const response = await axios.post(`${API_URL}/edit-items`, { id: editingItem, desc: editDesc });
            setEditingItem(null);
            setError("");
            setSuccess("Item updated successfully");
            fetchItems();
        } catch (error) {
            console.error("Error updating item:", error);
            setError(error.response?.data?.message || "Error updating item");
        }
    };

    const handleCancelEdit = () => {
        setEditingItem(null);
        setEditDesc("");
    };

    const handleDeleteItem = async (id) => {
        try {
            const response = await axios.post(`${API_URL}/delete-items`, { id });
            setError("");
            setSuccess("Item deleted successfully");
            fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            setError(error.response?.data?.message || "Error deleting item");
        }
    };

    useEffect(() => {
        if (listId) {
            fetchItems();
        }
    }, [listId]);

    if (!listId) {
        return (
            <div className="min-h-screen bg-purple-50 flex flex-col items-center justify-center p-6">
                <div className="bg-white p-8 rounded-[2rem] shadow-xl text-center max-w-sm w-full border border-purple-100">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p className="text-gray-600 mb-6 font-medium">No list selected. Please choose a list from the home page.</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="w-full px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 rounded-xl transition-all shadow-lg shadow-purple-200 font-bold active:scale-95"
                    >
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-purple-50">
            <div className="p-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <button
                        onClick={() => navigate('/home')}
                        className="bg-white border border-purple-200 text-purple-700 hover:bg-purple-50 px-6 py-2 rounded-xl transition-all shadow-sm hover:shadow-md active:scale-95 font-semibold flex items-center gap-2 mb-6"
                    >
                        <span>←</span> Back
                    </button>
                    <div>
                        <h1 className="text-3xl font-extrabold text-purple-900">{listTitle}</h1>
                        <p className="text-purple-600/60 text-sm mt-1 font-medium">Manage your items for this list</p>
                    </div>
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

                <div className="grid grid-cols-1 gap-8">
                    {/* Add Item Section */}
                    <div className="bg-white border border-purple-100 p-8 rounded-[2rem] shadow-xl shadow-purple-900/5">
                        <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center gap-2">
                            <span>✨</span> Add New Task
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold mb-2 text-purple-900/70 uppercase">Description</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30 transition-all font-medium"
                                    value={desc}
                                    onChange={(e) => {
                                        setDesc(e.target.value);
                                        if (error) setError("");
                                    }}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold mb-2 text-purple-900/70 uppercase">Status</label>
                                <select
                                    className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/30 transition-all font-medium"
                                    value={itemStatus}
                                    onChange={(e) => setItemStatus(e.target.value)}
                                >
                                    <option value="pending">Pending</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <button
                            onClick={handleAddItem}
                            disabled={addingItem}
                            className="w-full py-4 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-lg shadow-purple-200 font-bold text-lg active:scale-[0.98]"
                        >
                            {addingItem ? 'Adding to list...' : 'Add Task to List'}
                        </button>
                    </div>

                    {/* Items Section */}
                    <div className="bg-white border border-purple-100 p-8 rounded-[2rem] shadow-xl shadow-purple-900/5">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">Tasks ({items.length})</h2>
                            <div className="h-1 flex-1 mx-4 bg-purple-50 rounded-full"></div>
                        </div>

                        {items.length === 0 ? (
                            <div className="text-center py-12 bg-purple-50/30 rounded-2xl border-2 border-dashed border-purple-100">
                                <div className="text-4xl mb-4">🎯</div>
                                <p className="text-gray-500 font-medium">No tasks yet. Ready to start?</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((item) => (
                                    <div key={item.id} className="bg-white border border-purple-50 p-6 rounded-2xl hover:shadow-md transition-all group border-l-4 border-l-purple-400">
                                        {editingItem === item.id ? (
                                            <div className="space-y-4">
                                                <input
                                                    type="text"
                                                    value={editDesc}
                                                    onChange={(e) => setEditDesc(e.target.value)}
                                                    className="w-full px-4 py-2 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 bg-purple-50/50"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="flex-1 px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-lg font-bold transition-all"
                                                    >
                                                        Save Changes
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-4 py-2 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-lg font-bold transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <p className={`text-lg font-medium mb-2 ${item.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                                        {item.description}
                                                    </p>
                                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.status === 'completed' ? 'bg-green-100 text-green-700' :
                                                        item.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                                                            'bg-purple-100 text-purple-700'
                                                        }`}>
                                                        {item.status}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={() => handleEditClick(item)}
                                                        className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-100 rounded-lg transition-all"
                                                        title="Edit Task"
                                                    >
                                                        <span className="text-sm px-1 font-bold">Edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id)}
                                                        className="p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-all"
                                                        title="Delete Task"
                                                    >
                                                        <span className="text-sm px-1 font-bold">Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ListItem;
