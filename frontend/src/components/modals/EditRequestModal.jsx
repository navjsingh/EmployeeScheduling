import React from 'react';
import * as api from '../../services/apiService';

function EditRequestModal({ request, onClose }) {
    const handleCancelRequest = async () => {
        if (window.confirm('Are you sure you want to cancel this request?')) {
            try {
                await api.deleteRequest(request.id);
                onClose();
            } catch (err) {
                alert('Failed to cancel request: ' + err.message);
            }
        }
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 
                    className="text-2xl font-bold mb-4">
                    Cancel Request
                </h2>
                <p 
                    className="mb-4">
                    Would you like to cancel your vacation request for 
                    {new Date(request.startDate).toLocaleDateString()} to 
                    {new Date(request.endDate).toLocaleDateString()}?
                </p>
                <p 
                    className="mb-6 text-sm text-gray-600">
                    This action cannot be undone. If it was an approved request, 
                    the hours will be returned to your balance.
                </p>
                <div className="flex justify-between items-center">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
                        Close
                    </button>
                    <button 
                        onClick={handleCancelRequest} 
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                        Yes, Cancel Request
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EditRequestModal;