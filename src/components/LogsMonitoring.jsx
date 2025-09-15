import React, { useState } from 'react';

const LogsMonitoring = () => {
  const generateUserId = (index) => `USR-${1000 + index}`;

  const activityLogs = Array.from({ length: 15 }, (_, i) => ({
    id: `A${i + 1}`,
    user: generateUserId(i),
    action: ['Uploaded Document', 'Approved Claim', 'Exported Report'][i % 3],
    date: `2025-09-${15 - Math.floor(i / 2)}`,
  }));

  const securityLogs = Array.from({ length: 30 }, (_, i) => ({
    id: `S${i + 1}`,
    user: generateUserId(i + 20),
    action: i % 2 === 0 ? 'Failed Login' : 'Suspicious Activity',
    date: `2025-09-${15 - Math.floor(i / 3)}`,
  }));

  const logsPerPage = 5;
  const [activityPage, setActivityPage] = useState(1);
  const [securityPage, setSecurityPage] = useState(1);

  const paginatedActivityLogs = activityLogs.slice(
    (activityPage - 1) * logsPerPage,
    activityPage * logsPerPage
  );

  const paginatedSecurityLogs = securityLogs.slice(
    (securityPage - 1) * logsPerPage,
    securityPage * logsPerPage
  );

  const renderPagination = (currentPage, setPage, total) => {
    const totalPages = Math.ceil(total / logsPerPage);
    return (
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-sm font-medium text-gray-700">Page:</span>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 rounded text-sm ${
              currentPage === i + 1
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700'
            } hover:bg-blue-700 hover:text-white transition`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-10">
      {/* Activity Logs */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-4">Activity Logs</h2>
        <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Log ID</th>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedActivityLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-100 transition">
                <td className="px-6 py-4 border-b">{log.id}</td>
                <td className="px-6 py-4 border-b">{log.user}</td>
                <td className="px-6 py-4 border-b">{log.action}</td>
                <td className="px-6 py-4 border-b">{new Date(log.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(activityPage, setActivityPage, activityLogs.length)}
      </div>

      {/* Security Logs */}
      <div>
        <h2 className="text-xl font-bold text-blue-800 mb-4">Security Logs</h2>
        <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-6 py-3 text-left">Log ID</th>
              <th className="px-6 py-3 text-left">User ID</th>
              <th className="px-6 py-3 text-left">Action</th>
              <th className="px-6 py-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSecurityLogs.map((log) => (
              <tr key={log.id} className="hover:bg-blue-100 transition">
                <td className="px-6 py-4 border-b">{log.id}</td>
                <td className="px-6 py-4 border-b">{log.user}</td>
                <td className="px-6 py-4 border-b">{log.action}</td>
                <td className="px-6 py-4 border-b">{new Date(log.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {renderPagination(securityPage, setSecurityPage, securityLogs.length)}
      </div>
    </div>
  );
};

export default LogsMonitoring;
