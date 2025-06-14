import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RequestModal from '../components/modals/RequestModal';
import EditRequestModal from '../components/modals/EditRequestModal';
import DecisionModal from '../components/modals/DecisionModal';

const parseDateFromAPI = (dateString) => {
    
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
};

function CalendarView({ requests, onAction }) {
    const { user } = useAuth();
    const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 1));
    const [view, setView] = useState('monthly');
    const [selectedDate, setSelectedDate] = useState(null);
    const [editingRequest, setEditingRequest] = useState(null);
    const [reviewingRequest, setReviewingRequest] = useState(null);

    const changeDate = (unit, amount) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            if (unit === 'year') newDate.setFullYear(newDate.getFullYear() + amount);
            if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);
            if (unit === 'week') newDate.setDate(newDate.getDate() + (amount * 7));
            return newDate;
        });
    };

    const handleEventClick = (event, e) => {
        e.stopPropagation();
        if (user.role === 'EMPLOYEE' && event.employeeId === user.id) {
            setEditingRequest(event);
        }
        if (user.role === 'MANAGER') {
            setReviewingRequest(event);
        }
    };

    const handleDateClick = (date) => {
        if (!date) return;
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) return;
        if (user.role === 'EMPLOYEE') {
            setSelectedDate(date);
        }
    };
    
    const handleModalClose = () => {
        setSelectedDate(null);
        setEditingRequest(null);
        setReviewingRequest(null);
        onAction();
    };

    const renderHeader = () => {
        let title = '';
        let navUnit = 'month';
        if (view === 'monthly') {
            title = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
            navUnit = 'month';
        } else if (view === 'weekly') {
            const startOfWeek = new Date(currentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            title = `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
            navUnit = 'week';
        } else if (view === 'yearly') {
            title = currentDate.getFullYear();
            navUnit = 'year';
        }
        return (
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => 
                    changeDate(navUnit, -1)} 
                    className="px-4 py-2 bg-gray-200 rounded-lg">&lt;
                </button>
                    <h3 className="text-xl font-bold">
                        {title}
                    </h3>
                <button onClick={() => 
                    changeDate(navUnit, 1)} 
                    className="px-4 py-2 bg-gray-200 rounded-lg">&gt;
                </button>
            </div>);
    };

    const renderMonthlyView = () => {
        const year = currentDate.getFullYear(); 
        const month = currentDate.getMonth(); 
        const firstDayOfMonth = new Date(year, month, 1).getDay(); 
        const daysInMonth = new Date(year, month + 1, 0).getDate(); 
        const blanks = Array(firstDayOfMonth).fill(null); 
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1); 
        const allCells = [...blanks, ...days];
        return (
            <div className="grid grid-cols-7 gap-1 text-center">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => 
                    <div 
                        key={day} 
                        className="font-bold p-2 text-gray-600">
                            {day}
                    </div>)}
                {allCells.map((day, index) => 
                    {const currentDayObj = day ? new Date(year, month, day) : null; 
                    const dayOfWeek = currentDayObj ? currentDayObj.getDay() : null; 
                    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; 
                    const events = day ? requests.filter(req => { 
    
                        const reqStart = parseDateFromAPI(req.startDate);
                        const reqEnd = parseDateFromAPI(req.endDate);
                        return currentDayObj >= reqStart && currentDayObj <= reqEnd;}) : []; 
                    return (
                        <div 
                            key={index} 
                            className={`p-2 border rounded-lg h-36 flex flex-col relative 
                                ${isWeekend ? 'bg-gray-100 cursor-not-allowed' : 
                                    (user.role === 'EMPLOYEE' ? 'cursor-pointer hover:bg-gray-50' : 'bg-white')}`} 
                            onClick={() => handleDateClick(currentDayObj)}>
                                {day && <span className={`font-semibold ${isWeekend ? 'text-gray-400' : ''}`}>
                                    {day}</span>}
                            <div 
                                className="mt-1 space-y-1 overflow-y-auto">
                                    {events.map(event => {let bgColor = 'bg-yellow-200 hover:bg-yellow-300'; 
                                        if(event.status === 'APPROVED') 
                                            bgColor = 'bg-green-200 hover:bg-green-300'; 
                                        if(event.status === 'DENIED') 
                                            bgColor = 'bg-red-200 hover:bg-red-300'; 
                                        const employeeName = event.employeeName.split(' ')[0]; 
                                        return (
                                            <div 
                                                key={event.id} 
                                                className={`${bgColor} text-xs p-1 rounded cursor-pointer`} 
                                                onClick={(e) => handleEventClick(event, e)}>
                                                    {user.role === 'MANAGER' ? `${employeeName}'s (${event.status})` : `${event.status}`}
                                            </div>);})}
                            </div>
                        </div>)})}
        </div>);
    };

    const renderWeeklyView = () => {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
        const days = Array.from({ length: 7 }, (_, i) => { 
            const day = new Date(startOfWeek); 
            day.setDate(day.getDate() + i); return day; });
        return (
            <div className="grid grid-cols-7 gap-1 text-center">
                {days.map(day => 
                    <div 
                        key={day} 
                        className={`font-bold p-2 
                            ${day.getDay() === 0 || day.getDay() === 6 ? 'text-gray-400' : 'text-gray-600'}`}>
                        {day.toLocaleDateString('en-US', { weekday: 'short' })} 
                        {day.getDate()}
                    </div>)}
                {days.map(day => { 
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6; 
                    const events = requests.filter(req => { 
            
                        const reqStart = parseDateFromAPI(req.startDate);
                        const reqEnd = parseDateFromAPI(req.endDate);
                        return day >= reqStart && day <= reqEnd; }
                    ); 
                    return (
                        <div 
                            key={day} 
                            className={`p-2 border rounded-lg h-48 flex flex-col relative 
                                ${isWeekend ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`} 
                            onClick={() => handleDateClick(day)}>
                                <div className="mt-1 space-y-1 overflow-y-auto">
                                    {events.map(event => { 
                                        let bgColor = 'bg-yellow-200 hover:bg-yellow-300'; 
                                        if (event.status === 'APPROVED') 
                                            bgColor = 'bg-green-200 hover:bg-green-300'; 
                                        if (event.status === 'DENIED') 
                                            bgColor = 'bg-red-200 hover:bg-red-300'; 
                                        const employeeName = event.employeeName.split(' ')[0]; 
                                        return (
                                            <div 
                                                key={event.id} 
                                                className={`${bgColor} text-xs p-1 rounded cursor-pointer`} 
                                                onClick={(e) => handleEventClick(event, e)}>{
                                                    user.role === 'MANAGER' ? `${employeeName} (${event.status})` : `${event.status}`}
                                            </div>); 
                                    })}
                                </div>
                        </div>) 
                    })}
            </div>);
    };

    const renderYearlyView = () => {
        const year = currentDate.getFullYear();
        const months = Array.from({ length: 12 }, (_, i) => new Date(year, i, 1));
        const handleMonthClick = (monthDate) => { 
            setCurrentDate(monthDate); 
            setView('monthly'); 
        }
        return (
            <div 
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {months.map(month => { 
                        const daysInMonth = new Date(year, month.getMonth() + 1, 0).getDate(); 
                        const allDays = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month.getMonth(), i + 1)); 
                        return (
                            <div 
                                key={month.getMonth()} 
                                className="p-2 border rounded-lg cursor-pointer hover:shadow-lg" 
                                onClick={() => handleMonthClick(month)}>
                                    <h4 className="font-bold text-center mb-2">
                                        {month.toLocaleString('default', { month: 'long' })}
                                    </h4>
                                <div className="grid grid-cols-7 gap-px">
                                    {allDays.map(day => { 
                                        const dayOfWeek = day.getDay(); 
                                        let bgColor = dayOfWeek === 0 || dayOfWeek === 6 ? 'bg-gray-200' : 'bg-gray-100'; 
                                        const event = requests.find(req => { 
                                            const reqStart = parseDateFromAPI(req.startDate);
                                            const reqEnd = parseDateFromAPI(req.endDate);
                                            return day >= reqStart && day <= reqEnd; }); 
                                        
                                        if (event) { 
                                            if (event.status === 'APPROVED') 
                                                bgColor = 'bg-green-400'; 
                                            else if (event.status === 'PENDING') 
                                                bgColor = 'bg-yellow-400'; 
                                            else if (event.status === 'DENIED') 
                                                bgColor = 'bg-red-400'; } 
                                            return (
                                                <div 
                                                    key={day} 
                                                    className={`w-full h-4 rounded-sm ${bgColor}`}>

                                                </div>) 
                                    })}
                                </div>
                            </div>) 
                    })}
            </div>);
    }

    return (
        <div>
            <div className="flex justify-center items-center mb-4 p-2 bg-gray-200 rounded-lg">
                <div className="flex space-x-1 bg-white p-1 rounded-md">{
                    ['yearly', 'monthly', 'weekly'].map(viewName => (
                        <button key={viewName} onClick={() => 
                            setView(viewName)} 
                            className={`px-4 py-1 rounded-md text-sm font-semibold capitalize 
                            ${view === viewName ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                                {viewName}
                        </button>))}
                </div>
            </div>
            
            {renderHeader()}
            {view === 'monthly' && renderMonthlyView()}
            {view === 'weekly' && renderWeeklyView()}
            {view === 'yearly' && renderYearlyView()}
            {selectedDate && <RequestModal date={selectedDate} onClose={handleModalClose} />}
            {editingRequest && <EditRequestModal request={editingRequest} onClose={handleModalClose} />}
            {reviewingRequest && <DecisionModal request={reviewingRequest} onClose={handleModalClose} />}
        </div>
    );
}

export default CalendarView;