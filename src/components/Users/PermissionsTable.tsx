import React from 'react';
import { Check } from 'lucide-react';

interface PermissionsTableProps {
  permissions: any[];
  rolePermissions: any[];
  columnVisibility: any[];
  handlePermissionToggle: (role: string, permissionName: string) => void;
  searchTerm: string;
  selectedCategory: string;
}

const PermissionsTable: React.FC<PermissionsTableProps> = ({
  permissions,
  rolePermissions,
  columnVisibility,
  handlePermissionToggle,
  searchTerm,
  selectedCategory
}) => {
  // Filter permissions by search and category
  const filteredPermissions = permissions.filter((perm: any) => {
    const matchesSearch = perm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perm.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || perm.name.startsWith(selectedCategory + '.');
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow-sm border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columnVisibility.filter(col => col.visible).map((col: any) => (
              <th
                key={col.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredPermissions.map((perm: any) => (
            <tr key={perm.id} className="hover:bg-gray-50">
              {columnVisibility.filter(col => col.visible).map((col: any) => {
                if (col.id === 'permission') {
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {perm.name}
                    </td>
                  );
                } else if (col.id === 'description') {
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap text-gray-600">
                      {perm.description}
                    </td>
                  );
                } else {
                  // Role columns
                  const rolePerm = rolePermissions.find((rp: any) => rp.role === col.id);
                  const hasPerm = rolePerm && rolePerm.permissions.includes(perm.name);
                  return (
                    <td key={col.id} className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        type="button"
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full border transition-colors ${hasPerm ? 'bg-blue-600 border-blue-600' : 'bg-white border-gray-300'}`}
                        onClick={() => handlePermissionToggle(col.id, perm.name)}
                        aria-label={`Toggle ${col.label} permission`}
                      >
                        {hasPerm && <Check className="h-4 w-4 text-white" />}
                      </button>
                    </td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PermissionsTable; 