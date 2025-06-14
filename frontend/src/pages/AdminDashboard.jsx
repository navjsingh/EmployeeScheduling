import React, { useState, useEffect } from 'react';
import EditUserModal from '../components/modals/EditUserModal';
import PlusIcon from '../components/icons/PlusIcon';
import UserCard from '../components/UserCard';
import * as api from '../services/apiService';

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editingUser, setEditingUser] = useState(null);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const allUsers = await api.getAllUsers();
            
            setUsers(allUsers.filter(u => u.role !== 'ADMIN'));
        } catch (err) {
            setError('Failed to fetch users.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
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

    if (loading) return <div>Loading users...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

  return (
        <div className="max-w-6xl h-[80vh] mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">User Management</h2>
                <button 
                  onClick={() => 
                    setEditingUser({ isNew: true })} 
                    className="flex items-center cursor-pointer px-4 py-2 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                    <PlusIcon /> Add New User
                </button>
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

            {editingUser && 
              <EditUserModal 
                user={editingUser} 
                onClose={() => setEditingUser(null)} 
                onSave={editingUser.isNew ? handleUserAdd : (data) => handleUserUpdate(editingUser.id, data)} />}
        </div>
    )
}

export default AdminDashboard;