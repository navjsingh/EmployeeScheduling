import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../services/apiService';
import CalendarView from '../components/CalendarView';
import ManagerRequestList from '../components/lists/ManagerRequestList';
import EmployeeRequestList from '../components/lists/EmployeeRequestList';

function DashboardPage() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const fetchRequests = async () => {
        try {
            setLoading(true);
            const data = await api.getRequests();
            setRequests(data);
        } catch (err) {
            setError('Failed to fetch vacation requests.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleRequestAction = () => {
        fetchRequests();
    };

    if (loading) return <div>Loading dashboard...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left div for Requests */}
      <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
         {user.role === 'MANAGER' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Team Vacation Requests</h2>
                  <ManagerRequestList 
                      requests={requests.filter(req => new Date(req.endDate) >= new Date())} 
                      onAction={handleRequestAction} 
                  />
                </div>
            )}

            {user.role === 'EMPLOYEE' && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">My Requests</h2>
                  <EmployeeRequestList 
                      requests={requests.filter(r => r.employeeId === user.id)} 
                      onAction={handleRequestAction} 
                  />
                </div>
            )}
      </div>

      {/* Right div for Calendar */}
      <div className="lg:col-span-2">
        <div className="p-6 bg-white rounded-xl shadow-lg">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Vacation Calendar</h2>
                {user.role === 'EMPLOYEE' && 
                  <div className="text-md font-semibold text-gray-700 bg-gray-100 px-4 py-2 rounded-lg">
                    Hours Remaining: {user.totalVacationHours - user.usedVacationHours}
                  </div>}
            </div>
            <CalendarView 
                requests={requests} 
                onAction={handleRequestAction}
            />
        </div>
      </div>
      
    </div>
  );
}

export default DashboardPage;