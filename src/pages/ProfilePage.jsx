import React, { useState } from 'react';

const ProfilePage = () => {
  const [user, setUser] = useState({
    name: 'Anita Rao',
    email: 'anita.rao@example.com',
    role: 'District',
  });

  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-md  space-y-8">
      <h1 className="text-2xl font-bold text-blue-800 mb-4">Profile</h1>

      {/* User Info Table */}
      <table className="min-w-full bg-white border rounded-md shadow-sm text-md">
        <thead className="bg-blue-800 text-white">
          <tr>
            <th className="px-6 py-3 text-left">Field</th>
            <th className="px-6 py-3 text-left">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr className="hover:bg-blue-100 transition">
            <td className="px-6 py-4 border-b font-medium">Name</td>
            <td className="px-6 py-4 border-b">{user.name}</td>
          </tr>
          <tr className="hover:bg-blue-100 transition">
            <td className="px-6 py-4 border-b font-medium">Email</td>
            <td className="px-6 py-4 border-b">{user.email}</td>
          </tr>
          <tr className="hover:bg-blue-100 transition">
            <td className="px-6 py-4 border-b font-medium">Role</td>
            <td className="px-6 py-4 border-b">{user.role}</td>
          </tr>
        </tbody>
      </table>

      {/* Edit Profile Button */}
      <div className="text-right">
        <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
          Edit Profile
        </button>
      </div>

      {/* Change Password Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold text-blue-700 mb-4">Change Password</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="password"
            placeholder="Current Password"
            value={form.currentPassword}
            onChange={(e) => handleChange('currentPassword', e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
          <input
            type="password"
            placeholder="New Password"
            value={form.newPassword}
            onChange={(e) => handleChange('newPassword', e.target.value)}
            className="px-4 py-2 border rounded-md"
          />
        </div>
        <div className="mt-4 text-right">
          <button className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
            Update Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
