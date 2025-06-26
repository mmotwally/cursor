import React from 'react';

interface ViewProductionOrderOperationsTabProps {
  fullOrder: any;
  getOperationStatusIcon: (status: string) => React.ReactNode;
  getOperationStatusColor: (status: string) => string;
}

const ViewProductionOrderOperationsTab: React.FC<ViewProductionOrderOperationsTabProps> = ({ fullOrder, getOperationStatusIcon, getOperationStatusColor }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Manufacturing Operations</h3>
    {fullOrder.operations && fullOrder.operations.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sequence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estimated Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Machine/Equipment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fullOrder.operations.map((operation: any, index: number) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operation.sequence_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{operation.operation_name}</div>
                    <div className="text-sm text-gray-500">{operation.description}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {getOperationStatusIcon(operation.status)}
                    <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getOperationStatusColor(operation.status)}`}>
                      {operation.status.charAt(0).toUpperCase() + operation.status.slice(1)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operation.estimated_time_minutes} min</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operation.actual_time_minutes ? `${operation.actual_time_minutes} min` : '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operation.machine_required || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{operation.assigned_to_name || 'Unassigned'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <span className="mx-auto h-8 w-8 text-gray-400">No operations found</span>
      </div>
    )}
  </div>
);

export default ViewProductionOrderOperationsTab; 