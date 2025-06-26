import React from 'react';
import { FileText, Edit, Trash2, Package, PenTool as Tool, DollarSign } from 'lucide-react';

interface BOMsTableProps {
  boms: any[];
  visibleColumns: any[];
  handleView: (bom: any) => void;
  handleEdit: (bom: any) => void;
  handleDelete: (id: number, name: string) => void;
  pagination: any;
  setPagination: (pagination: any) => void;
  loading: boolean;
  searchTerm: string;
  statusFilter: string;
  getStatusBadge: (status: string) => React.ReactNode;
  handleAdd: () => void;
}

const BOMsTable: React.FC<BOMsTableProps> = ({
  boms,
  visibleColumns,
  handleView,
  handleEdit,
  handleDelete,
  pagination,
  setPagination,
  loading,
  searchTerm,
  statusFilter,
  getStatusBadge,
  handleAdd
}) => (
  <div className="bg-white rounded-lg border overflow-hidden">
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {visibleColumns.map((column: any) => (
              <th
                key={column.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                style={{ width: `${column.width}px`, minWidth: `${column.width}px` }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {boms.map((bom: any) => (
            <tr key={bom.id} className="hover:bg-gray-50">
              {visibleColumns.map((column: any) => {
                switch (column.id) {
                  case 'bom':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-blue-500 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{bom.name}</div>
                            <div className="text-xs text-gray-500">v{bom.version}</div>
                          </div>
                        </div>
                      </td>
                    );
                  case 'finished_product':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        {bom.finished_product_name ? (
                          <div className="text-sm text-gray-900">
                            {bom.finished_product_name}
                            {bom.finished_product_sku && (
                              <span className="text-xs text-gray-500 ml-1">({bom.finished_product_sku})</span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Not specified</span>
                        )}
                      </td>
                    );
                  case 'status':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(bom.status)}
                      </td>
                    );
                  case 'components':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Package className="h-4 w-4 text-gray-400 mr-2" />
                          {bom.component_count || 0}
                        </div>
                      </td>
                    );
                  case 'operations':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Tool className="h-4 w-4 text-gray-400 mr-2" />
                          {bom.operation_count || 0}
                        </div>
                      </td>
                    );
                  case 'total_cost':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                          {bom.total_cost ? bom.total_cost.toFixed(2) : '0.00'}
                        </div>
                      </td>
                    );
                  case 'created_by':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bom.created_by_name || 'Unknown'}
                      </td>
                    );
                  case 'actions':
                    return (
                      <td key={column.id} className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleView(bom)}
                            className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50 transition-colors"
                            title="View BOM Details"
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(bom)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Edit BOM"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(bom.id, bom.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                            title="Delete BOM"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    );
                  default:
                    return <td key={column.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">-</td>;
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    {boms.length === 0 && (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No BOMs found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm || statusFilter !== 'all'
            ? 'Try adjusting your search or filter criteria.'
            : 'Get started by creating your first Bill of Materials.'}
        </p>
        <button
          onClick={handleAdd}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-4 h-4 mr-2" />
          Create First BOM
        </button>
      </div>
    )}
    {/* Pagination */}
    {pagination.pages > 1 && (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setPagination((prev: any) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setPagination((prev: any) => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.pages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{((pagination.page - 1) * pagination.limit) + 1}</span> to{' '}
              <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span>{' '}
              of <span className="font-medium">{pagination.total}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setPagination((prev: any) => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                disabled={pagination.page === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination((prev: any) => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                disabled={pagination.page === pagination.pages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default BOMsTable; 