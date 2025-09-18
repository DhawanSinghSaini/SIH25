import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Adjust path as needed

const Navbar = ({ onNavigate, onLogout }) => {
  return (
    <nav className="w-full bg-white border-b-4 border-blue-500 shadow-sm px-6 py-3 flex items-center justify-between relative">
      {/* Left section: (empty for now, could hold menu toggle later) */}
      <div />

      {/* Center section: Logo + Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <img src={logo} alt="Vanadhar Logo" className="h-6 w-6 object-contain" />
        <h1 className="text-lg font-bold text-blue-700">Vanadhar</h1>
      </div>

      {/* Right section: Profile + Logout together */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => onNavigate('profile')}
          className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none"
        >
          <FaUserCircle className="text-xl text-blue-600" />
        </button>
        <button
          onClick={onLogout}
          className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
