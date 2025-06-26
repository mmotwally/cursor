import React from 'react';
import { Plus, Trash2, PenTool as Tool } from 'lucide-react';

interface BOMOperationsSectionProps {
  operations: any[];
  addOperation: () => void;
  removeOperation: (index: number) => void;
  handleOperationChange: (index: number, field: string, value: any) => void;
}

const BOMOperationsSection: React.FC<BOMOperationsSectionProps> = ({
  operations,
  addOperation,
  removeOperation,
  handleOperationChange
}) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">Manufacturing Operations</h3>
      <button
        type="button"
        onClick={addOperation}
        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Operation
      </button>
    </div>
    <div className="space-y-4">
      {operations.map((operation, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <Tool className="h-5 w-5 text-purple-500 mr-2" />
              <span className="font-medium text-gray-900">Operation {index + 1}</span>
            </div>
            {operations.length > 1 && (
              <button
                type="button"
                onClick={() => removeOperation(index)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation Name *
              </label>
              <input
                type="text"
                value={operation.operation_name}
                onChange={(e) => handleOperationChange(index, 'operation_name', e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Cut, Drill, Sand, Assemble"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                value={operation.description}
                onChange={(e) => handleOperationChange(index, 'description', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the operation"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time (minutes)
              </label>
              <input
                type="number"
                value={operation.estimated_time_minutes}
                onChange={(e) => handleOperationChange(index, 'estimated_time_minutes', e.target.value)}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Labor Rate ($/hr)
              </label>
              <input
                type="number"
                value={operation.labor_rate}
                onChange={(e) => handleOperationChange(index, 'labor_rate', e.target.value)}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Machine/Equipment
              </label>
              <input
                type="text"
                value={operation.machine_required}
                onChange={(e) => handleOperationChange(index, 'machine_required', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Table Saw, CNC Router"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Skill Level
              </label>
              <select
                value={operation.skill_level}
                onChange={(e) => handleOperationChange(index, 'skill_level', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="basic">Basic</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <input
              type="text"
              value={operation.notes}
              onChange={(e) => handleOperationChange(index, 'notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional notes for this operation"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BOMOperationsSection; 