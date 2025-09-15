// components/AssetFilterBar.jsx
import React from 'react';

const AssetFilterBar = ({ filters, setFilters, applyFilter, clearFilter }) => {
  const handleChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-wrap gap-6 items-end mb-8">
      {/* State */}
      <div>
        <label className="block mb-2 text-base font-medium text-gray-700">State</label>
        <select
          value={filters.state}
          onChange={(e) => handleChange('state', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select State</option>
          <option value="AP">Andhra Pradesh</option>
          <option value="MH">Maharashtra</option>
          <option value="MP">Madhya Pradesh</option>
        </select>
      </div>

      {/* District */}
      <div>
        <label className="block mb-2 text-base font-medium text-gray-700">District</label>
        <select
          value={filters.district}
          onChange={(e) => handleChange('district', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select District</option>
          <option value="Guntur">Guntur</option>
          <option value="Nagpur">Nagpur</option>
          <option value="Bhopal">Bhopal</option>
        </select>
      </div>

      {/* Tribe */}
      <div>
        <label className="block mb-2 text-base font-medium text-gray-700">Tribe</label>
        <select
          value={filters.tribe}
          onChange={(e) => handleChange('tribe', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Tribe</option>
          <option value="Gond">Gond</option>
          <option value="Koya">Koya</option>
          <option value="Baiga">Baiga</option>
        </select>
      </div>

      {/* Type */}
      <div>
        <label className="block mb-2 text-base font-medium text-gray-700">Type</label>
        <select
          value={filters.type}
          onChange={(e) => handleChange('type', e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          <option value="Pond">Pond</option>
          <option value="Forest">Forest</option>
          <option value="Farm">Farm</option>
          <option value="Water Bodies">Water Bodies</option>
        </select>
      </div>

      {/* Buttons */}
      <button
        onClick={clearFilter}
        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition text-sm"
      >
        Clear
      </button>

      <button
        onClick={applyFilter}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
      >
        Filter
      </button>
    </div>
  );
};

export default AssetFilterBar;
