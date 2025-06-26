import React, { useState, useEffect } from 'react';
import { X, Save, Shield, Search, Check, RefreshCw, Plus, Trash2, Columns } from 'lucide-react';
import { userService } from '../../services/userService';
import RoleManagementSection from './RoleManagementSection';
import PermissionsTable from './PermissionsTable';
import PermissionColumnSelector from './PermissionColumnSelector';

interface PermissionManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface Permission {
  id: number;
  name: string;
  description: string;
}

interface RolePermissions {
  role: string;
  permissions: string[];
}

interface ColumnVisibility {
  id: string;
  label: string;
  visible: boolean;
}

const PermissionManager: React.FC<PermissionManagerProps> = ({ isOpen, onClose, onSuccess }) => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermissions[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [newRoleName, setNewRoleName] = useState('');
  const [showAddRole, setShowAddRole] = useState(false);
  const [addRoleError, setAddRoleError] = useState('');
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility[]>([
    { id: 'permission', label: 'Permission', visible: true },
    { id: 'description', label: 'Description', visible: true }
  ]);

  useEffect(() => {
    if (isOpen) {
      loadPermissions();
      loadRolePermissions();
    }
  }, [isOpen]);

  // Update column visibility when roles change
  useEffect(() => {
    // Keep permission and description columns
    const baseColumns: ColumnVisibility[] = [
      { id: 'permission', label: 'Permission', visible: true },
      { id: 'description', label: 'Description', visible: true }
    ];
    
    // Add role columns
    const roleColumns = rolePermissions.map(rp => ({
      id: rp.role,
      label: rp.role.charAt(0).toUpperCase() + rp.role.slice(1),
      visible: true
    }));
    
    // Merge with existing visibility settings
    const newColumnVisibility = [...baseColumns, ...roleColumns].map(newCol => {
      const existingCol = columnVisibility.find(col => col.id === newCol.id);
      return existingCol ? { ...newCol, visible: existingCol.visible } : newCol;
    });
    
    setColumnVisibility(newColumnVisibility);
  }, [rolePermissions]);

  const loadPermissions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getPermissions();
      setPermissions(data);
    } catch (error) {
      console.error('Error loading permissions:', error);
      setError('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const loadRolePermissions = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await userService.getRolePermissions();
      console.log('Loaded role permissions:', data);
      setRolePermissions(data);
    } catch (error) {
      console.error('Error loading role permissions:', error);
      setError('Failed to load role permissions');
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionToggle = (role: string, permissionName: string) => {
    setRolePermissions(prev => 
      prev.map(rp => {
        if (rp.role === role) {
          const hasPermission = rp.permissions.includes(permissionName);
          return {
            ...rp,
            permissions: hasPermission
              ? rp.permissions.filter(p => p !== permissionName)
              : [...rp.permissions, permissionName]
          };
        }
        return rp;
      })
    );
  };

  const handleSavePermissions = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await userService.updateRolePermissions(rolePermissions);
      
      setSuccess('Permissions updated successfully');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error saving permissions:', error);
      setError(error instanceof Error ? error.message : 'Failed to save permissions');
    } finally {
      setSaving(false);
    }
  };

  const handleAddRole = async () => {
    try {
      setAddRoleError('');
      
      if (!newRoleName.trim()) {
        setAddRoleError('Role name is required');
        return;
      }
      
      // Check if role already exists
      if (rolePermissions.some(rp => rp.role.toLowerCase() === newRoleName.toLowerCase())) {
        setAddRoleError('Role already exists');
        return;
      }
      
      // Create new role
      await userService.createRole(newRoleName);
      
      // Reload role permissions to ensure we have the latest data
      await loadRolePermissions();
      
      // Reset form
      setNewRoleName('');
      setShowAddRole(false);
      
      // Show success message
      setSuccess(`Role "${newRoleName}" created successfully`);
    } catch (error) {
      console.error('Error adding role:', error);
      setAddRoleError(error instanceof Error ? error.message : 'Failed to add role');
    }
  };

  const handleDeleteRole = async (role: string) => {
    try {
      // Don't allow deleting built-in roles
      if (['admin', 'manager', 'user'].includes(role)) {
        setError('Cannot delete built-in roles');
        return;
      }
      
      if (!confirm(`Are you sure you want to delete the role "${role}"?`)) {
        return;
      }
      
      await userService.deleteRole(role);
      
      // Remove role from local state
      setRolePermissions(prev => prev.filter(rp => rp.role !== role));
      
      // Show success message
      setSuccess(`Role "${role}" deleted successfully`);
    } catch (error) {
      console.error('Error deleting role:', error);
      setError(error instanceof Error ? error.message : 'Failed to delete role');
    }
  };

  const toggleColumnVisibility = (columnId: string) => {
    setColumnVisibility(prev => 
      prev.map(col => col.id === columnId ? { ...col, visible: !col.visible } : col)
    );
  };

  // Get unique permission categories (first part of the permission name before the dot)
  const permissionCategories = Array.from(
    new Set(permissions.map(p => p.name.split('.')[0]))
  ).sort();

  // Filter permissions based on search and category
  const filteredPermissions = permissions.filter(permission => {
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
  }, {} as Record<string, Permission[]>);

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
            <h2 className="text-xl font-semibold text-gray-900">Permission Manager</h2>
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
                onClick={() => {
                  loadPermissions();
                  loadRolePermissions();
                }}
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
        </div>

        {/* Role Management Section */}
        <RoleManagementSection
          rolePermissions={rolePermissions}
          showAddRole={showAddRole}
          setShowAddRole={setShowAddRole}
          newRoleName={newRoleName}
          setNewRoleName={setNewRoleName}
          addRoleError={addRoleError}
          handleAddRole={handleAddRole}
          handleDeleteRole={handleDeleteRole}
        />

        {/* Permissions Table */}
        <PermissionsTable
          permissions={permissions}
          rolePermissions={rolePermissions}
          columnVisibility={columnVisibility}
          handlePermissionToggle={handlePermissionToggle}
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
        />

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

        {/* Column Visibility Selector */}
        <PermissionColumnSelector
          columnVisibility={columnVisibility}
          toggleColumnVisibility={toggleColumnVisibility}
          showColumnSelector={showColumnSelector}
          setShowColumnSelector={setShowColumnSelector}
        />
      </div>
    </div>
  );
};

export default PermissionManager;