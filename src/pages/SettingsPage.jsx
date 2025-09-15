import React, { useState } from 'react';

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    systemName: 'SmartGov Portal',
    theme: 'Light',
    syncInterval: 'Weekly',
    backupOption: 'Cloud',
  });

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 space-y-10">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">System Settings</h1>

      {/* General Settings */}
      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">General</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">System Name</label>
            <input
              type="text"
              value={settings.systemName}
              onChange={(e) => handleChange('systemName', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <select
              value={settings.theme}
              onChange={(e) => handleChange('theme', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="Light">Light</option>
              <option value="Dark">Dark</option>
              <option value="System">System Default</option>
            </select>
          </div>
        </div>
      </section>

      {/* Data Settings */}
      <section>
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Data</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sync Interval</label>
            <select
              value={settings.syncInterval}
              onChange={(e) => handleChange('syncInterval', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Backup Option</label>
            <select
              value={settings.backupOption}
              onChange={(e) => handleChange('backupOption', e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="Cloud">Cloud</option>
              <option value="Local">Local</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="text-right mt-6">
        <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
