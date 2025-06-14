import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import AppRoutes from '../pages/AppRoutes';

function App() {
  return (
    <AuthProvider>
        <AppRoutes />
    </AuthProvider>
  );
}

export default App;