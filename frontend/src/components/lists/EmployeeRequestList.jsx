import React, { useState } from 'react';
import EditRequestModal from '../modals/EditRequestModal';

function EmployeeRequestList({ requests, onAction }) {
  const [editingRequest, setEditingRequest] = useState(null);

  const statusColors = {
    APPROVED: 'text-green-600 bg-green-100',
    PENDING: 'text-yellow-600 bg-yellow-100',
    DENIED: 'text-red-600 bg-red-100',
  };

  const getStatusColor = (status) => statusColors[status] || 'text-gray-600 bg-gray-100';

  return (
        <div className="space-y-3">
            {requests.map(req => (
                <div 
                  key={req.id} 
                  className="p-4 bg-gray-50 rounded-lg border flex justify-between items-center">
                    <div>
                        <p className="font-semibold">
                          {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                        </p>
                        {req.note && <p className="text-sm text-gray-500 mt-1 italic">Note: "{req.note}"</p>}
                        {req.denialReason && <p className="text-sm text-red-500 mt-1">Reason for denial: {req.denialReason}</p>}
                    </div>
                    <div className="flex items-center space-x-4">
                        <span className={`px-3 py-1 text-sm font-bold rounded-full 
                          ${getStatusColor(req.status)}`}>
                            {req.status}
                        </span>
                        
                        <button 
                          onClick={() => 
                          setEditingRequest(req)} 
                          className="text-sm text-blue-600 hover:underline">
                          Edit/Cancel
                        </button>
                    </div>
                </div>
            ))}
            {editingRequest && 
              <EditRequestModal 
                request={editingRequest} 
                onClose={() => setEditingRequest(null)} 
                onAction={onAction} 
              />}
        </div>
  );
}

export default EmployeeRequestList;