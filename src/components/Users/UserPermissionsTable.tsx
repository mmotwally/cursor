import React from 'react';

interface UserPermission {
  id: number;
  name: string;
  description: string;
  grant_type: 'allow' | 'deny' | 'inherit';
}

interface UserPermissionsTableProps {
  groupedPermissions: Record<string, UserPermission[]>;
  visibleColumns: { id: string; label: string; visible: boolean }[];
  handlePermissionChange: (permissionId: number, grantType: 'allow' | 'deny' | 'inherit') => void;
  rolePermissions: string[];
  loading: boolean;
}

const UserPermissionsTable: React.FC<UserPermissionsTableProps> = ({
  groupedPermissions,
  visibleColumns,
  handlePermissionChange,
  rolePermissions,
  loading
}) => {
  if (loading) {
    return <div className="py-8 text-center text-gray-500">Loading permissions...</div>;
  }

  if (!Object.keys(groupedPermissions).length) {
    return <div className="py-8 text-center text-gray-500">No permissions found.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border border-gray-200 rounded-lg">
        <thead>
          <tr>
            {visibleColumns.map(col => (
              <th key={col.id} className="px-4 py-2 bg-gray-100 border-b text-left text-xs font-semibold text-gray-700">
                {col.label}
              </th>
            ))}
            <th className="px-4 py-2 bg-gray-100 border-b text-left text-xs font-semibold text-gray-700">Grant</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedPermissions).map(([category, permissions]) => (
            <React.Fragment key={category}>
              <tr>
                <td colSpan={visibleColumns.length + 1} className="bg-gray-50 px-4 py-2 font-bold text-gray-800 border-t border-b">
                  {category}
                </td>
              </tr>
              {permissions.map(permission => (
                <tr key={permission.id} className="border-b">
                  {visibleColumns.map(col => {
                    if (col.id === 'permission') {
                      return <td key={col.id} className="px-4 py-2 text-sm">{permission.name}</td>;
                    }
                    if (col.id === 'description') {
                      return <td key={col.id} className="px-4 py-2 text-sm">{permission.description}</td>;
                    }
                    if (col.id === 'role_setting') {
                      return <td key={col.id} className="px-4 py-2 text-sm">
                        {rolePermissions.includes(permission.name) ? <span className="text-green-600 font-semibold">Allow</span> : <span className="text-gray-400">-</span>}
                      </td>;
                    }
                    if (col.id === 'user_setting') {
                      return <td key={col.id} className="px-4 py-2 text-sm">
                        {permission.grant_type !== 'inherit' ? (
                          <span className={permission.grant_type === 'allow' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                            {permission.grant_type.charAt(0).toUpperCase() + permission.grant_type.slice(1)}
                          </span>
                        ) : <span className="text-gray-400">-</span>}
                      </td>;
                    }
                    return null;
                  })}
                  <td className="px-4 py-2 text-sm">
                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 rounded ${permission.grant_type === 'allow' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handlePermissionChange(permission.id, 'allow')}
                      >
                        Allow
                      </button>
                      <button
                        className={`px-2 py-1 rounded ${permission.grant_type === 'deny' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handlePermissionChange(permission.id, 'deny')}
                      >
                        Deny
                      </button>
                      <button
                        className={`px-2 py-1 rounded ${permission.grant_type === 'inherit' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
                        onClick={() => handlePermissionChange(permission.id, 'inherit')}
                      >
                        Inherit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserPermissionsTable; 