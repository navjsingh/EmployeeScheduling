import React, { useState, createContext, useContext } from 'react';
import { MOCK_USERS } from '../data/mockData';


const AuthContext = createContext(null);


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const foundUser = MOCK_USERS[email];
    if (foundUser && foundUser.password === password) {
      setUser({ email, ...foundUser });
      return true;
    }
    return false;
  };

  const register = (name, email, password, role = 'EMPLOYEE') => {
    if (MOCK_USERS[email]) return false;
    const newUser = { password, role, name, id: Math.random() * 10000 };
    if (role === 'EMPLOYEE') {
      newUser.totalVacationHours = 80;
      newUser.usedVacationHours = 0;
      const managerEmail = Object.keys(MOCK_USERS).find(key => MOCK_USERS[key].role === 'MANAGER');
      if (managerEmail) {
        MOCK_USERS[managerEmail].assignedEmployees.push(newUser.id);
      }
    }
    MOCK_USERS[email] = newUser;
    
    if (!user || user.role !== 'ADMIN') {
      setUser({ email, ...newUser });
    }
    return true;
  }

  const updateUser = (email, data) => {
    if (MOCK_USERS[email]) {
      MOCK_USERS[email] = { ...MOCK_USERS[email], ...data };
      
      if (user && user.email === email) {
        setUser(prev => ({ ...prev, ...data }));
      }
      return true;
    }
    return false;
  }

  const resetPassword = (email, newPassword) => {
    if (MOCK_USERS[email]) {
      MOCK_USERS[email].password = newPassword;
      return true;
    }
    return false;
  }

  const updatePassword = (newPassword) => {
    if (user && MOCK_USERS[user.email]) {
      MOCK_USERS[user.email].password = newPassword;
      return true;
    }
    return false;
  }

  const removeUser = (email) => {
    if (MOCK_USERS[email]) {
      delete MOCK_USERS[email];
      return true;
    }
    return false;
  }

  const logout = () => {
    setUser(null);
  };


  const authContextValue = {
    user,
    MOCK_USERS, 
    login,
    register,
    logout,
    updateUser,
    removeUser,
    updatePassword,
    resetPassword
  };

  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  return useContext(AuthContext);
};