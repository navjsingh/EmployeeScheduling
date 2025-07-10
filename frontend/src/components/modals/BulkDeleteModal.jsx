import React, { useState } from 'react';
import * as api from '../../services/apiService';

function BulkDeleteModal({ selectedUsers, onClose, onSuccess }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleBulkDelete = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const userIds = selectedUsers.map(user => user.id);
            const response = await api.bulkDeleteUsers(userIds);
            setResult(response);
            onSuccess();
        } catch (err) {
            setError(err.message || 'Failed to delete users');
        } finally {
            setLoading(false);
        }
    };

    const adminUsers = selectedUsers.filter(user => user.role === 'ADMIN');
    const deletableUsers = selectedUsers.filter(user => user.role !== 'ADMIN');

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Bulk Delete Users</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                {!result ? (
                    <>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Confirm Deletion
                            </h3>
                            <p className="text-gray-600 mb-4">
                                You are about to delete <strong>{selectedUsers.length}</strong> user(s).
                            </p>

                            {adminUsers.length > 0 && (
                                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                                    <p className="font-semibold">⚠️ Admin users cannot be deleted:</p>
                                    <ul className="mt-2 list-disc list-inside">
                                        {adminUsers.map(user => (
                                            <li key={user.id}>{user.name} ({user.email})</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {deletableUsers.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-semibold text-gray-700 mb-2">Users to be deleted:</p>
                                    <div className="max-h-40 overflow-y-auto border border-gray-200 rounded p-3">
                                        {deletableUsers.map(user => (
                                            <div key={user.id} className="flex justify-between items-center py-1">
                                                <span className="text-gray-700">{user.name}</span>
                                                <span className="text-sm text-gray-500">{user.email}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="p-4 bg-red-50 border border-red-200 rounded">
                                <p className="text-red-700 font-semibold">⚠️ Warning:</p>
                                <ul className="text-red-600 text-sm mt-2 list-disc list-inside">
                                    <li>This action cannot be undone</li>
                                    <li>All user data will be permanently deleted</li>
                                    <li>Associated vacation requests will be lost</li>
                                </ul>
                            </div>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={onClose}
                                disabled={loading}
                                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkDelete}
                                disabled={loading || deletableUsers.length === 0}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center"
                            >
                                {loading && (
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? 'Deleting...' : `Delete ${deletableUsers.length} User(s)`}
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">
                                Deletion Results
                            </h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                                    <p className="font-semibold">✅ Successfully Deleted: {result.deletedCount}</p>
                                </div>
                                <div className="p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                                    <p className="font-semibold">⚠️ Skipped: {result.skippedCount}</p>
                                </div>
                            </div>

                            {result.successes.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-semibold text-gray-700 mb-2">Successfully deleted:</p>
                                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-3 bg-green-50">
                                        {result.successes.map((success, index) => (
                                            <div key={index} className="text-green-700 text-sm py-1">
                                                {success}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {result.errors.length > 0 && (
                                <div className="mb-4">
                                    <p className="font-semibold text-gray-700 mb-2">Errors:</p>
                                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded p-3 bg-red-50">
                                        {result.errors.map((error, index) => (
                                            <div key={index} className="text-red-700 text-sm py-1">
                                                {error}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Close
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BulkDeleteModal; 