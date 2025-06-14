import React, { useState } from 'react';
import * as api from '../../services/apiService';

function DecisionModal({ request, onClose }) {
    const [reason, setReason] = useState(request.denialReason || '');
    const [loading, setLoading] = useState(false);

    const handleDecision = async (status) => {
        setLoading(true);
        const payload = {
            status,
            denialReason: status === 'DENIED' ? (reason || 'No reason provided.') : '',
        };
        try {
            await api.updateRequestStatus(request.id, payload);
            onClose();
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Review Request</h2>
                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <p>
                        <strong>Employee:</strong> 
                        {request.employeeName}
                    </p>
                    <p>
                        <strong>Dates:</strong> 
                        {new Date(request.startDate).toLocaleDateString()} to 
                        {new Date(request.endDate).toLocaleDateString()}
                    </p>
                    <p>
                        <strong>Status:</strong> 
                        {request.status}
                    </p>
                    {request.note && 
                        <p>
                            <strong>Note:</strong> 
                            {request.note}
                        </p>}
                </div>
                <div className="mb-4">
                    <label 
                        htmlFor="reason" 
                        className="block text-sm font-medium text-gray-700">
                            Reason for Denial (if applicable)
                    </label>
                    <textarea 
                        id="reason" 
                        value={reason} 
                        onChange={(e) => setReason(e.target.value)} 
                        rows="3" 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                    </textarea>
                </div>
                <div className="flex justify-between">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Cancel
                    </button>
                    <div className="space-x-2">
                        <button 
                            onClick={() => handleDecision('DENIED')} 
                            disabled={loading} 
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-red-400">
                            Deny
                        </button>
                        <button 
                            onClick={() => handleDecision('APPROVED')} 
                            disabled={loading} 
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400">
                            Approve
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DecisionModal;