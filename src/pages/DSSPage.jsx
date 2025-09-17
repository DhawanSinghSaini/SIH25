import React, { useState } from 'react';
import DSSAvailableSchemesCard from '../components/DSSAvailableSchemesCard';
import DSSLinkedSchemesCard from '../components/DSSLinkedSchemesCard';
import DSSTotalBeneficiariesCard from '../components/DSSTotalBeneficiariesCard';
import MapComponent from '../components/MapComponent';
import MapApp from '../components/MapApp';

const DSSPage = () => {
  const [selectedVillage, setSelectedVillage] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    district: '',
    tribe: '',
    status: '',
  });

  const [page, setPage] = useState(1);
  const pageSize = 5;

  const recommendations = [
    { name: 'Ravi Kumar', village: 'Rampur', assets: 'Land, Livestock', scheme: 'PM-KISAN', status: 'Pending' },
    { name: 'Meena Devi', village: 'Lakshmi Nagar', assets: 'Forest Rights', scheme: 'Jal Jeevan Mission', status: 'Recommended' },
    { name: 'Suresh Patel', village: 'Kondapur', assets: 'Agricultural Tools', scheme: 'MGNREGA', status: 'Deferred' },
    { name: 'Anita Rao', village: 'Chintalapudi', assets: 'Irrigation Pump', scheme: 'PM-KISAN', status: 'Pending' },
    { name: 'Ramesh Naik', village: 'Kothapalli', assets: 'Goats', scheme: 'DAJGUA Schemes', status: 'Recommended' },
    { name: 'Lakshmi Bai', village: 'Nandigama', assets: 'Forest Produce', scheme: 'National Rural Livelihood Mission', status: 'Pending' },
    { name: 'Venkatesh', village: 'Macherla', assets: 'Land', scheme: 'MGNREGA', status: 'Deferred' },
    { name: 'Padma Rao', village: 'Tiruvuru', assets: 'Livestock', scheme: 'PM-KISAN', status: 'Recommended' },
    { name: 'Kiran Kumar', village: 'Palakonda', assets: 'Agricultural Tools', scheme: 'Jal Jeevan Mission', status: 'Pending' },
    { name: 'Sunita Devi', village: 'Rajampet', assets: 'Forest Rights', scheme: 'DAJGUA Schemes', status: 'Deferred' },
  ];

  const totalPages = Math.ceil(recommendations.length / pageSize);
  const paginatedData = recommendations.slice((page - 1) * pageSize, page * pageSize);

  const handleRunAnalysis = () => {
    if (!selectedState) {
      alert('Please select a state before running analysis.');
      return;
    }
    console.log(`Running DSS analysis for ${selectedState}`);
  };

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApplyFilter = () => {
    console.log('Applying filters:', filters);
  };

  return (
  <div className="bg-white p-6 rounded-md space-y-6">
    <h1 className="text-2xl font-bold text-blue-800 mb-4">DSS Analysis</h1>

    {/* Run Analysis */}
    <div className="flex flex-wrap justify-between items-center gap-4">
      <select
        value={selectedState}
        onChange={(e) => setSelectedState(e.target.value)}
        className="px-4 py-2 border rounded-md w-full md:w-1/3"
      >
        <option value="">Select State</option>
        <option value="Andhra Pradesh">Andhra Pradesh</option>
        <option value="Telangana">Telangana</option>
        <option value="Karnataka">Karnataka</option>
        <option value="Tamil Nadu">Tamil Nadu</option>
        <option value="Kerala">Kerala</option>
      </select>

      <button
        onClick={handleRunAnalysis}
        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Run Analysis
      </button>
    </div>

    {/* Filter Bar */}
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
      <select
        value={filters.state}
        onChange={(e) => handleFilterChange('state', e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">State</option>
        <option value="Andhra Pradesh">Andhra Pradesh</option>
        <option value="Telangana">Telangana</option>
        <option value="Karnataka">Karnataka</option>
      </select>

      <select
        value={filters.district}
        onChange={(e) => handleFilterChange('district', e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">District</option>
        <option value="Guntur">Guntur</option>
        <option value="Nellore">Nellore</option>
        <option value="Vizianagaram">Vizianagaram</option>
      </select>

      <select
        value={filters.tribe}
        onChange={(e) => handleFilterChange('tribe', e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">Tribe</option>
        <option value="Koya">Koya</option>
        <option value="Chenchu">Chenchu</option>
        <option value="Yanadi">Yanadi</option>
      </select>

      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
        className="px-4 py-2 border rounded-md"
      >
        <option value="">Claim Status</option>
        <option value="Approved">Approved</option>
        <option value="Pending">Pending</option>
        <option value="Rejected">Rejected</option>
      </select>

      <button
        onClick={handleApplyFilter}
        className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full"
      >
        Apply Filter
      </button>
    </div>

    {/* DSS Summary */}
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">DSS Summary</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <DSSTotalBeneficiariesCard />
        <DSSAvailableSchemesCard schemes={[
          'Jal Jeevan Mission',
          'DAJGUA Schemes',
          'National Rural Livelihood Mission'
        ]} />
        <DSSLinkedSchemesCard linkedSchemes={[
          'PM-KISAN',
          'MGNREGA',
          'Ayushman Bharat'
        ]} />
      </div>
    </div>

    {/* DSS Recommendation Panel */}
    <div>
      <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">DSS Recommendation Panel</h2>
      <p className="text-sm text-gray-600 mb-4">
        Displays AI/Rule-based recommendations per FRA household/village
      </p>

      <table className="min-w-full bg-white border rounded-md text-md">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">FRA Holder Name</th>
            <th className="px-6 py-3 text-left">Village</th>
            <th className="px-6 py-3 text-left">Assets</th>
            <th className="px-6 py-3 text-left">Suggested Scheme</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((rec, idx) => (
            <tr key={idx} className="hover:bg-blue-100 transition">
              <td className="px-6 py-4 border-b">{rec.name}</td>
              <td className="px-6 py-4 border-b">{rec.village}</td>
              <td className="px-6 py-4 border-b">{rec.assets}</td>
              <td className="px-6 py-4 border-b">{rec.scheme}</td>
              <td className="px-6 py-4 border-b">{rec.status}</td>
              <td className="px-6 py-4 border-b">
                <div className="flex flex-col space-y-2">
                  <button className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                    Approve Link
                  </button>
                  <button className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-sm">
                    Defer
                  </button>
                  <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">
                    View Details
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center items-center space-x-2">
        <button
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-4 py-2 text-blue-800 font-semibold">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>

    {/* Interactive DSS Map */}
<div>
  <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Interactive DSS Map (WebGIS Overlay)</h2>
  <p className="text-sm text-gray-600 mb-4">
    Map with layers showing scheme recommendations. Color codes by scheme type.
  </p>

  <div className="border rounded-md overflow-hidden mb-6">
    <MapApp onVillageClick={(villageData) => setSelectedVillage(villageData)} />
  </div>

  {/* Scheme Eligibility Popup */}
  {selectedVillage && (
    <div className="bg-gray-50 border border-blue-300 rounded-md p-4">
      <h3 className="text-lg font-semibold text-blue-700 mb-2">Scheme Eligibility for {selectedVillage.name}</h3>
      <p className="text-sm text-gray-700 mb-1"><strong>District:</strong> {selectedVillage.district}</p>
      <p className="text-sm text-gray-700 mb-1"><strong>Assets:</strong> {selectedVillage.assets}</p>
      <p className="text-sm text-gray-700 mb-1"><strong>Recommended Schemes:</strong></p>
      <ul className="list-disc pl-5 text-sm text-blue-700">
        {selectedVillage.schemes.map((scheme, idx) => (
          <li key={idx}>{scheme}</li>
        ))}
      </ul>
    </div>
  )}
</div>

  {/* Scheme Approval Status */}
<div>
  <h2 className="text-xl font-semibold text-blue-700 mt-8 mb-4">Scheme Approval Status</h2>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Approved Schemes Table */}
    <div>
      <h3 className="text-lg font-semibold text-green-700 mb-2">Approved Schemes</h3>
      <table className="min-w-full bg-white border rounded-md text-sm">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Beneficiary</th>
            <th className="px-4 py-2 text-left">Village</th>
            <th className="px-4 py-2 text-left">Scheme</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Ravi Kumar', village: 'Rampur', scheme: 'PM-KISAN' },
            { name: 'Meena Devi', village: 'Lakshmi Nagar', scheme: 'Jal Jeevan Mission' },
            { name: 'Padma Rao', village: 'Tiruvuru', scheme: 'MGNREGA' },
          ].map((item, idx) => (
            <tr key={idx} className="hover:bg-green-50">
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.village}</td>
              <td className="px-4 py-2 border-b">{item.scheme}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Rejected Schemes Table */}
    <div>
      <h3 className="text-lg font-semibold text-red-700 mb-2">Rejected Schemes</h3>
      <table className="min-w-full bg-white border rounded-md text-sm">
        <thead className="bg-red-600 text-white">
          <tr>
            <th className="px-4 py-2 text-left">Beneficiary</th>
            <th className="px-4 py-2 text-left">Village</th>
            <th className="px-4 py-2 text-left">Scheme</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: 'Suresh Patel', village: 'Kondapur', scheme: 'DAJGUA Schemes' },
            { name: 'Lakshmi Bai', village: 'Nandigama', scheme: 'National Rural Livelihood Mission' },
            { name: 'Sunita Devi', village: 'Rajampet', scheme: 'Jal Jeevan Mission' },
          ].map((item, idx) => (
            <tr key={idx} className="hover:bg-red-50">
              <td className="px-4 py-2 border-b">{item.name}</td>
              <td className="px-4 py-2 border-b">{item.village}</td>
              <td className="px-4 py-2 border-b">{item.scheme}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>

  {/* Action Buttons */}
  <div className="mt-6 flex flex-wrap gap-4 justify-center">
    <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
      Download DSS Analysis
    </button>
    <button className="px-5 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
      Approve All Eligible
    </button>
    <button className="px-5 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition">
      Generate Report
    </button>
    <button className="px-5 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
      Send to Ministry
    </button>
  </div>
</div>

  </div>
);

};

export default DSSPage;

