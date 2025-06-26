import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit, Trash2, Shield, User, RefreshCw, Columns, Settings } from 'lucide-react';
import { userService } from '../../services/userService';
import { useAuth } from '../../contexts/AuthContext';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import PermissionManager from './PermissionManager';
import UserPermissionsModal from './UserPermissionsModal';
import ColumnCustomizerModal, { Column } from '../Common/ColumnCustomizer';
import { useColumnPreferences } from '../../hooks/useColumnPreferences';
import UserStatsCards from './UserStatsCards';
import UserTable from './UserTable';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'user', label: 'User', visible: true, width: 200, order: 1 },
  { id: 'role', label: 'Role', visible: true, width: 120, order: 2 },
  { id: 'created', label: 'Created', visible: true, width: 150, order: 3 },
  { id: 'updated', label: 'Last Updated', visible: true, width: 150, order: 4 },
  { id: 'actions', label: 'Actions', visible: true, width: 150, order: 5 }
];

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const [showUserPermissionsModal, setShowUserPermissionsModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [selectedUser, setSelectedUser] = useState<{id: number, username: string, role: string} | null>(null);
  const { user: currentUser, hasPermission } = useAuth();

  const { 
    columns, 
    visibleColumns, 
    showColumnCustomizer, 
    setShowColumnCustomizer, 
    handleSaveColumnPreferences 
  } = useColumnPreferences('user_management_columns', DEFAULT_COLUMNS);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const fetchedUsers = await userService.getUsers();
      setUsers(fetchedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id: number, username: string) => {
    if (currentUser?.id === id) {
      alert('You cannot delete your own account');
      return;
    }

    if (confirm(`Are you sure you want to delete user "${username}"?`)) {
      try {
        await userService.deleteUser(id);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete user');
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditModal(true);
  };

  const handleManagePermissions = () => {
    setShowPermissionModal(true);
  };

  const handleManageUserPermissions = (userId: number, username: string, role: string) => {
    setSelectedUser({ id: parseInt(userId.toString()), username, role });
    setShowUserPermissionsModal(true);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-red-500" />;
      case 'manager':
        return <Users className="h-4 w-4 text-blue-500" />;
      default:
        return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const adminCount = users.filter(u => u.role === 'admin').length;
  const managerCount = users.filter(u => u.role === 'manager').length;
  const userCount = users.filter(u => u.role === 'user').length;
  const customRolesCount = users.filter(u => !['admin', 'manager', 'user'].includes(u.role)).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their permissions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowColumnCustomizer(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Columns className="h-4 w-4 mr-2" />
            Columns
          </button>
          <button
            onClick={fetchUsers}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          {hasPermission('user.manage_permissions') && (
            <button
              onClick={handleManagePermissions}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Shield className="h-4 w-4 mr-2" />
              Manage Roles & Permissions
            </button>
          )}
          {hasPermission('user.create') && (
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <UserStatsCards
        users={users}
        adminCount={adminCount}
        managerCount={managerCount}
        userCount={userCount}
        customRolesCount={customRolesCount}
      />

      {/* Users Table */}
      <UserTable
        users={users}
        visibleColumns={visibleColumns}
        getRoleIcon={getRoleIcon}
        getRoleBadgeColor={getRoleBadgeColor}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        handleManageUserPermissions={handleManageUserPermissions}
        hasPermission={hasPermission}
      />

      {/* Modals */}
      {hasPermission('user.create') && (
        <AddUserModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onUserAdded={fetchUsers}
        />
      )}

      {hasPermission('user.edit') && (
        <EditUserModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setEditingUser(null);
          }}
          onUserUpdated={fetchUsers}
          user={editingUser}
          onManagePermissions={handleManageUserPermissions}
        />
      )}

      {hasPermission('user.manage_permissions') && (
        <PermissionManager
          isOpen={showPermissionModal}
          onClose={() => setShowPermissionModal(false)}
          onSuccess={fetchUsers}
        />
      )}

      {hasPermission('user.manage_permissions') && selectedUser && (
        <UserPermissionsModal
          isOpen={showUserPermissionsModal}
          onClose={() => {
            setShowUserPermissionsModal(false);
            setSelectedUser(null);
          }}
          onSuccess={fetchUsers}
          userId={selectedUser.id}
          username={selectedUser.username}
          userRole={selectedUser.role}
        />
      )}

      <ColumnCustomizerModal
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        onSave={handleSaveColumnPreferences}
        columns={columns}
        title="Customize User Management Columns"
      />
    </div>
  );
};

export default UserManagement;