import React from 'react';
import { PenTool as Tool } from 'lucide-react';

interface ViewBOMOperationsTableProps {
  operations: any[];
  getSkillLevelBadge: (level: string) => React.ReactNode;
}

const ViewBOMOperationsTable: React.FC<ViewBOMOperationsTableProps> = ({
  operations,
  getSkillLevelBadge
}) => (
  <div className="overflow-x-auto">
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sequence</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time (min)</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Labor Rate</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine/Equipment</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skill Level</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {operations.map((operation: any, index: number) => (
          <tr key={index} className="hover:bg-gray-50">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {operation.sequence_number || index + 1}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div>
                <div className="text-sm font-medium text-gray-900">{operation.operation_name}</div>
                <div className="text-xs text-gray-500">{operation.description}</div>
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {operation.estimated_time_minutes}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${operation.labor_rate?.toFixed(2) || '0.00'}/hr
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              {operation.machine_required || '-'}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              {getSkillLevelBadge(operation.skill_level)}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              ${((operation.estimated_time_minutes / 60) * operation.labor_rate).toFixed(2)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ViewBOMOperationsTable; 