import { useState, useEffect } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import Reports from './pages/Reports';
import WebMap from './pages/WebMap';
import AssetPage from './pages/AssetPage';
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import FRAClaimPage from './pages/FRAClaimPage';
import DSSPage from './pages/DSSPage';

function App() {
  const [showSidebar, setShowSidebar] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // 🔹 On mount, check localStorage
  useEffect(() => {
    const storedLogin = localStorage.getItem('isLoggedIn');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
    const storedSection = localStorage.getItem('activeSection');
    if (storedSection) {
      setActiveSection(storedSection);
    }
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setActiveSection('dashboard');
    localStorage.setItem('isLoggedIn', 'true'); // save login
    localStorage.setItem('activeSection', 'dashboard');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn'); // clear login
    localStorage.removeItem('activeSection');
  };

  const handleNavigate = (section) => {
    setActiveSection(section);
    localStorage.setItem('activeSection', section);
  };

  if (!isLoggedIn) {
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar onNavigate={handleNavigate} onLogout={handleLogout} />

      {/* Sidebar Toggle Icon */}
      <div
        onClick={() => setShowSidebar(!showSidebar)}
        className="absolute top-4 left-4 bg-green-600 text-white p-2 rounded-full shadow cursor-pointer z-[1000]"
      >
        {showSidebar ? <FaTimes size={18} /> : <FaBars size={18} />}
      </div>

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {showSidebar && <Sidebar onNavigate={handleNavigate} />}

        <main className="flex-1 p-6 transition-all duration-300">
          <div className="bg-white rounded-lg shadow-md p-6 space-y-8">
            {activeSection === 'dashboard' ? (
              <Home />
            ) : activeSection === 'reports' ? (
              <Reports />
            ) : activeSection === 'map' ? (
              <WebMap />
            ) : activeSection === 'assets' ? (
              <AssetPage />
            ) : activeSection === 'admin' ? (
              <UserManagement />
            ) : activeSection === 'settings' ? (
              <SettingsPage />
            ) : activeSection === 'claims' ? (
              <FRAClaimPage />
            ) : activeSection === 'profile' ? (
              <ProfilePage />
            ) : activeSection === 'dss' ? (
              <DSSPage />
            ) : (
              <div className="text-center text-gray-500">Section not found.</div>
            )}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

export default App;
