import React from 'react';

interface ViewPOTotalsProps {
  subtotal: number;
  tax_amount: number;
  shipping_cost: number;
  total_amount: number;
}

const ViewPOTotals: React.FC<ViewPOTotalsProps> = ({
  subtotal,
  tax_amount,
  shipping_cost,
  total_amount
}) => (
  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Subtotal:</span>
          <span className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Tax:</span>
          <span className="text-sm font-medium text-gray-900">${tax_amount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">Shipping:</span>
          <span className="text-sm font-medium text-gray-900">${shipping_cost.toFixed(2)}</span>
        </div>
      </div>
      <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg">
        <span className="text-lg font-medium text-gray-900">Total:</span>
        <span className="text-xl font-bold text-blue-600">${total_amount.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

export default ViewPOTotals; 