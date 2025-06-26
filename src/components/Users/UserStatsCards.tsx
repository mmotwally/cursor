import React from 'react';
import { Users, Shield } from 'lucide-react';

interface UserStatsCardsProps {
  users: any[];
  adminCount: number;
  managerCount: number;
  userCount: number;
  customRolesCount: number;
}

const UserStatsCards: React.FC<UserStatsCardsProps> = ({ users, adminCount, managerCount, userCount, customRolesCount }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{users.length}</p>
        </div>
        <Users className="h-8 w-8 text-blue-500" />
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Administrators</p>
          <p className="text-2xl font-bold text-gray-900">{adminCount}</p>
        </div>
        <Shield className="h-8 w-8 text-red-500" />
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Managers</p>
          <p className="text-2xl font-bold text-gray-900">{managerCount}</p>
        </div>
        <Users className="h-8 w-8 text-blue-400" />
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Other Roles</p>
          <p className="text-2xl font-bold text-gray-900">{customRolesCount}</p>
        </div>
        <Users className="h-8 w-8 text-gray-400" />
      </div>
    </div>
  </div>
);

export default UserStatsCards; 