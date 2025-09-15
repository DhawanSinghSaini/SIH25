import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Reports from './pages/Reports';
import WebMap from './pages/WebMap';
import AssetPage from './pages/AssetPage'; // 👈 New asset page
import UserManagement from './pages/UserManagement';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import FRAClaimPage from './pages/FRAClaimPage';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const hideSidebar = false;

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Navbar */}
      <Navbar onNavigate={setActiveSection} />

      {/* Sidebar + Content */}
      <div className="flex flex-1">
        {!hideSidebar && <Sidebar onNavigate={setActiveSection} />}

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
