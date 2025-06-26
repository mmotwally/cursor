import React from 'react';
import { Package, Layers, ChevronRight, ChevronDown } from 'lucide-react';

interface ViewBOMComponentsTableProps {
  components: any[];
  expandedSubBoms: Record<string, boolean>;
  toggleSubBom: (componentId: string) => void;
}

const ViewBOMComponentsTable: React.FC<ViewBOMComponentsTableProps> = ({
  components,
  expandedSubBoms,
  toggleSubBom
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Component</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Cost</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waste Factor</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Cost</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {components.map((component: any, index: number) => (
          <React.Fragment key={index}>
            <tr className={`hover:bg-gray-50 ${component.component_type === 'bom' ? 'bg-purple-50' : ''}`}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {component.component_type === 'bom' ? (
                    <button
                      onClick={() => toggleSubBom(`${component.id}`)}
                      className="mr-2 text-purple-600 hover:text-purple-800"
                    >
                      {expandedSubBoms[`${component.id}`] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  ) : null}
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {component.component_type === 'bom'
                        ? component.component_bom_name
                        : component.item_name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {component.component_type === 'bom'
                        ? `v${component.component_bom_version}`
                        : component.item_sku}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {component.component_type === 'bom' ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    <Layers className="h-3 w-3 mr-1" />
                    Sub-Assembly
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Package className="h-3 w-3 mr-1" />
                    Inventory Item
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {component.quantity} {component.unit_name || ''}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${component.unit_cost?.toFixed(2) || '0.00'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {(component.waste_factor * 100).toFixed(1)}%
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${component.total_cost?.toFixed(2) || '0.00'}
              </td>
              <td className="px-6 py-4 text-sm text-gray-900">
                {component.notes || '-'}
              </td>
            </tr>
            {/* Expanded sub-BOM details */}
            {component.component_type === 'bom' && expandedSubBoms[`${component.id}`] && (
              <tr>
                <td colSpan={7} className="px-6 py-4">
                  <div className="bg-purple-50 p-3 rounded-lg border border-purple-100">
                    <div className="text-sm font-medium text-purple-800 mb-2">
                      Sub-Assembly Details: {component.component_bom_name}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Version:</span> {component.component_bom_version}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Base Cost:</span> ${component.component_bom_cost?.toFixed(2) || '0.00'}
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Total Cost with Quantity:</span> ${component.total_cost?.toFixed(2) || '0.00'}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-purple-700">
                      <span className="font-medium">Note:</span> To view full details of this sub-assembly, please open it directly from the BOM list.
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </React.Fragment>
        ))}
      </tbody>
    </table>
  </div>
);

export default ViewBOMComponentsTable; 