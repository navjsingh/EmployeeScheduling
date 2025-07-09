import React from 'react';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

function TeamCard({ team, onEdit, onRemove }) {
    const getTeamColor = (teamName) => {
        const colors = {
            'Red': 'bg-red-100 border-red-300 text-red-800',
            'Blue': 'bg-blue-100 border-blue-300 text-blue-800',
            'Green': 'bg-green-100 border-green-300 text-green-800',
            'Yellow': 'bg-yellow-100 border-yellow-300 text-yellow-800'
        };
        return colors[teamName] || 'bg-gray-100 border-gray-300 text-gray-800';
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{team.name}</h3>
                    {team.description && (
                        <p className="text-gray-600 text-sm mb-3">{team.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span>{team.memberCount} members</span>
                        <span>{team.managerCount} managers</span>
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit team"
                    >
                        <EditIcon />
                    </button>
                    <button
                        onClick={onRemove}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete team"
                    >
                        <TrashIcon />
                    </button>
                </div>
            </div>
            
            <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium border ${getTeamColor(team.name)}`}>
                {team.name} Team
            </div>
        </div>
    );
}

export default TeamCard; 