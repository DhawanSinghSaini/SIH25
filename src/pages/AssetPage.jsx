import { useState } from 'react';
import AssetFilterBar from '../components/AssetFilterBar';
import MapComponent from '../components/MapComponent';

const AssetPage = () => {
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    tribe: '',
    type: '',
  });

  const applyFilter = () => {
    console.log('Applied Filters:', filters);
  };

  const clearFilter = () => {
    setFilters({
      state: '',
      district: '',
      tribe: '',
      type: '',
    });
    console.log('Filters cleared');
  };

  const assets = [
    {
      type: 'Pond',
      location: 'Village A',
      holder: 'Ravi Kumar',
      status: 'Verified',
      snapshot: 'Available',
    },
    {
      type: 'Forest',
      location: 'Village B',
      holder: 'Meena Devi',
      status: 'Pending',
      snapshot: 'Not Available',
    },
    {
      type: 'Farm',
      location: 'Village C',
      holder: 'Suresh Patel',
      status: 'Approved',
      snapshot: 'Available',
    },
    {
      type: 'Water Bodies',
      location: 'Village D',
      holder: 'Anita Rao',
      status: 'Verified',
      snapshot: 'Available',
    },
    {
      type: 'Pond',
      location: 'Village E',
      holder: 'Mahesh Naik',
      status: 'Pending',
      snapshot: 'Not Available',
    },
  ];

  return (
    <div className="p-6">
      {/* Filter Bar */}
      <AssetFilterBar
        filters={filters}
        setFilters={setFilters}
        applyFilter={applyFilter}
        clearFilter={clearFilter}
      />

      {/* Two side-by-side sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section: Table */}
        <div className="col-span-2 bg-white rounded-md p-4 text-gray-700">
          <h2 className="text-lg font-semibold mb-4">Assets Table</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-md shadow-sm text-md border border-gray-300">
              <thead className="bg-blue-800 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Asset Type</th>
                  <th className="px-6 py-3 text-left">Location</th>
                  <th className="px-6 py-3 text-left">Linked FRA Holder</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Satellite Snapshot</th>
                </tr>
              </thead>
              <tbody>
                {assets.map((asset, index) => (
                  <tr key={index} className="border-b border-gray-300 hover:bg-blue-100 transition">
                    <td className="px-6 py-4">{asset.type}</td>
                    <td className="px-6 py-4">{asset.location}</td>
                    <td className="px-6 py-4">{asset.holder}</td>
                    <td className="px-6 py-4">{asset.status}</td>
                    <td className="px-6 py-4">{asset.snapshot}</td>
                  </tr>
                ))}
                {assets.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                      No assets available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Section: Map */}
        <div className="col-span-1 bg-white rounded-md p-4 text-gray-700">
          <h2 className="text-lg font-semibold mb-4">Map View</h2>
          <MapComponent />
        </div>
      </div>
    </div>
  );
};

export default AssetPage;

