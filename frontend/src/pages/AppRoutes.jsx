import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginPage from './LoginPage';
import RegisterPage from './RegisterPage';
import DashboardPage from './DashboardPage';
import AdminDashboard from './AdminDashboard';
import AdminHomePage from './AdminHomePage';
import ProfileModal from '../components/modals/ProfileModal';
import AvailabilityModal from '../components/modals/AvailabilityModal';
import SetEmployeeHoursModal from '../components/modals/SetEmployeeHoursModal';
import ForgotPasswordModal from '../components/modals/ForgotPasswordModal';
import MenuIcon from '../components/icons/MenuIcon';

function AppRoutes() {
  const { user, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState(user ? 'dashboard' : 'login');
  const [showMenu, setShowMenu] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {

    setShowMenu(false);

    if (user) {
      setCurrentPage('dashboard');
      setActiveModal(null);
    } else {
      setCurrentPage('login');
    }
  }, [user]);

  const handleLogout = () => {
    logout();
  };

  const openModal = (modalName) => {
    setActiveModal(modalName);
    setShowMenu(false);
  };

    return (
        <div className="min-h-screen flex flex-col">
            <Header 
              user={user} 
              onLogout={handleLogout} 
              onOpenModal={openModal} />
            
            <main className="flex-grow container mx-auto p-4 md:p-6">
                {!user ? (
                    <>
                        {currentPage === 'login' && 
                          activeModal !== 'forgotPassword' && 
                          <LoginPage 
                            onSwitchToRegister={() => 
                              setCurrentPage('register')} 
                            onForgotPassword={() => 
                              openModal('forgotPassword')} />}

                        {currentPage === 'register' && 
                          <RegisterPage 
                            onSwitchToLogin={() => 
                              setCurrentPage('login')} />}

                        {activeModal === 'forgotPassword' && 
                          <ForgotPasswordModal onClose={() => 
                            setActiveModal(null)} />}
                    </>
                ) : ( user.role === 'ADMIN' ? <AdminHomePage /> : <DashboardPage /> )}
            </main>

            <Footer />
            
            {activeModal === 'profile' && 
              <ProfileModal onClose={() => setActiveModal(null)} />}

            {activeModal === 'availability' && 
              <AvailabilityModal onClose={() => setActiveModal(null)} />}

            {activeModal === 'employeeHours' && 
              <SetEmployeeHoursModal onClose={() => setActiveModal(null)} />}
        </div>
    );
}

export default AppRoutes;