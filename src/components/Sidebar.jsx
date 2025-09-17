const Sidebar = ({ onNavigate }) => {
  const isAdmin = true;

  return (
    <aside className="w-64 min-h-screen bg-white border-r border-gray-300 shadow-sm flex flex-col py-6 px-4 text-blue-700 text-sm font-medium">
      <nav className="flex flex-col space-y-3">
        <button onClick={() => onNavigate('dashboard')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">Home</button>
        <button onClick={() => onNavigate('claims')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">FRA Claims</button>
        <button onClick={() => onNavigate('map')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">Atlas Map</button>
        <button onClick={() => onNavigate('assets')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">Asset Mapping</button>
        <button onClick={() => onNavigate('dss')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">DSS Engine</button>
        <button onClick={() => onNavigate('reports')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">Reports</button>
        {isAdmin && (
          <button onClick={() => onNavigate('admin')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">User Management</button>
        )}
        <button onClick={() => onNavigate('settings')} className="text-left px-3 py-2 rounded-md hover:bg-blue-100">Settings</button>
      </nav>
    </aside>
  );
};

export default Sidebar;


