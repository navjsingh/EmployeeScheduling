import React, {useState} from 'react';
import MenuIcon from './icons/MenuIcon';

function Header({ user, onLogout, onOpenModal }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleMenuClick = (modalName) => {
    onOpenModal(modalName);
    setShowMenu(false);
  }

  return (
    <header className="bg-white shadow-md w-full sticky top-0 z-40">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold text-gray-800">VacationManager</div>
        {user && (
          <div className="flex items-center">
            <span className="text-gray-700 mr-4 hidden sm:block">Welcome, {user.name}</span>
            <div className="relative">
              <button onClick={() => setShowMenu(!showMenu)} className="p-2 rounded-full hover:bg-gray-200">
                <MenuIcon />
              </button>
              {showMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-xl z-20">
                  <button 
                    onClick={() => handleMenuClick('profile')} 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      My Profile
                  </button>
                  {user.role === 'MANAGER' && (
                    <>
                      <button 
                        onClick={() => handleMenuClick('availability')} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Set Team Availability
                      </button>
                      <button 
                        onClick={() => handleMenuClick('employeeHours')} 
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                          Set Employee Hours
                      </button>
                    </>
                  )}
                  <button 
                    onClick={onLogout} 
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;