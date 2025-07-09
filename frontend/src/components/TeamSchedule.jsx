import React, { useState, useEffect, useRef } from 'react';
import * as api from '../services/apiService';

const SHIFT_COLORS = {
    '8-17': 'bg-green-200', // 8am-5pm
    '9-18': 'bg-blue-200', // 9am-6pm
    '10-19': 'bg-purple-200', // 10am-7pm
    'night': 'bg-gray-300', // Night shift
};

function TeamSchedule({ selectedTeam }) {
    const [employees, setEmployees] = useState([]);
    const [teams, setTeams] = useState([]);
    const [vacationRequests, setVacationRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [visibleDays, setVisibleDays] = useState(7);
    const [filters, setFilters] = useState({
        search: '',
        team: '',
        role: '',
    });
    const [showCsvImport, setShowCsvImport] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        fetchData();
        fetchTeamData();
    }, []);

    useEffect(() => {
        if (teams.length > 0) {
            fetchTeamData();
        }
    }, [filters, teams]);

    const fetchData = async () => {
        try {
            const teamsData = await api.getAllTeams();
            setTeams(teamsData);
        } catch (err) {
            console.error('Failed to fetch teams:', err);
        }
    };

    const fetchTeamData = async () => {
        if (teams.length === 0) return;
        
        setLoading(true);
        try {
            const [usersData, requestsData] = await Promise.all([
                api.getAllUsers(),
                api.getRequests()
            ]);
            
            // Filter employees based on team filter
            let allEmployees = usersData.filter(user => user.role === 'EMPLOYEE');
            
            if (filters.team) {
                allEmployees = allEmployees.filter(user => user.teamName === filters.team);
            }
            
            // Apply search filter
            if (filters.search) {
                allEmployees = allEmployees.filter(e =>
                    e.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                    e.email.toLowerCase().includes(filters.search.toLowerCase())
                );
            }
            
            setEmployees(allEmployees);
            setVacationRequests(requestsData);
        } catch (err) {
            console.error('Failed to fetch team data:', err);
        } finally {
            setLoading(false);
        }
    };

    const getDatesForRange = (startDate, days) => {
        const dates = [];
        for (let i = 0; i < days; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const formatTime = (hour) => {
        return `${hour}:00`;
    };

    // Example: shiftData = [{ employeeId, date, startHour, endHour, type }]
    // For demo, color code 8-17 as green, 9-18 as blue
    const getShiftColor = (start, end) => {
        if (start === 8 && end === 17) return SHIFT_COLORS['8-17'];
        if (start === 9 && end === 18) return SHIFT_COLORS['9-18'];
        if (start === 10 && end === 19) return SHIFT_COLORS['10-19'];
        if (start >= 22 || end <= 6) return SHIFT_COLORS['night'];
        return 'bg-gray-100';
    };

    // For demo, fake shift data
    const getShiftsForEmployee = (employee, date) => {
        // TODO: Replace with real shift data from backend
        // Example: 8-17 for even days, 9-18 for odd days
        const day = date.getDate();
        if (day % 2 === 0) return [{ start: 8, end: 17 }];
        if (day % 3 === 0) return [{ start: 9, end: 18 }];
        if (day % 5 === 0) return [{ start: 10, end: 19 }];
        if (day % 7 === 0) return [{ start: 22, end: 6 }]; // Night shift
        return [];
    };

    const dates = getDatesForRange(currentDate, visibleDays);
    const hours = Array.from({ length: 24 }, (_, i) => i);

    if (loading) return <div className="text-center py-8">Loading schedule...</div>;

    return (
        <div className="bg-white rounded-lg shadow p-6">
            {/* Filters and CSV Import */}
            <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
                <div className="flex gap-2 flex-wrap">
                    <input
                        type="text"
                        placeholder="Search employee..."
                        value={filters.search}
                        onChange={e => setFilters({ ...filters, search: e.target.value })}
                        className="p-2 border border-gray-300 rounded-lg"
                    />
                    <select
                        value={filters.team}
                        onChange={e => setFilters({ ...filters, team: e.target.value })}
                        className="p-2 border border-gray-300 rounded-lg"
                    >
                        <option value="">All Teams</option>
                        {teams.map(team => (
                            <option key={team.id} value={team.name}>{team.name}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={() => setShowCsvImport(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                    Import Shifts (CSV)
                </button>
            </div>

            {/* Schedule Table */}
            <div className="overflow-x-auto" ref={scrollRef} style={{ scrollbarWidth: 'thin', scrollbarColor: '#CBD5E0 #F7FAFC' }}>
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="flex border-b">
                        {/* Employee Name Column */}
                        <div className="w-48 flex-shrink-0 bg-gray-50 font-semibold text-gray-700 border-r p-3 sticky left-0 z-10">
                            Employee
                        </div>
                        {/* Day Columns */}
                        {dates.map(date => (
                            <div key={date.toISOString()} className="w-[1200px] flex-shrink-0 border-r">
                                <div className="bg-gray-50 font-semibold text-gray-700 text-center p-3 border-b">
                                    {formatDate(date)}
                                </div>
                                {/* Hour Headers */}
                                <div className="flex bg-gray-100">
                                    {hours.map(hour => (
                                        <div key={hour} className="flex-1 text-xs text-center p-1 border-r border-gray-200">
                                            {formatTime(hour)}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Employee Rows */}
                    {employees.map(employee => (
                        <div key={employee.id} className="flex border-b">
                            {/* Employee Name */}
                            <div className="w-48 flex-shrink-0 bg-gray-50 font-medium text-gray-700 border-r p-3 sticky left-0 z-10">
                                <div className="font-semibold">{employee.name}</div>
                            </div>
                            {/* Day Columns */}
                            {dates.map(date => (
                                <div key={date.toISOString()} className="w-96 flex-shrink-0 border-r">
                                    {/* Hour Grid */}
                                    <div className="flex h-12">
                                        {hours.map(hour => {
                                            const shifts = getShiftsForEmployee(employee, date);
                                            const isInShift = shifts.some(shift => 
                                                (shift.start <= hour && shift.end > hour) ||
                                                (shift.start > shift.end && (hour >= shift.start || hour < shift.end)) // Night shift
                                            );
                                            const shift = shifts.find(s => 
                                                (s.start <= hour && s.end > hour) ||
                                                (s.start > s.end && (hour >= s.start || hour < s.end))
                                            );
                                            
                                            return (
                                                <div
                                                    key={hour}
                                                    className={`w-[50px] border-r border-gray-200 text-xs flex items-center justify-center ${
                                                        isInShift ? getShiftColor(shift.start, shift.end) : 'bg-white'
                                                    }`}
                                                    title={`${employee.name} - ${formatTime(hour)} - ${formatDate(date)}`}
                                                >
                                                    {isInShift && hour === shift.start && (
                                                        <span className="text-xs font-medium">
                                                            {shift.start}:00-{shift.end}:00
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 flex justify-center space-x-4">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-200 border border-green-400 rounded"></div>
                    <span className="text-sm text-gray-600">8-5 Shift</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-200 border border-blue-400 rounded"></div>
                    <span className="text-sm text-gray-600">9-6 Shift</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-200 border border-purple-400 rounded"></div>
                    <span className="text-sm text-gray-600">10-7 Shift</span>
                </div>
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-300 border border-gray-500 rounded"></div>
                    <span className="text-sm text-gray-600">Night Shift</span>
                </div>
            </div>

            {/* CSV Import Modal for shifts */}
            {showCsvImport && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">Import Shifts from CSV</h2>
                        <p className="mb-2 text-gray-600 text-sm">CSV format: employeeEmail,date,startHour,endHour</p>
                        <input type="file" accept=".csv" className="mb-4" />
                        <div className="flex justify-end gap-2">
                            <button onClick={() => setShowCsvImport(false)} className="px-4 py-2 border rounded-lg">Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">Import</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default TeamSchedule; 