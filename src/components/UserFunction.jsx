import React, { useState, useEffect } from 'react';

const mockUsers = {
  'USR-1001': {
    name: 'Anita Rao',
    role: 'District',
    status: 'Active',
    email: 'anita.rao@example.com',
  },
  'USR-1002': {
    name: 'Ravi Kumar',
    role: 'State',
    status: 'Inactive',
    email: 'ravi.kumar@example.com',
  },
  'USR-1003': {
    name: 'Meena Devi',
    role: 'Ministry',
    status: 'Active',
    email: 'meena.devi@example.com',
  },
};

const UserFunction = () => {
  const [userId, setUserId] = useState('');
  const [user, setUser] = useState(null);
  const [activeBox, setActiveBox] = useState(null);
  const [form, setForm] = useState({
    name: '',
    role: '',
    email: '',
    password: '',
    currentPassword: '',
  });

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const toggleBox = (box) => {
    setActiveBox((prev) => (prev === box ? null : box));
  };

  const handleUserFetch = () => {
    const foundUser = mockUsers[userId.trim()];
    setUser(foundUser || null);
    setActiveBox(null);
    if (foundUser) {
      setForm({
        name: foundUser.name,
        role: foundUser.role,
        email: foundUser.email,
        password: '',
        currentPassword: '',
      });
    }
  };

  return (
    <div className="bg-white p-6 mb-6 rounded-md">
      <h2 className="text-lg font-semibold text-blue-700 mb-4">Admin User Control</h2>

      {/* User ID Input */}
      <div className="flex items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter User ID (e.g. USR-1001)"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="px-4 py-2 border rounded-md w-full md:w-1/2"
        />
        <button
          onClick={handleUserFetch}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load User
        </button>
      </div>

      {/* User Info & Actions */}
      {user ? (
        <>
          <div className="mb-6 text-gray-700">
            <p><span className="font-medium">Name:</span> {user.name}</p>
            <p><span className="font-medium">Role:</span> {user.role}</p>
            <p><span className="font-medium">Status:</span> {user.status}</p>
            <p><span className="font-medium">Email:</span> {user.email}</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={() => toggleBox('add')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add User</button>
            <button onClick={() => toggleBox('edit')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Edit User</button>
            <button onClick={() => toggleBox('remove')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Remove User</button>
            <button onClick={() => toggleBox('reset')} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reset Password</button>
          </div>
        </>
      ) : userId && (
        <p className="text-red-600 mb-6">No user found with ID: <span className="font-semibold">{userId}</span></p>
      )}

      {/* Add User */}
{activeBox === 'add' && (
  <div className="border-2 border-blue-600 rounded-md p-6 mb-6">
    <h3 className="text-xl font-semibold text-blue-700 mb-4">Add New User</h3>
    <input
      type="text"
      placeholder="Full Name"
      value={form.name}
      onChange={(e) => handleChange('name', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <select
      value={form.role}
      onChange={(e) => handleChange('role', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    >
      <option value="">Select Role</option>
      <option value="Ministry">Ministry</option>
      <option value="State">State</option>
      <option value="District">District</option>
      <option value="NGO">NGO</option>
    </select>
    <input
      type="email"
      placeholder="Email Address"
      value={form.email}
      onChange={(e) => handleChange('email', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <div className="flex gap-4">
      <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add User</button>
      <button onClick={() => setActiveBox(null)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
    </div>
  </div>
)}

{/* Edit User */}
{activeBox === 'edit' && (
  <div className="border-2 border-blue-600 rounded-md p-6 mb-6">
    <h3 className="text-xl font-semibold text-blue-700 mb-4">Edit User</h3>
    <input
      type="text"
      placeholder="Full Name"
      value={form.name}
      onChange={(e) => handleChange('name', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <select
      value={form.role}
      onChange={(e) => handleChange('role', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    >
      <option value="">Select Role</option>
      <option value="Ministry">Ministry</option>
      <option value="State">State</option>
      <option value="District">District</option>
      <option value="NGO">NGO</option>
    </select>
    <input
      type="email"
      placeholder="Email Address"
      value={form.email}
      onChange={(e) => handleChange('email', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <div className="flex gap-4">
      <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Changes</button>
      <button onClick={() => setActiveBox(null)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
    </div>
  </div>
)}

{/* Remove User */}
{activeBox === 'remove' && (
  <div className="border-2 border-blue-600 rounded-md p-6 mb-6">
    <h3 className="text-xl font-semibold text-blue-700 mb-4">Remove User</h3>
    <p className="mb-4 text-gray-700">
      Are you sure you want to remove <span className="font-semibold">{user.name}</span>?
    </p>
    <div className="flex gap-4">
      <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Confirm Remove</button>
      <button onClick={() => setActiveBox(null)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
    </div>
  </div>
)}

{/* Reset Password */}
{activeBox === 'reset' && (
  <div className="border-2 border-blue-600 rounded-md p-6 mb-6">
    <h3 className="text-xl font-semibold text-blue-700 mb-4">Reset Password</h3>
    <input
      type="email"
      placeholder="User Email"
      value={form.email}
      onChange={(e) => handleChange('email', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <input
      type="password"
      placeholder="Current Password"
      value={form.currentPassword}
      onChange={(e) => handleChange('currentPassword', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <input
      type="password"
      placeholder="New Password"
      value={form.password}
      onChange={(e) => handleChange('password', e.target.value)}
      className="w-full mb-4 px-4 py-2 border rounded-md"
    />
    <div className="flex gap-4">
      <button className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Reset</button>
      <button onClick={() => setActiveBox(null)} className="px-5 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancel</button>
    </div>
  </div>
)}

    </div>
  );
};

export default UserFunction;
