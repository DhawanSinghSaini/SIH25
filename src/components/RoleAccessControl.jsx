import React, { useState } from 'react';

const pages = ['Map', 'Atlas', 'Assets', 'DSS', 'Reports'];
const roles = ['Ministry', 'State', 'District', 'NGO'];
const permissions = ['View', 'Edit', 'Approve'];

const RoleAccessControl = () => {
  const initialMatrix = {
    Ministry: {
      Map: { View: true, Edit: false, Approve: true },
      Atlas: { View: true, Edit: true, Approve: false },
      Assets: { View: true, Edit: false, Approve: false },
      DSS: { View: false, Edit: false, Approve: false },
      Reports: { View: true, Edit: false, Approve: false },
    },
    State: {
      Map: { View: true, Edit: false, Approve: false },
      Atlas: { View: true, Edit: false, Approve: false },
      Assets: { View: false, Edit: false, Approve: false },
      DSS: { View: false, Edit: false, Approve: false },
      Reports: { View: true, Edit: true, Approve: false },
    },
    District: {
      Map: { View: false, Edit: false, Approve: false },
      Atlas: { View: false, Edit: false, Approve: false },
      Assets: { View: true, Edit: false, Approve: false },
      DSS: { View: false, Edit: false, Approve: false },
      Reports: { View: false, Edit: false, Approve: false },
    },
    NGO: {
      Map: { View: false, Edit: false, Approve: false },
      Atlas: { View: false, Edit: false, Approve: false },
      Assets: { View: false, Edit: false, Approve: false },
      DSS: { View: false, Edit: false, Approve: false },
      Reports: { View: true, Edit: false, Approve: false },
    },
  };

  const [confirmedMatrix, setConfirmedMatrix] = useState(initialMatrix);
  const [tempMatrix, setTempMatrix] = useState(JSON.parse(JSON.stringify(initialMatrix)));

  const togglePermission = (role, page, permission) => {
    setTempMatrix((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [page]: {
          ...prev[role][page],
          [permission]: !prev[role][page][permission],
        },
      },
    }));
  };

  const handleSubmit = () => {
    const updated = JSON.parse(JSON.stringify(tempMatrix));
    setConfirmedMatrix(updated);
  };

  const isConfirmed = (role, page, permission) => confirmedMatrix[role][page][permission];
  const isChecked = (role, page, permission) => tempMatrix[role][page][permission];

  return (
    <div className="bg-white p-6 mb-8">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">Role & Access Control</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-sm">
          <thead className="bg-blue-800 text-white">
            <tr>
              <th className="px-4 py-2 text-left">Role</th>
              <th className="px-4 py-2 text-left">Page</th>
              {permissions.map((perm) => (
                <th key={perm} className="px-4 py-2 text-center">{perm}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {roles.map((role) =>
              pages.map((page, idx) => (
                <tr key={`${role}-${page}`} className="border-b">
                  {idx === 0 && (
                    <td rowSpan={pages.length} className="px-4 py-2 font-medium align-top bg-gray-50">{role}</td>
                  )}
                  <td className="px-4 py-2">{page}</td>
                  {permissions.map((perm) => {
                    const checked = isChecked(role, page, perm);
                    const confirmed = isConfirmed(role, page, perm);

                    let icon = null;
                    let bg = 'bg-gray-200';

                    if (checked && !confirmed) {
                      icon = (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      );
                      bg = 'bg-green-500';
                    } else if (checked && confirmed) {
                      icon = (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      );
                      bg = 'bg-blue-600';
                    } else if (!checked && confirmed) {
                      icon = (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      );
                      bg = 'bg-red-500';
                    }

                    return (
                      <td key={perm} className="px-4 py-2 text-center">
                        <label className="inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => togglePermission(role, page, perm)}
                            className="hidden"
                          />
                          <span
                            className={`w-5 h-5 inline-block rounded border border-gray-400 flex items-center justify-center ${bg}`}
                          >
                            {icon}
                          </span>
                        </label>
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-right">
        <button
          onClick={handleSubmit}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Confirm Changes
        </button>
      </div>
    </div>
  );
};

export default RoleAccessControl;
