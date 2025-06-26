import React from 'react';

interface ViewPOItemsTableProps {
  items: any[];
}

const ViewPOItemsTable: React.FC<ViewPOItemsTableProps> = ({ items }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Received</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {items.map((item: any, index: number) => (
          <tr key={index}>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.item_name}</div>
                <div className="text-sm text-gray-500">{item.item_description}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.sku || item.inventory_sku || 'N/A'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.quantity} {item.unit_name || 'units'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${item.unit_price?.toFixed(2) || '0.00'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${item.total_price?.toFixed(2) || '0.00'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {item.received_quantity || 0} {item.unit_name || 'units'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ViewPOItemsTable; 