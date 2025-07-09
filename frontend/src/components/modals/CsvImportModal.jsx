import React, { useState } from 'react';
import * as api from '../../services/apiService';

function CsvImportModal({ onClose, onSuccess }) {
    const [csvData, setCsvData] = useState('');
    const [csvFile, setCsvFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);
    const [importMode, setImportMode] = useState('create'); // 'create' or 'update'

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && file.type === 'text/csv') {
            setCsvFile(file);
            const reader = new FileReader();
            reader.onload = (event) => {
                setCsvData(event.target.result);
            };
            reader.readAsText(file);
        } else {
            setError('Please select a valid CSV file');
        }
    };

    const parseCsvData = (csvText) => {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        const users = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= headers.length) {
                const user = {};
                headers.forEach((header, index) => {
                    user[header] = values[index];
                });
                users.push(user);
            }
        }
        return users;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setResult(null);

        try {
            const users = parseCsvData(csvData);
            const response = await api.importUsersFromCsv({ 
                users, 
                mode: importMode 
            });
            setResult(response);
            
            if (response.errors && response.errors.length === 0) {
                onSuccess();
            }
        } catch (err) {
            setError(err.message || 'Failed to import users');
        } finally {
            setLoading(false);
        }
    };

    const downloadTemplate = () => {
        const template = `name,email,team,managerEmail,role,totalVacationHours
John Doe,john.doe@company.com,Red,jane.smith@company.com,EMPLOYEE,160
Jane Smith,jane.smith@company.com,Red,,MANAGER,200
Alice Johnson,alice.johnson@company.com,Blue,jane.smith@company.com,EMPLOYEE,160`;
        
        const blob = new Blob([template], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'users_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Import Users from CSV</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                        ×
                    </button>
                </div>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold text-blue-800 mb-2">CSV Format Requirements:</h3>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• <strong>name:</strong> Full name of the employee</li>
                        <li>• <strong>email:</strong> Email address (must be unique)</li>
                        <li>• <strong>team:</strong> Team name (Red, Blue, Green, Yellow, etc.)</li>
                        <li>• <strong>managerEmail:</strong> Email of the manager (optional)</li>
                        <li>• <strong>role:</strong> EMPLOYEE, MANAGER, or ADMIN</li>
                        <li>• <strong>totalVacationHours:</strong> Number of vacation hours per year</li>
                    </ul>
                    <button
                        onClick={downloadTemplate}
                        className="mt-3 text-blue-600 hover:text-blue-800 underline text-sm"
                    >
                        Download CSV Template
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Import Mode:
                        </label>
                        <div className="flex space-x-4 mb-4">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="create"
                                    checked={importMode === 'create'}
                                    onChange={(e) => setImportMode(e.target.value)}
                                    className="mr-2"
                                />
                                Create New Users Only
                            </label>
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="importMode"
                                    value="update"
                                    checked={importMode === 'update'}
                                    onChange={(e) => setImportMode(e.target.value)}
                                    className="mr-2"
                                />
                                Update Existing Users
                            </label>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload CSV File:
                        </label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileUpload}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Or paste CSV data directly:
                        </label>
                        <textarea
                            value={csvData}
                            onChange={(e) => setCsvData(e.target.value)}
                            className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder="Paste your CSV data here..."
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {result && (
                        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                            <h4 className="font-semibold mb-2">Import Results:</h4>
                            <div className="text-sm space-y-1">
                                <p><strong>Total Processed:</strong> {result.totalProcessed}</p>
                                <p><strong>Users Created:</strong> {result.createdUsers}</p>
                                <p><strong>Users Updated:</strong> {result.updatedUsers || 0}</p>
                                <p><strong>Teams Created:</strong> {result.createdTeams}</p>
                                
                                {result.successes && result.successes.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-semibold text-green-700">Successes:</p>
                                        <ul className="text-green-600">
                                            {result.successes.slice(0, 5).map((success, index) => (
                                                <li key={index}>• {success}</li>
                                            ))}
                                            {result.successes.length > 5 && (
                                                <li>• ... and {result.successes.length - 5} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {result.errors && result.errors.length > 0 && (
                                    <div className="mt-2">
                                        <p className="font-semibold text-red-700">Errors:</p>
                                        <ul className="text-red-600">
                                            {result.errors.slice(0, 5).map((error, index) => (
                                                <li key={index}>• {error}</li>
                                            ))}
                                            {result.errors.length > 5 && (
                                                <li>• ... and {result.errors.length - 5} more</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                        >
                            {loading ? 'Importing...' : 'Import Users'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CsvImportModal; 