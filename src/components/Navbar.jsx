import { FaUserCircle } from 'react-icons/fa';
import logo from '../assets/logo.png'; // Adjust path as needed

const Navbar = ({ onNavigate }) => {
  return (
    <nav className="w-full bg-white border-b-4 border-blue-500 shadow-sm px-6 py-3 flex items-center justify-between relative">
      {/* Left section: Navigation buttons */}
      <div className="flex space-x-3 text-blue-600 font-medium text-sm">
        <button onClick={() => onNavigate('dashboard')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Home</button>
        <button onClick={() => onNavigate('map')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Map</button>
        <button onClick={() => onNavigate('assets')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Assets</button>
        <button onClick={() => onNavigate('dss')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">DSS Engine</button>
        <button onClick={() => onNavigate('reports')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Reports</button>
        <button onClick={() => onNavigate('admin')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Admin</button>
      </div>

      {/* Center section: Logo + Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <img src={logo} alt="Vanadhar Logo" className="h-6 w-6 object-contain" />
        <h1 className="text-lg font-bold text-blue-700">Vanadhar</h1>
      </div>

      {/* Right section: Profile + Logout */}
      <div className="flex items-center space-x-3 text-blue-600 text-sm">
        <button onClick={() => onNavigate('profile')} className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none"><FaUserCircle className="text-lg" /></button>
        <button className="px-2 py-1 rounded-md hover:bg-blue-100 focus:outline-none">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
