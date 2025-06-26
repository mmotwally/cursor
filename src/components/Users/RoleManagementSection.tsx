import React from 'react';

interface RoleManagementSectionProps {
  rolePermissions: any[];
  showAddRole: boolean;
  setShowAddRole: (show: boolean) => void;
  newRoleName: string;
  setNewRoleName: (name: string) => void;
  addRoleError: string;
  handleAddRole: () => void;
  handleDeleteRole: (role: string) => void;
}

const RoleManagementSection: React.FC<RoleManagementSectionProps> = ({
  rolePermissions,
  showAddRole,
  setShowAddRole,
  newRoleName,
  setNewRoleName,
  addRoleError,
  handleAddRole,
  handleDeleteRole
}) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-lg font-semibold text-gray-900">Roles</h3>
      <button
        onClick={() => setShowAddRole(!showAddRole)}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        {showAddRole ? 'Cancel' : 'Add Role'}
      </button>
    </div>
    {showAddRole && (
      <div className="flex items-center space-x-2 mb-2">
        <input
          type="text"
          value={newRoleName}
          onChange={e => setNewRoleName(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
          placeholder="Enter new role name"
        />
        <button
          onClick={handleAddRole}
          className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Add
        </button>
      </div>
    )}
    {addRoleError && <div className="text-xs text-red-600 mb-2">{addRoleError}</div>}
    <div className="flex flex-wrap gap-2">
      {rolePermissions.map(rp => (
        <div key={rp.role} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
          <span className="mr-2 font-medium">{rp.role}</span>
          {!['admin', 'manager', 'user'].includes(rp.role) && (
            <button
              onClick={() => handleDeleteRole(rp.role)}
              className="text-red-600 hover:text-red-800 text-xs ml-1"
              title="Delete Role"
            >
              &times;
            </button>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default RoleManagementSection; 