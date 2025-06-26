import React from 'react';

interface ViewBOMCostSummaryProps {
  unit_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_cost: number;
}

const ViewBOMCostSummary: React.FC<ViewBOMCostSummaryProps> = ({
  unit_cost,
  labor_cost,
  overhead_cost,
  total_cost
}) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-3">Cost Summary</h4>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-blue-50 p-3 rounded-lg">
        <div className="text-sm text-blue-800 font-medium">Material Cost</div>
        <div className="text-lg font-bold text-blue-900">${unit_cost.toFixed(2)}</div>
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <div className="text-sm text-green-800 font-medium">Labor Cost</div>
        <div className="text-lg font-bold text-green-900">${labor_cost.toFixed(2)}</div>
      </div>
      <div className="bg-yellow-50 p-3 rounded-lg">
        <div className="text-sm text-yellow-800 font-medium">Overhead Cost</div>
        <div className="text-lg font-bold text-yellow-900">${overhead_cost.toFixed(2)}</div>
      </div>
      <div className="bg-purple-50 p-3 rounded-lg">
        <div className="text-sm text-purple-800 font-medium">Total Cost</div>
        <div className="text-lg font-bold text-purple-900">${total_cost.toFixed(2)}</div>
      </div>
    </div>
  </div>
);

export default ViewBOMCostSummary; 