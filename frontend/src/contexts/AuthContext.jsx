import React, { useState, useEffect, createContext, useContext } from 'react';
import * as api from '../services/apiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkLoggedIn = async () => {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    
                    const currentUser = await api.getCurrentUser();
                    setUser(currentUser);
                } catch (error) {
                    console.error("Session expired or token is invalid.", error);
                    localStorage.removeItem('accessToken');
                    setUser(null);
                }
            }
            setLoading(false);
        };
        checkLoggedIn();
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.login({ email, password });
            localStorage.setItem('accessToken', response.accessToken);

            const currentUser = await api.getCurrentUser();
            setUser(currentUser);
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const register = async (name, email, password) => {
        try {
            await api.register({ name, email, password });
            await login(email, password);
            return true;
        } catch (error) {
            console.error("Registration failed:", error);
            return false;
        }
    };

    const logout = () => {
        localStorage.removeItem('accessToken');
        setUser(null);
    };

    const authContextValue = {
        user,
        loading,
        login,
        register,
        logout,
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
