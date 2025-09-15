import React, { useState } from 'react';
import { FaReact } from 'react-icons/fa';
import NameTemplate from '../components/NameTemplate';
import UserFunction from '../components/UserFunction';
import RoleAccessControl from '../components/RoleAccessControl';
import SystemSettings from '../components/SystemSettings';
import LogsMonitoring from '../components/LogsMonitoring';

const UserManagement = () => {
  
  return (
  <div className="p-6">
    <UserFunction />
    <RoleAccessControl />
    <SystemSettings />
    <LogsMonitoring />
  </div>
);

};

export default UserManagement;
