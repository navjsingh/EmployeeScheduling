import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService';

export default function SetEmployeeHoursModal({ onClose }) {
    const [team, setTeam] = useState([]);
    const [hours, setHours] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const teamData = await api.getManagerTeam();
                setTeam(teamData);
                
                const initialHours = {};
                teamData.forEach(emp => {
                    initialHours[emp.id] = emp.totalVacationHours;
                });
                setHours(initialHours);
            } catch (err) {
                setError('Failed to fetch team data.');
            } finally {
                setLoading(false);
            }
        };
        fetchTeam();
    }, []);

    const handleHoursChange = (id, value) => {
        setHours(prev => ({ 
            ...prev, [id]: value === '' ? '' : Number(value) }));
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        
        const updatePromises = Object.keys(hours).map(id => {
            const originalEmployee = team.find(emp => emp.id == id);
            
            if (hours[id] !== originalEmployee.totalVacationHours) {
                return api.setEmployeeHours(id, hours[id]);
            }
            return Promise.resolve();
        });

        try {
            await Promise.all(updatePromises);
            onClose();
        } catch (err) {
            setError('Failed to save hours. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h2 className="text-2xl font-bold mb-4">Set Employee Yearly Vacation Hours</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
                {loading ? (
                    <div>Loading team...</div>
                ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {team.map(employee => (
                            <div key={employee.id} className="flex justify-between items-center">
                                <label 
                                    htmlFor={`hours-${employee.id}`} 
                                    className="font-semibold">
                                        {employee.name}
                                </label>
                                <input
                                    id={`hours-${employee.id}`}
                                    type="number"
                                    value={hours[employee.id] || ''}
                                    onChange={e => handleHoursChange(employee.id, e.target.value)}
                                    className="w-24 px-2 py-1 border rounded-lg"
                                />
                            </div>
                        ))}
                    </div>
                )}
                <div className="flex justify-end space-x-4 pt-6 border-t mt-6">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 rounded-lg">
                            Cancel
                    </button>
                    <button 
                        type="button" 
                        onClick={handleSave} 
                        disabled={loading || saving} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-blue-400">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </div>
    );
}