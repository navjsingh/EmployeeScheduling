import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';

function ProfileModal({ onClose }) {
  const { user, updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');

    if (!password || !confirmPassword) {
      return setMessage('Please fill out all password fields.');
    }

    if (password !== confirmPassword) {
      return setMessage('Passwords do not match.');
    }

    if (password.length < 6) {
      return setMessage('Password must be at least 6 characters long.');
    }

    const success = updatePassword(password);

    if (success) {
      setMessage('Password updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } else {
      setMessage('Failed to update password.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">My Profile</h2>
        <div className="mb-6 space-y-2">
          <div>
            <strong>Name:</strong> 
            {user.name}
          </div>
          <div>
            <strong>Email:</strong> 
            {user.email}
          </div>
          <div>
            <strong>Role:</strong> 
            {user.role}
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="text-lg font-semibold border-t pt-4">Change Password</h3>
          {message && (
            <p 
              className={`p-2 rounded-lg 
                ${message.includes('successfully') ? 
                  'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message}
            </p>
          )}
          <Input 
            type="password" 
            placeholder="New Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
          />
          <Input 
            type="password" 
            placeholder="Confirm New Password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
          />
          <div className="flex justify-end space-x-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-gray-200 rounded-lg">
                Close
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileModal;