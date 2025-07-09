import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService';

function UserDetailModal({ user, onClose, onUpdate, onDelete }) {
    const [formData, setFormData] = useState({
        role: '',
        teamId: '',
        totalVacationHours: 0,
        usedVacationHours: 0
    });
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        fetchTeams();
        if (user) {
            setFormData({
                role: user.role || '',
                teamId: user.teamId || '',
                totalVacationHours: user.totalVacationHours || 0,
                usedVacationHours: user.usedVacationHours || 0
            });
        }
    }, [user]);

    const fetchTeams = async () => {
        try {
            const teamsData = await api.getAllTeams();
            setTeams(teamsData);
        } catch (err) {
            console.error('Failed to fetch teams:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const updateData = {
                ...formData,
                teamId: formData.teamId || null
            };
            
            await api.updateUser(user.id, updateData);
            onUpdate();
        } catch (err) {
            setError(err.message || 'Failed to update user');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        setLoading(true);
        setError('');

        try {
            await api.deleteUser(user.id);
            onDelete();
        } catch (err) {
            setError(err.message || 'Failed to delete user');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (!user) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {/* Read-only Information */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Basic Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={user.name}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={user.email}
                                disabled
                                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Editable Information */}
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                required
                            >
                                <option value="">Select Role</option>
                                <option value="EMPLOYEE">Employee</option>
                                <option value="MANAGER">Manager</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                            <select
                                name="teamId"
                                value={formData.teamId}
                                onChange={handleChange}
                                disabled={loading}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            >
                                <option value="">No Team</option>
                                {teams.map(team => (
                                    <option key={team.id} value={team.id}>{team.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Total Vacation Hours</label>
                            <input
                                type="number"
                                name="totalVacationHours"
                                value={formData.totalVacationHours}
                                onChange={handleChange}
                                disabled={loading}
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Used Vacation Hours</label>
                            <input
                                type="number"
                                name="usedVacationHours"
                                value={formData.usedVacationHours}
                                onChange={handleChange}
                                disabled={loading}
                                min="0"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-between">
                        <div className="flex space-x-3">
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center"
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'Updating...' : 'Update User'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(true)}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                Delete User
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                    </div>
                </form>

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirm Delete</h3>
                            <p className="text-gray-600 mb-6">
                                Are you sure you want to delete <strong>{user.name}</strong>? This action cannot be undone.
                            </p>
                            <div className="flex justify-end space-x-3">
                                <button
                                    onClick={() => setShowDeleteConfirm(false)}
                                    disabled={loading}
                                    className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                >
                                    {loading ? 'Deleting...' : 'Delete'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserDetailModal; 