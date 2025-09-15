import React, { useState } from 'react';

const mockClaims = [
  { id: 'FRA-001', holder: 'Ravi Kumar', village: 'Rampur', status: 'Approved' },
  { id: 'FRA-002', holder: 'Meena Devi', village: 'Lakshmi Nagar', status: 'Pending' },
  { id: 'FRA-003', holder: 'Suresh Patel', village: 'Kondapur', status: 'Rejected' },
  { id: 'FRA-004', holder: 'Anita Rao', village: 'Thullur', status: 'Approved' },
  { id: 'FRA-005', holder: 'Mahesh Naik', village: 'Chintapalli', status: 'Pending' },
];

const FRAClaimPage = () => {
  const [filter, setFilter] = useState('All');

  const filteredClaims =
    filter === 'All' ? mockClaims : mockClaims.filter((claim) => claim.status === filter);

  return (
    <div className="bg-white p-6 rounded-md shadow-sm space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-blue-800">FRA Claims</h1>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        {['All', 'Approved', 'Pending', 'Rejected'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-1 rounded ${
              filter === status
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-700 hover:text-white transition`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Table */}
      <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Claim ID</th>
            <th className="px-6 py-3 text-left">Holder Name</th>
            <th className="px-6 py-3 text-left">Village</th>
            <th className="px-6 py-3 text-left">Status</th>
            <th className="px-6 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredClaims.map((claim) => (
            <tr key={claim.id} className="hover:bg-blue-100 transition">
              <td className="px-6 py-4 border-b">{claim.id}</td>
              <td className="px-6 py-4 border-b">{claim.holder}</td>
              <td className="px-6 py-4 border-b">{claim.village}</td>
              <td className="px-6 py-4 border-b">{claim.status}</td>
              <td className="px-6 py-4 border-b">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  View on Map
                </button>
              </td>
            </tr>
          ))}
          {filteredClaims.length === 0 && (
            <tr>
              <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                No claims found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FRAClaimPage;
