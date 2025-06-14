import React, { useState } from 'react';
import Input from '../Input';

function EditUserModal({ user, onClose, onSave }) {
    const [name, setName] = useState(user.name || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState(user.role || 'EMPLOYEE');
    const [totalVacationHours, setTotalVacationHours] = useState(user.totalVacationHours || 80);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async(e) => {
        e.preventDefault(); 
        setError('');
        setLoading(true);

        const payload = { name, role, totalVacationHours };
        if (user.isNew) {
            payload.email = email;
            payload.password = password;
        } else if (password) {
            payload.password = password;
        }

        try {
            await onSave(payload);
        } catch (err) {
            setError(err.message || 'Failed to save user.');
        } finally {
            setLoading(false);
        }
    }
    
    return (
         <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">{user.isNew ? "Add New User" : "Edit User"}</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        type="text" 
                        placeholder="Full Name" 
                        value={name} 
                        onChange={e => setName(e.target.value)} />
                    <Input 
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)}
                        disabled={!user.isNew} />
                    <Input 
                        type="password" 
                        placeholder={user.isNew ? "Password" : "New Password"} 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} />
                    <select 
                        value={role} 
                        onChange={e => 
                            setRole(e.target.value)} 
                        disabled={user.role === 'ADMIN'} 
                        className="w-full px-4 py-2 border rounded-lg bg-white disabled:bg-gray-200">
                        <option value="EMPLOYEE">Employee</option>
                        <option value="MANAGER">Manager</option>
                    </select>
                    <Input 
                        type="number" 
                        placeholder="Total Vacation Hours" 
                        value={totalVacationHours} 
                        onChange={e => 
                            setTotalVacationHours(Number(e.target.value))} 
                        disabled={user.role === 'ADMIN'} />
                    <div className="flex justify-end space-x-4 pt-4">
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
                            {loading ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </form>
            </div>
         </div>
    )
}
export default EditUserModal;