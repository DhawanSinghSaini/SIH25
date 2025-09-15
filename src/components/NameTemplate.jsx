import React from 'react';

const NameTemplate = () => {
  const user = {
    name: 'Anita Rao',
    role: 'District',
    status: 'Active',
  };

  return (
    <div className="bg-white rounded-md shadow-sm p-6 mb-8">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">User Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-md">
        <div className="space-y-2">
          <p><span className="font-medium">Name:</span> {user.name}</p>
          <p><span className="font-medium">Role:</span> {user.role}</p>
        </div>
        <div className="space-y-2">
          <p><span className="font-medium">Status:</span> {user.status}</p>
        </div>
      </div>
    </div>
  );
};

export default NameTemplate;
