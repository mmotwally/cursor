import React from 'react';
import { Package } from 'lucide-react';

interface ViewProductionOrderMaterialsTabProps {
  fullOrder: any;
}

const ViewProductionOrderMaterialsTab: React.FC<ViewProductionOrderMaterialsTabProps> = ({ fullOrder }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Required Materials</h3>
    {fullOrder.items && fullOrder.items.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Material</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Qty</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Available</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fullOrder.items.map((item: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                    <div className="text-sm text-gray-500">{item.item_sku}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.component_type === 'bom' ? 'Sub-Assembly' : 'Inventory Item'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.required_quantity} {item.unit_name || 'units'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {item.issued_quantity} {item.unit_name || 'units'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span className={item.available_quantity < (item.required_quantity - item.issued_quantity) ? 'text-red-600' : 'text-green-600'}>
                    {item.available_quantity || 0} {item.unit_name || 'units'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    item.status === 'issued' ? 'bg-green-100 text-green-800' :
                    item.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ${item.total_cost?.toFixed(2) || '0.00'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <Package className="mx-auto h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm text-gray-500">No materials found</p>
      </div>
    )}
    {/* Material Issues History */}
    {fullOrder.issues && fullOrder.issues.length > 0 && (
      <div className="mt-8">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Material Issue History</h4>
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {fullOrder.issues.map((issue: any, index: number) => (
            <div key={index} className="bg-white p-3 rounded border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">{issue.item_name}</span>
                  <span className="text-sm text-gray-600 ml-2">
                    {issue.quantity} units issued
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(issue.issued_date).toLocaleString()}
                </div>
              </div>
              <div className="mt-1 text-sm">
                <span className="text-gray-600">Issued by: </span>
                <span className="text-gray-900">{issue.issued_by_name}</span>
              </div>
              {issue.notes && (
                <div className="mt-1 text-sm text-gray-600">
                  Notes: {issue.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default ViewProductionOrderMaterialsTab; 