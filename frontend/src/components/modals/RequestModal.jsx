import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import * as api from '../../services/apiService';

const parseDateString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

function RequestModal({ date, onClose}) {
  const { user } = useAuth();
  const [endDate, setEndDate] = useState(date.toISOString().split('T')[0]);
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
 
  const countWeekdays = (start, end) => {
        let count = 0;
        const curDate = new Date(start.getTime());
        while (curDate <= end) {
            const dayOfWeek = curDate.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
            curDate.setDate(curDate.getDate() + 1);
        }
        return count;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const startDateObj = date;
        const endDateObj = parseDateString(endDate);
        const requestedHours = countWeekdays(startDateObj, endDateObj) * 8;

        if (requestedHours <= 0) {
            setError('Request must include at least one weekday.');
            setLoading(false);
            return;
        }

        try {
            await api.createRequest({
                startDate: startDateObj.toISOString().split('T')[0],
                endDate: endDateObj.toISOString().split('T')[0],
                note,
                requestedHours,
            });
            onClose();
        } catch (err) {
            setError(err.message || 'Failed to create request.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Request Time Off</h2>
                {error && 
                    <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                        {error}
                    </p>}
                <p className="mb-4 text-sm text-gray-600">
                    Available Hours: 
                        <span className="font-bold">
                            {user.totalVacationHours - user.usedVacationHours}
                        </span>
                </p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        value={date.toLocaleDateString()} readOnly 
                        className="w-full px-4 py-2 border rounded-lg bg-gray-100" />
                    <input 
                        type="date" 
                        value={endDate} 
                        onChange={(e) => setEndDate(e.target.value)} min={date.toISOString().split('T')[0]} required 
                        className="w-full px-4 py-2 border rounded-lg" />
                    <textarea 
                        placeholder="Note (optional)" 
                        value={note} onChange={(e) => setNote(e.target.value)} 
                        rows="3" 
                        className="w-full px-4 py-2 border rounded-lg">    
                    </textarea>
                    <div className="flex justify-end space-x-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-4 py-2 bg-gray-200 rounded-lg">
                                Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-400">
                             {loading ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default RequestModal;