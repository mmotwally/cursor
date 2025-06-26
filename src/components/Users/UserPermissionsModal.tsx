import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Search, Check, RefreshCw, AlertTriangle, Columns } from 'lucide-react';
import { userService } from '../../services/userService';
import UserPermissionColumnSelector from './UserPermissionColumnSelector';
import UserPermissionsTable from './UserPermissionsTable';

interface UserPermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  userId: number;
  username: string;
  userRole: string;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface UserPermission {
  id: number;
  name: string;
  description: string;
  grant_type: 'allow' | 'deny' | 'inherit';
}

interface ColumnVisibility {
  id: string;
  label: string;
  visible: boolean;
}

const UserPermissionsModal: React.FC<UserPermissionsModalProps> = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  userId,
  username,
  userRole
}) => {
  const [allPermissions, setAllPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [userPermissions, setUserPermissions] = useState<UserPermission[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>([
    { id: 'permission', label: 'Permission', visible: true },
    { id: 'description', label: 'Description', visible: true },
    { id: 'role_setting', label: 'Role Setting', visible: true },
    { id: 'user_setting', label: 'User Setting', visible: true }
  ]);

  useEffect(() => {
    if (isOpen && userId) {
      loadData();
    }
  }, [isOpen, userId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load all permissions
      const permissions = await userService.getPermissions();
      setAllPermissions(permissions);
      
      // Load role permissions
      const rolePerms = await userService.getUserPermissions(userId);
      setRolePermissions(rolePerms);
      
      // Load user-specific permissions
      let userPerms = [];
      try {
        userPerms = await userService.getUserSpecificPermissions(userId);
      } catch (error) {
        console.warn('Could not load user-specific permissions, likely a new role:', error);
        // For new roles without users, we'll just use an empty array
        userPerms = [];
      }
      
      // Create a merged list of all permissions with their grant type
      const mergedPermissions = permissions.map(permission => {
        const userPerm = userPerms.find(up => up.id === permission.id);
        
        return {
          ...permission,
          grant_type: userPerm ? userPerm.grant_type : 'inherit'
        };
      });
      
      setUserPermissions(mergedPermissions);
    } catch (error) {
      console.error('Error loading permissions data:', error);
      setError('Failed to load permissions data');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionChange = (permissionId: number, grantType: 'allow' | 'deny' | 'inherit') => {
    setUserPermissions(prev => 
      prev.map(p => {
        if (p.id === permissionId) {
          return { ...p, grant_type: grantType };
        }
        return p;
      })
    );
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      // Validate userId before making the API call
      if (typeof userId !== 'number' || isNaN(userId) || userId <= 0) {
        setError('Invalid user ID. Please close and reopen this dialog.');
        setSaving(false);
        return;
      }
      
      // Filter out permissions that are set to 'inherit'
      const specificPermissions = userPermissions
        .filter(p => p.grant_type !== 'inherit')
        .map(p => ({
          permission_id: p.id,
          grant_type: p.grant_type
        }));
      
      console.log('Saving permissions for user ID:', userId);
      console.log('Permissions data:', specificPermissions);
      
      await userService.updateUserSpecificPermissions(userId, specificPermissions);
      
      setSuccess('User permissions updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving user permissions:', error);
      setError(error instanceof Error ? error.message : 'Failed to save user permissions');
    } finally {
      setSaving(false);
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => 
      prev.map(col => col.id === columnId ? { ...col, visible: !col.visible } : col)
    );
  };

  // Get unique permission categories (first part of the permission name before the dot)
  const permissionCategories = Array.from(
    new Set(allPermissions.map(p => p.name.split('.')[0]))
  ).sort();

  // Filter permissions based on search and category
  const filteredPermissions = userPermissions.filter(permission => {
    const matchesSearch = searchTerm === '' || 
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      permission.name.startsWith(`${selectedCategory}.`);
    
    return matchesSearch && matchesCategory;
  });

  // Group permissions by category for display
  const groupedPermissions = filteredPermissions.reduce((groups, permission) => {
    const category = permission.name.split('.')[0];
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(permission);
    return groups;
  }, {} as Record<string, UserPermission[]>);

  // Get visible columns
  const visibleColumns = columnVisibility.filter(col => col.visible);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-6xl flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <Shield className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">User Permissions</h2>
              <p className="text-sm text-gray-600">
                {username} <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">{userRole}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search permissions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                {permissionCategories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowColumnSelector(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Columns className="h-4 w-4 mr-2" />
                Columns
              </button>
              <button
                onClick={loadData}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={handleSavePermissions}
                disabled={saving}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
          <UserPermissionColumnSelector
            columnVisibility={columnVisibility}
            toggleColumnVisibility={toggleColumnVisibility}
            showColumnSelector={showColumnSelector}
            setShowColumnSelector={setShowColumnSelector}
          />
          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}
          <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
              <div className="text-sm text-blue-700">
                <p className="font-medium">User-Specific Permission Settings:</p>
                <ul className="list-disc list-inside mt-1">
                  <li><strong>Inherit from Role:</strong> Use the permission setting from the user's role</li>
                  <li><strong>Allow:</strong> Grant this permission to the user, even if their role doesn't have it</li>
                  <li><strong>Deny:</strong> Remove this permission from the user, even if their role has it</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <UserPermissionsTable
            groupedPermissions={groupedPermissions}
            visibleColumns={visibleColumns}
            handlePermissionChange={handlePermissionChange}
            rolePermissions={rolePermissions}
            loading={loading}
          />
        </div>

        {/* Fixed Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white">
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={handleSavePermissions}
              disabled={saving}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserPermissionsModal;