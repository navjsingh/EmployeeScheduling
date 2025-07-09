import React, { useState, useEffect } from 'react';
import EditUserModal from '../components/modals/EditUserModal';
import CsvImportModal from '../components/modals/CsvImportModal';
import TeamModal from '../components/modals/TeamModal';
import PlusIcon from '../components/icons/PlusIcon';
import UserCard from '../components/UserCard';
import TeamCard from '../components/TeamCard';
import * as api from '../services/apiService';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);
    const [editingTeam, setEditingTeam] = useState(null);
    const [showCsvImport, setShowCsvImport] = useState(false);
    const [activeTab, setActiveTab] = useState('users');

    const fetchUsers = async () => {
        try {
            const allUsers = await api.getAllUsers();
            setUsers(allUsers.filter(u => u.role !== 'ADMIN'));
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        }
    };

    const fetchTeams = async () => {
        try {
            const allTeams = await api.getAllTeams();
            setTeams(allTeams);
        } catch (err) {
            setError('Failed to fetch teams.');
            console.error(err);
        }
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            await Promise.all([fetchUsers(), fetchTeams()]);
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

    const handleUserAdd = async (userData) => {
        await api.createUser(userData);
        fetchUsers();
        setEditingUser(null);
    };

    const handleUserUpdate = async (id, userData) => {
        await api.updateUserById(id, userData);
        fetchUsers();
        setEditingUser(null);
    };

    const handleUserRemove = async (id) => {
        if (window.confirm(`Are you sure you want to remove this user?`)) {
            await api.deleteUserById(id);
            fetchUsers(); 
        }
    };

    const handleTeamAdd = async (teamData) => {
        await api.createTeam(teamData);
        fetchTeams();
        setEditingTeam(null);
    };

    const handleTeamUpdate = async (id, teamData) => {
        await api.updateTeam(id, teamData);
        fetchTeams();
        setEditingTeam(null);
    };

    const handleTeamRemove = async (id) => {
        if (window.confirm(`Are you sure you want to remove this team?`)) {
            await api.deleteTeam(id);
            fetchTeams(); 
        }
    };

    const handleCsvImportSuccess = () => {
        fetchUsers();
        fetchTeams();
    };

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

  return (
        <div className="max-w-6xl h-[80vh] mx-auto">
            {/* Tab Navigation */}
            <div className="flex space-x-1 mb-6">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'users' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('teams')}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        activeTab === 'teams' 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    Teams
                </button>
            </div>

            {activeTab === 'users' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                        <div className="flex space-x-3">
                            <button 
                                onClick={() => setShowCsvImport(true)}
                                className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-green-600 rounded-lg hover:bg-green-700">
                                Import CSV
                            </button>
                            <button 
                                onClick={() => setEditingUser({ isNew: true })} 
                                className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                                <PlusIcon /> Add New User
                            </button>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(user => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={() => setEditingUser(user)}
                                onRemove={() => handleUserRemove(user.id)}
                            />
                        ))}
                    </div>
                </>
            )}

            {activeTab === 'teams' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Team Management</h2>
                        <button 
                            onClick={() => setEditingTeam({ isNew: true })} 
                            className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            <PlusIcon /> Add New Team
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teams.map(team => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onEdit={() => setEditingTeam(team)}
                                onRemove={() => handleTeamRemove(team.id)}
                            />
                        ))}
                    </div>
                </>
            )}

            {editingUser && 
                <EditUserModal 
                    user={editingUser} 
                    onClose={() => setEditingUser(null)} 
                    onSave={editingUser.isNew ? handleUserAdd : (data) => handleUserUpdate(editingUser.id, data)} 
                />
            }

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
        </div>
    )
}

export default AdminDashboard;