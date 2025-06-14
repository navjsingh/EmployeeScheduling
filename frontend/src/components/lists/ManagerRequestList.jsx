import React, { useState } from 'react';
import DecisionModal from '../modals/DecisionModal';

function ManagerRequestList({ requests, onAction }) {
  
  const [reviewingRequest, setReviewingRequest] = useState(null);

  const statusColors =  {
    APPROVED: 'bg-green-50',
    DENIED: 'bg-red-50',
  };

  const getStatusBgColor = (status) => statusColors[status] || 'bg-yellow-50';

  return (
    <div className="space-y-4">
        {requests.map(req => (
            <div 
              key={req.id} 
              className={`p-4 rounded-lg border flex justify-between items-center ${getStatusBgColor(req.status)}`}>
                <div>
                    <p className="font-bold">{req.employeeName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()}
                    </p>
                    <p className={`text-sm font-bold mt-1`}>{req.status}</p>
                </div>
                <button onClick={() => 
                  setReviewingRequest(req)} 
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm">
                  Review
                </button>
            </div>
        ))}
        {reviewingRequest && 
        <DecisionModal 
          request={reviewingRequest} 
          onClose={() => setReviewingRequest(null)} 
          onAction={onAction} />}
    </div>
  );
}


export default ManagerRequestList;