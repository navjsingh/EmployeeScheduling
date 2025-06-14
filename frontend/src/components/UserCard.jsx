import EditIcon from "./icons/EditIcon";
import TrashIcon from "./icons/TrashIcon";


function UserCard({ user, onEdit, onRemove }) {

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between transition hover:shadow-lg">
      <div>
        <p className="font-bold text-lg text-gray-800">
            {user.name}
        </p>
        <p className="text-sm text-gray-500">
            {user.email}
        </p>
        <p className="mt-2 inline-block bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded-full">
            {user.role}
        </p>
      </div>
      <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
        <button 
            onClick={onEdit} 
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-600 bg-gray-200 rounded-lg hover:bg-gray-300">
          
            <EditIcon /> Edit
        </button>

        <button 
            onClick={onRemove} 
            className="flex items-center px-3 py-1 text-sm font-medium text-red-600 bg-red-100 rounded-lg hover:bg-red-200">
            <TrashIcon /> Remove
        </button>
      </div>
    </div>
  );
}

export default UserCard;