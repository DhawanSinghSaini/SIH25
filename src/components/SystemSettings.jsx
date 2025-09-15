import React, { useState } from 'react';
import { FiRefreshCw, FiKey, FiGlobe } from 'react-icons/fi';

const SystemSettings = () => {
  const [refreshFrequency, setRefreshFrequency] = useState('weekly');
  const [apiKeys, setApiKeys] = useState({
    satellite: '',
    gis: '',
    scheme: '',
  });
  const [localization, setLocalization] = useState({
    states: ['Andhra Pradesh', 'Madhya Pradesh', 'Telengana', 'Tripura'],
    languages: ['English','Hindi','Telugu','Kannada','Tamil'],
  });

  const handleKeyChange = (field, value) => {
    setApiKeys((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocalizationChange = (field, value) => {
    setLocalization((prev) => ({ ...prev, [field]: value }));
  };

  const RedButton = ({ onClick }) => (
    <button
      onClick={onClick}
      className="px-3 py-1 bg-red-600 text-white text-xs rounded-full hover:bg-red-700 transition"
    >
      Make Changes
    </button>
  );

  return (
    <div className="bg-white  p-6 space-y-8">
      {/* Section: Refresh Frequency */}
      <h2 className="text-lg font-semibold text-blue-700 mb-4">Role & Access Control</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
            <FiRefreshCw />
            <span>Data Refresh Frequency</span>
          </div>
          <RedButton />
        </div>
        <select
          value={refreshFrequency}
          onChange={(e) => setRefreshFrequency(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>

      {/* Section: API Keys */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
            <FiKey />
            <span>API Keys Management</span>
          </div>
          <RedButton />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Satellite API Key"
            value={apiKeys.satellite}
            onChange={(e) => handleKeyChange('satellite', e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="GIS Layers API Key"
            value={apiKeys.gis}
            onChange={(e) => handleKeyChange('gis', e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Scheme DBs API Key"
            value={apiKeys.scheme}
            onChange={(e) => handleKeyChange('scheme', e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Localization Section */}
<div className="space-y-4">
  <div className="flex items-center gap-2 text-blue-700 font-semibold text-lg">
    <FiGlobe />
    <span>Localization</span>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* States Table */}
    <div>
      <h4 className="text-md font-semibold text-gray-700 mb-2">States Supported</h4>
      <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">State Name</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {localization.states.map((state, index) => (
            <tr key={index} className="hover:bg-blue-100 transition">
              <td className="px-6 py-4 border-b">{state}</td>
              <td className="px-6 py-4 border-b text-green-600 font-medium">Enabled</td>
            </tr>
          ))}
          {localization.states.length === 0 && (
            <tr>
              <td colSpan="2" className="px-6 py-6 text-center text-gray-500">
                No states selected.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

    {/* Languages Table */}
    <div>
      <h4 className="text-md font-semibold text-gray-700 mb-2">Languages Supported</h4>
      <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Language</th>
            <th className="px-6 py-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {localization.languages.map((lang, index) => (
            <tr key={index} className="hover:bg-blue-100 transition">
              <td className="px-6 py-4 border-b">{lang}</td>
              <td className="px-6 py-4 border-b text-green-600 font-medium">Enabled</td>
            </tr>
          ))}
          {localization.languages.length === 0 && (
            <tr>
              <td colSpan="2" className="px-6 py-6 text-center text-gray-500">
                No languages selected.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
</div>

    </div>
  );
};

export default SystemSettings;
