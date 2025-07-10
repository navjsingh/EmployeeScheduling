import React, { useState } from 'react';
import * as api from '../services/apiService';

function TestAuth() {
    const [result, setResult] = useState('');
    const [error, setError] = useState('');

    const testPublicEndpoint = async () => {
        try {
            setError('');
            setResult('Testing public endpoint...');
            const response = await api.testPublicEndpoint();
            setResult(JSON.stringify(response, null, 2));
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testPublicPost = async () => {
        try {
            setError('');
            setResult('Testing public POST...');
            const response = await api.testPublicPost({
                test: 'data',
                timestamp: Date.now()
            });
            setResult(JSON.stringify(response, null, 2));
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testAdminAccess = async () => {
        try {
            setError('');
            setResult('Testing admin access...');
            const response = await api.testAdminAccess();
            setResult(JSON.stringify(response, null, 2));
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    const testTeamCreate = async () => {
        try {
            setError('');
            setResult('Testing team create...');
            const response = await api.createTeam({
                name: 'Test Team ' + Date.now(),
                description: 'Test team description'
            });
            setResult(JSON.stringify(response, null, 2));
        } catch (err) {
            setError(err.message);
            setResult('');
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Authentication Test</h2>
            <div className="space-y-4">
                <button 
                    onClick={testPublicEndpoint}
                    className="px-4 py-2 bg-gray-600 text-white rounded"
                >
                    Test Public GET
                </button>
                <button 
                    onClick={testPublicPost}
                    className="px-4 py-2 bg-gray-700 text-white rounded ml-2"
                >
                    Test Public POST
                </button>
                <button 
                    onClick={testAdminAccess}
                    className="px-4 py-2 bg-blue-600 text-white rounded ml-2"
                >
                    Test Admin Access
                </button>
                <button 
                    onClick={testTeamCreate}
                    className="px-4 py-2 bg-green-600 text-white rounded ml-2"
                >
                    Test Team Create
                </button>
            </div>
            {result && (
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <pre>{result}</pre>
                </div>
            )}
            {error && (
                <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                    {error}
                </div>
            )}
        </div>
    );
}

export default TestAuth; 