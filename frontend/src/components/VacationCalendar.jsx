import React, { useState, useEffect } from 'react';
import * as api from '../services/apiService';

function VacationCalendar({ selectedTeam, selectedManager, onTeamChange, onManagerChange, teams, managers }) {
    const [vacationRequests, setVacationRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        if (selectedTeam && selectedManager) {
            fetchVacationRequests();
        } else {
            setVacationRequests([]);
        }
    }, [selectedTeam, selectedManager]);

    const fetchVacationRequests = async () => {
        setLoading(true);
        try {
            // TODO: Update API to filter by team and manager
            const requests = await api.getRequests();
            // Filter requests by selected team and manager
            const filtered = requests.filter(r =>
                (!selectedTeam || r.employeeTeam === selectedTeam.name) &&
                (!selectedManager || r.managerId === selectedManager.id)
            );
            setVacationRequests(filtered);
        } catch (err) {
            console.error('Failed to fetch vacation requests:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        return { daysInMonth, startingDayOfWeek };
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const isDateInRange = (date, startDate, endDate) => {
        const checkDate = new Date(date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return checkDate >= start && checkDate <= end;
    };

    const getVacationRequestsForDate = (date) => {
        return vacationRequests.filter(request => 
            isDateInRange(date, request.startDate, request.endDate)
        );
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'APPROVED': return 'bg-green-100 text-green-800';
            case 'PENDING': return 'bg-yellow-100 text-yellow-800';
            case 'DENIED': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), i));
    }

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    if (loading) return <div className="text-center py-8">Loading calendar...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Team and Manager Selection */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                        <select
                            value={selectedTeam?.id || ''}
                            onChange={(e) => {
                                const team = teams.find(t => t.id == e.target.value);
                                onTeamChange(team);
                            }}
                            className="p-2 border border-gray-300 rounded-lg"
                        >
                            <option value="">Select Team</option>
                            {teams.map(team => (
                                <option key={team.id} value={team.id}>{team.name}</option>
                            ))}
                        </select>
                    </div>
                    {selectedTeam && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Manager</label>
                            <select
                                value={selectedManager?.id || ''}
                                onChange={(e) => {
                                    const manager = managers.find(m => m.id == e.target.value);
                                    onManagerChange(manager);
                                }}
                                className="p-2 border border-gray-300 rounded-lg"
                            >
                                <option value="">Select Manager</option>
                                {managers.map(manager => (
                                    <option key={manager.id} value={manager.id}>{manager.name}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            {selectedTeam && selectedManager ? (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Vacation Calendar</h2>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={goToPreviousMonth}
                                className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                                ← Previous
                            </button>
                            <span className="text-lg font-semibold">{monthName}</span>
                            <button
                                onClick={goToNextMonth}
                                className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                                Next →
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {/* Day headers */}
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="p-2 text-center font-semibold text-gray-600 bg-gray-50">
                                {day}
                            </div>
                        ))}

                        {/* Calendar days */}
                        {days.map((date, index) => (
                            <div
                                key={index}
                                className={`min-h-24 p-2 border border-gray-200 ${
                                    date ? 'bg-white' : 'bg-gray-50'
                                }`}
                            >
                                {date && (
                                    <>
                                        <div className="text-sm font-medium text-gray-700 mb-1">
                                            {date.getDate()}
                                        </div>
                                        <div className="space-y-1">
                                            {getVacationRequestsForDate(date).map(request => (
                                                <div
                                                    key={request.id}
                                                    className={`text-xs p-1 rounded ${getStatusColor(request.status)}`}
                                                    title={`${request.employeeName}: ${request.note}`}
                                                >
                                                    <div className="font-medium truncate">
                                                        {request.employeeName}
                                                    </div>
                                                    <div className="text-xs opacity-75">
                                                        {request.status}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Legend */}
                    <div className="mt-6 flex justify-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-green-100 border border-green-300 rounded"></div>
                            <span className="text-sm text-gray-600">Approved</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded"></div>
                            <span className="text-sm text-gray-600">Pending</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded"></div>
                            <span className="text-sm text-gray-600">Denied</span>
                        </div>
                    </div>
                </>
            ) : (
                <div className="text-center py-8 text-gray-400">
                    {!selectedTeam ? 'Please select a team to view the vacation calendar.' : 'Please select a manager to view the vacation calendar.'}
                </div>
            )}
        </div>
    );
}

export default VacationCalendar; 