import React, { useState, useEffect } from 'react';
import TeamCard from '../components/TeamCard';
import UserCard from '../components/UserCard';
import TeamModal from '../components/modals/TeamModal';
import CsvImportModal from '../components/modals/CsvImportModal';
import UserDetailModal from '../components/modals/UserDetailModal';
import BulkDeleteModal from '../components/modals/BulkDeleteModal';
import VacationCalendar from '../components/VacationCalendar';
import TeamSchedule from '../components/TeamSchedule';
import TestAuth from '../components/TestAuth';
import PlusIcon from '../components/icons/PlusIcon';
import * as api from '../services/apiService';

function AdminHomePage() {
    const [teams, setTeams] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [editingTeam, setEditingTeam] = useState(null);
    const [showCsvImport, setShowCsvImport] = useState(false);
    const [activeView, setActiveView] = useState('teams'); // 'teams', 'users', 'calendar', 'schedule'
    const [filters, setFilters] = useState({
        team: '',
        role: '',
        search: ''
    });
    const [selectedTeamForCalendar, setSelectedTeamForCalendar] = useState(null);
    const [selectedManagerForCalendar, setSelectedManagerForCalendar] = useState(null);
    const [selectedTeamForSchedule, setSelectedTeamForSchedule] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showBulkDelete, setShowBulkDelete] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [teamsData, usersData] = await Promise.all([
                api.getAllTeams(),
                api.getAllUsers()
            ]);
            setTeams(teamsData);
            setUsers(usersData.filter(u => u.role !== 'ADMIN'));
        } catch (err) {
            setError('Failed to fetch data.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleTeamClick = (team) => {
        setFilters({ ...filters, team: team.name });
        setActiveView('users');
    };

    const handleTeamAdd = async (teamData) => {
        try {
            await api.createTeam(teamData);
            fetchData();
            setEditingTeam(null);
            setActiveView('teams');
        } catch (error) {
            alert(`Failed to create team: ${error.message}`);
        }
    };

    const handleTeamUpdate = async (id, teamData) => {
        try {
            await api.updateTeam(id, teamData);
            fetchData();
            setEditingTeam(null);
            setActiveView('teams');
        } catch (error) {
            alert(`Failed to update team: ${error.message}`);
        }
    };

    const handleTeamRemove = async (id) => {
        if (window.confirm(`Are you sure you want to remove this team?`)) {
            try {
                await api.deleteTeam(id);
                fetchData();
                setActiveView('teams');
            } catch (error) {
                alert(`Failed to delete team: ${error.message}`);
            }
        }
    };

    const handleCsvImportSuccess = () => {
        fetchData();
    };

    const handleUserUpdate = () => {
        fetchData();
        setSelectedUser(null);
    };

    const handleUserDelete = () => {
        fetchData();
        setSelectedUser(null);
    };

    const handleBulkDeleteSuccess = () => {
        fetchData();
        setSelectedUsers([]);
        setShowBulkDelete(false);
    };

    const handleSelectAll = () => {
        if (selectedUsers.length === filteredUsers.length) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers([...filteredUsers]);
        }
    };

    const handleSelectUser = (user) => {
        if (selectedUsers.find(u => u.id === user.id)) {
            setSelectedUsers(selectedUsers.filter(u => u.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    const filteredUsers = users.filter(user => {
        const matchesTeam = !filters.team || user.teamName === filters.team;
        const matchesRole = !filters.role || user.role === filters.role;
        const matchesSearch = !filters.search || 
            user.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            user.email.toLowerCase().includes(filters.search.toLowerCase());
        return matchesTeam && matchesRole && matchesSearch;
    });

    const teamUsers = selectedTeam ? users.filter(user => user.teamName === selectedTeam.name) : [];
    const teamManagers = teamUsers.filter(user => user.role === 'MANAGER');
    const teamEmployees = teamUsers.filter(user => user.role === 'EMPLOYEE');

    if (loading) return <div className="flex justify-center items-center h-64">Loading...</div>;
    if (error) return <div className="text-red-500 text-center">{error}</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left Sidebar */}
            <div className="w-64 bg-white shadow-lg">
                <div className="p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>
                </div>
                <nav className="p-4">
                    <ul className="space-y-2">
                        <li>
                            <button
                                onClick={() => setActiveView('teams')}
                                className={`w-full text-left px-3 py-2 rounded-lg ${
                                    activeView === 'teams' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Teams Overview
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('users')}
                                className={`w-full text-left px-3 py-2 rounded-lg ${
                                    activeView === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                All Users
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('calendar')}
                                className={`w-full text-left px-3 py-2 rounded-lg ${
                                    activeView === 'calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Vacation Calendar
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('schedule')}
                                className={`w-full text-left px-3 py-2 rounded-lg ${
                                    activeView === 'schedule' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Team Schedule
                            </button>
                        </li>
                        <li>
                            <button
                                onClick={() => setActiveView('test')}
                                className={`w-full text-left px-3 py-2 rounded-lg ${
                                    activeView === 'test' ? 'bg-blue-100 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                Test Auth
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {/* Teams Overview */}
                    {activeView === 'teams' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">Teams Overview</h1>
                                <button 
                                    onClick={() => setEditingTeam({ isNew: true })} 
                                    className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                    <PlusIcon /> Add New Team
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teams.map(team => (
                                    <div key={team.id} onClick={() => handleTeamClick(team)}>
                                        <TeamCard
                                            team={team}
                                            onEdit={(e) => {
                                                e.stopPropagation();
                                                setEditingTeam(team);
                                            }}
                                            onRemove={(e) => {
                                                e.stopPropagation();
                                                handleTeamRemove(team.id);
                                            }}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Team Details */}
                    {activeView === 'team-details' && selectedTeam && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <button 
                                        onClick={() => setActiveView('teams')}
                                        className="text-blue-600 hover:text-blue-800 mb-2"
                                    >
                                        ← Back to Teams
                                    </button>
                                    <h1 className="text-3xl font-bold text-gray-800">{selectedTeam.name} Team</h1>
                                </div>
                                <button 
                                    onClick={() => setShowCsvImport(true)}
                                    className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
                                    Import CSV
                                </button>
                            </div>

                            {/* Managers */}
                            {teamManagers.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Managers</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {teamManagers.map(user => (
                                            <UserCard
                                                key={user.id}
                                                user={user}
                                                onEdit={() => {}} // TODO: Add edit functionality
                                                onRemove={() => {}} // TODO: Add remove functionality
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Employees */}
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Employees</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {teamEmployees.map(user => (
                                        <UserCard
                                            key={user.id}
                                            user={user}
                                            onEdit={() => {}} // TODO: Add edit functionality
                                            onRemove={() => {}} // TODO: Add remove functionality
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* All Users */}
                    {activeView === 'users' && (
                        <div>
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-3xl font-bold text-gray-800">All Users</h1>
                                <div className="flex space-x-2">
                                    {selectedUsers.length > 0 && (
                                        <button 
                                            onClick={() => setShowBulkDelete(true)}
                                            className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-red-600 rounded-lg hover:bg-red-700">
                                            Delete Selected ({selectedUsers.length})
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setShowCsvImport(true)}
                                        className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
                                        Import CSV
                                    </button>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="bg-white p-4 rounded-lg shadow mb-6">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Team</label>
                                        <select
                                            value={filters.team}
                                            onChange={(e) => setFilters({...filters, team: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">All Teams</option>
                                            {teams.map(team => (
                                                <option key={team.id} value={team.name}>{team.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                        <select
                                            value={filters.role}
                                            onChange={(e) => setFilters({...filters, role: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        >
                                            <option value="">All Roles</option>
                                            <option value="EMPLOYEE">Employee</option>
                                            <option value="MANAGER">Manager</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                                        <input
                                            type="text"
                                            placeholder="Search by name or email..."
                                            value={filters.search}
                                            onChange={(e) => setFilters({...filters, search: e.target.value})}
                                            className="w-full p-2 border border-gray-300 rounded-lg"
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button
                                            onClick={() => setFilters({team: '', role: '', search: ''})}
                                            className="w-full p-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                                        >
                                            Clear Filters
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white rounded-lg shadow">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-700 text-sm">
                                            <th className="px-4 py-2 text-left">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                    onChange={handleSelectAll}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </th>
                                            <th className="px-4 py-2 text-left">Name</th>
                                            <th className="px-4 py-2 text-left">Email</th>
                                            <th className="px-4 py-2 text-left">Role</th>
                                            <th className="px-4 py-2 text-left">Team</th>
                                            <th className="px-4 py-2 text-left">Manager</th>
                                            <th className="px-4 py-2 text-left">Total Hours</th>
                                            <th className="px-4 py-2 text-left">Used Hours</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.length === 0 && (
                                            <tr>
                                                <td colSpan="8" className="text-center py-6 text-gray-400">No users found.</td>
                                            </tr>
                                        )}
                                        {filteredUsers.map(user => (
                                            <tr 
                                                key={user.id} 
                                                className={`border-b hover:bg-gray-50 ${
                                                    selectedUsers.find(u => u.id === user.id) ? 'bg-blue-50' : ''
                                                }`}
                                            >
                                                <td className="px-4 py-2" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.find(u => u.id === user.id) !== undefined}
                                                        onChange={() => handleSelectUser(user)}
                                                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                    />
                                                </td>
                                                <td 
                                                    className="px-4 py-2 font-medium text-gray-800 cursor-pointer"
                                                    onClick={() => setSelectedUser(user)}
                                                >
                                                    {user.name}
                                                </td>
                                                <td className="px-4 py-2 text-gray-700">{user.email}</td>
                                                <td className="px-4 py-2 text-gray-700">{user.role}</td>
                                                <td className="px-4 py-2 text-gray-700">{user.teamName || '-'}</td>
                                                <td className="px-4 py-2 text-gray-700">{user.teamManagerName || '-'}</td>
                                                <td className="px-4 py-2 text-gray-700">{user.totalVacationHours}</td>
                                                <td className="px-4 py-2 text-gray-700">{user.usedVacationHours}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Vacation Calendar */}
                    {activeView === 'calendar' && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Vacation Calendar</h1>
                            <VacationCalendar 
                                selectedTeam={selectedTeamForCalendar}
                                selectedManager={selectedManagerForCalendar}
                                onTeamChange={setSelectedTeamForCalendar}
                                onManagerChange={setSelectedManagerForCalendar}
                                teams={teams}
                                managers={users.filter(u => u.role === 'MANAGER')}
                            />
                        </div>
                    )}

                    {/* Team Schedule */}
                    {activeView === 'schedule' && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Team Schedule</h1>
                            <TeamSchedule selectedTeam={null} />
                        </div>
                    )}

                    {/* Test Auth */}
                    {activeView === 'test' && (
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-6">Authentication Test</h1>
                            <TestAuth />
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            {editingTeam && 
                <TeamModal 
                    team={editingTeam} 
                    onClose={() => setEditingTeam(null)} 
                    onSave={editingTeam.isNew ? handleTeamAdd : (data) => handleTeamUpdate(editingTeam.id, data)} 
                />
            }

            {showCsvImport && 
                <CsvImportModal 
                    onClose={() => setShowCsvImport(false)} 
                    onSuccess={handleCsvImportSuccess} 
                />
            }

            {selectedUser && 
                <UserDetailModal 
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onUpdate={handleUserUpdate}
                    onDelete={handleUserDelete}
                />
            }

            {showBulkDelete && 
                <BulkDeleteModal 
                    selectedUsers={selectedUsers}
                    onClose={() => setShowBulkDelete(false)}
                    onSuccess={handleBulkDeleteSuccess}
                />
            }
        </div>
    );
}

export default AdminHomePage; 