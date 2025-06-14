import React, { useState, useEffect } from 'react';
import * as api from '../../services/apiService';

const toDateString = (date) => date.toISOString().split('T')[0];

export default function AvailabilityModal({ onClose }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    useEffect(() => {
        const fetchAvailability = async () => {
            setLoading(true);
            try {
                const data = await api.getAvailability(year, month);
                const availabilityMap = {};
                data.forEach(item => {
                    availabilityMap[item.date] = item.availableHours;
                });
                setAvailability(availabilityMap);
            } catch (err) {
                setError('Failed to fetch availability data.');
                console.error(err);
            } finally {
                setLoading(false);
                setIsTransitioning(false);
            }
        };
        fetchAvailability();
    }, [year, month]);

    const handleHoursChange = (dateStr, value) => {
        setAvailability(prev => ({ ...prev, [dateStr]: value === '' ? 0 : Number(value) }));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setError('');
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            setError('Please select a file first.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target.result;
            try {
                const lines = text.split('\n').filter(line => line.trim() !== '');
                const headers = lines[0].split(',').map(h => h.trim());
                
                if (headers[0] !== 'date' || headers[1] !== 'hours') {
                    throw new Error('Invalid CSV headers. Must be "date,hours".');
                }

                const newAvailability = {};
                for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(',').map(v => v.trim());
                    const date = values[0];
                    const hours = parseInt(values[1], 10);
                    
                    if (date && !isNaN(hours)) {
                        newAvailability[date] = hours;
                    }
                }
                setAvailability(prev => ({ ...prev, ...newAvailability }));

            } catch (err) {
                setError(err.message || 'Failed to parse CSV file.');
            }
        };
        reader.readAsText(selectedFile);
    };

    const handleSave = async () => {
        setSaving(true);
        setError('');
        const payload = Object.keys(availability).map(dateStr => ({
            date: dateStr,
            availableHours: availability[dateStr] || 0,
        }));

        try {
            await api.setAvailability(payload);
            onClose();
        } catch (err) {
            setError('Failed to save availability. Please try again.');
            console.error(err);
        } finally {
            setSaving(false);
        }
    };
    
    const changeMonth = (amount) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentDate(prev => {
                const newDate = new Date(prev);
                newDate.setMonth(newDate.getMonth() + amount);
                return newDate;
            });
        }, 150);
    };

    const renderCalendar = () => {
        const firstDayOfMonth = new Date(year, month - 1, 1).getDay();
        const daysInMonth = new Date(year, month, 0).getDate();
        const blanks = Array(firstDayOfMonth).fill(null);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        const allCells = [...blanks, ...days];

        return (
            <div className="grid grid-cols-7 gap-2 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
                    <div 
                        key={day} 
                        className="font-bold text-xs text-gray-500">{day}
                    </div>)
                }
                {allCells.map((day, index) => {
                    if (!day) 
                        return (
                            <div 
                                key={`blank-${index}`} 
                                className="border rounded-lg">
                            </div>);
                    
                    const dateObj = new Date(year, month - 1, day);
                    const dateStr = toDateString(dateObj);
                    const dayOfWeek = dateObj.getDay();
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                    
                    const hours = availability[dateStr] ?? (isWeekend ? 0 : 8);

                    return (
                        <div 
                            key={day} 
                            className="p-1 border rounded-lg flex flex-col items-center justify-center">
                            <span 
                                className="font-semibold">
                                {day}
                            </span>
                            <input
                                type="number"
                                value={hours}
                                onChange={(e) => handleHoursChange(dateStr, e.target.value)}
                                className="w-12 text-center border rounded mt-1"
                                min="0"
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl">
                <h2 className="text-2xl font-bold mb-4">Set Team Daily Availability</h2>
                {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</p>}
                
                <div className="bg-gray-50 p-4 rounded-lg mb-4 border">
                    <h4 className="font-semibold mb-2">Import from CSV</h4>
                    <p className="text-xs text-gray-500 mb-2">
                        CSV file must have headers: "date,hours" (e.g., 2025-07-25,16)
                    </p>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="file" 
                            accept=".csv" 
                            onChange={handleFileChange} 
                            className="
                                text-sm 
                                file:mr-4 file:py-2 file:px-4 
                                file:rounded-full file:border-0 
                                file:text-sm file:font-semibold 
                                file:bg-blue-50 file:text-blue-700 
                                hover:file:bg-blue-100"/>
                        <button 
                            onClick={handleFileUpload} 
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
                            Import
                        </button>
                    </div>
                </div>

                <div className={`transition-opacity duration-150 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex justify-between items-center mb-4">
                        <button 
                            onClick={() => 
                            changeMonth(-1)} 
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">&lt;
                        </button>
                        <h3 className="text-xl font-bold">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button 
                            onClick={() => changeMonth(1)} 
                            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300">&gt;
                        </button>
                    </div>

                    <div className="min-h-[340px]">
                        {loading ? 
                            <div 
                                className="flex items-center justify-center h-full">
                                    Loading availability...
                            </div> : renderCalendar()}
                    </div>
                </div>
                
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
