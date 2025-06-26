import React from 'react';

interface BOMSummarySectionProps {
  materialCost: number;
  laborCost: number;
  overheadCost: number;
  totalCost: number;
}

const BOMSummarySection: React.FC<BOMSummarySectionProps> = ({
  materialCost,
  laborCost,
  overheadCost,
  totalCost
}) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h3 className="text-lg font-medium text-gray-900 mb-4">Cost Summary</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Material Cost
        </label>
        <div className="px-3 py-2 bg-blue-50 rounded-lg text-sm font-medium text-blue-800">
          ${materialCost.toFixed(2)}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Labor Cost
        </label>
        <div className="px-3 py-2 bg-green-50 rounded-lg text-sm font-medium text-green-800">
          ${laborCost.toFixed(2)}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Overhead Cost
        </label>
        <div className="px-3 py-2 bg-yellow-50 rounded-lg text-sm font-medium text-yellow-800">
          ${overheadCost.toFixed(2)}
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Total Cost
        </label>
        <div className="px-3 py-2 bg-purple-50 rounded-lg text-sm font-medium text-purple-800">
          ${totalCost.toFixed(2)}
        </div>
      </div>
    </div>
  </div>
);

export default BOMSummarySection; 