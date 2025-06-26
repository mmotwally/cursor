import React from 'react';
import { Edit, Trash2, Shield, User } from 'lucide-react';

interface UserTableProps {
  users: any[];
  visibleColumns: any[];
  getRoleIcon: (role: string) => React.ReactNode;
  getRoleBadgeColor: (role: string) => string;
  handleEditUser: (user: any) => void;
  handleDeleteUser: (id: number, username: string) => void;
  handleManageUserPermissions: (id: number, username: string, role: string) => void;
  hasPermission: (perm: string) => boolean;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  visibleColumns,
  getRoleIcon,
  getRoleBadgeColor,
  handleEditUser,
  handleDeleteUser,
  handleManageUserPermissions,
  hasPermission
}) => (
  <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {visibleColumns.map((col: any) => (
            <th
              key={col.id}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              style={{ width: col.width }}
            >
              {col.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {users.map((user: any) => (
          <tr key={user.id} className="hover:bg-gray-50">
            {visibleColumns.map((col: any) => {
              switch (col.id) {
                case 'user':
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                      {getRoleIcon(user.role)}
                      <span className="font-medium text-gray-900">{user.username}</span>
                      <span className="text-xs text-gray-500 ml-2">({user.email})</span>
                    </td>
                  );
                case 'role':
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                  );
                case 'created':
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  );
                case 'updated':
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.updated_at).toLocaleDateString()}
                    </td>
                  );
                case 'actions':
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap flex gap-2">
                      {hasPermission('user.edit') && (
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit User"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission('user.delete') && (
                        <button
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          className="text-red-600 hover:text-red-800"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                      {hasPermission('user.manage_user_permissions') && (
                        <button
                          onClick={() => handleManageUserPermissions(user.id, user.username, user.role)}
                          className="text-purple-600 hover:text-purple-800"
                          title="Manage User Permissions"
                        >
                          <Shield className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  );
                default:
                  return null;
              }
            })}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default UserTable; 