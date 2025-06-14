import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/Input';


function ForgotPasswordModal({ onClose }) {
    const { resetPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setMessage('');

        if (!email || !password || !confirmPassword) {
            return setMessage('All fields are required.');
        }

        if (password !== confirmPassword) {
            return setMessage('Passwords do not match.');
        }

        if (password.length < 6) {
            return setMessage('Password must be at least 6 characters long.');
        }

        const success = resetPassword(email, password);

        setMessage(
            success
            ? 'Your password has been reset successfully. You can now log in.'
            : 'No account found with that email address.'
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold text-center text-gray-800">
                    Reset Password
                </h1>
                {message && 
                    <p 
                        className={`p-3 rounded-lg text-center 
                            ${message.includes('successfully') ? 
                            'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {message}
                    </p>}
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input 
                        type="email" 
                        placeholder="Your Email Address" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input 
                        type="password" 
                        placeholder="New Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                    />
                    <Input 
                        type="password" 
                        placeholder="Confirm New Password" 
                        value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                    <button 
                        type="submit" 
                        className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                        Reset Password
                    </button>
                </form>
                <p className="text-center">
                    <button 
                        onClick={onClose} 
                        className="font-medium text-blue-600 hover:underline">
                            Back to Login
                    </button>
                </p>
            </div>
        </div>
    ); 
}

export default ForgotPasswordModal;