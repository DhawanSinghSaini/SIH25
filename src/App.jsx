import { useState } from 'react';
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
  // State to manage login status. Initially false to show the landing page.
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  
  // This would be your authentication logic.
  // For now, it just sets isLoggedIn to true.
  const handleLogin = () => {
    setIsLoggedIn(true);
    // After login, navigate to the main dashboard
    setActiveSection('dashboard'); 
  };
  
  // A function to handle logging out
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // If the user is not logged in, show the LandingPage
  if (!isLoggedIn) {
    // Pass the handleLogin function to the LandingPage
    return <LandingPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar onNavigate={setActiveSection} onLogout={handleLogout} />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        <Sidebar onNavigate={setActiveSection} />

        <main className="flex-1 p-6">
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

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;