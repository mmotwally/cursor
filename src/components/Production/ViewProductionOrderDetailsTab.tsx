import React from 'react';

interface ViewProductionOrderDetailsTabProps {
  fullOrder: any;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ViewProductionOrderDetailsTab: React.FC<ViewProductionOrderDetailsTabProps> = ({ fullOrder, getPriorityColor, getStatusColor, getStatusText }) => (
  <div className="space-y-6">
    {/* Header Information */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{fullOrder.title}</h3>
          <p className="text-gray-600">{fullOrder.description}</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(fullOrder.priority)}`}>
            {fullOrder.priority} priority
          </span>
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fullOrder.status)}`}>
            {getStatusText(fullOrder.status)}
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          BOM: {fullOrder.bom_name} (v{fullOrder.bom_version})
        </div>
        {fullOrder.finished_product_name && (
          <div className="flex items-center text-sm text-gray-600">
            Finished Product: {fullOrder.finished_product_name}
            {fullOrder.finished_product_sku && ` (${fullOrder.finished_product_sku})`}
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="flex items-center text-sm text-gray-600">
          Created by: {fullOrder.created_by_name}
        </div>
        <div className="flex items-center text-sm text-gray-600">
          Created: {new Date(fullOrder.created_at).toLocaleDateString()}
        </div>
        {fullOrder.start_date && (
          <div className="flex items-center text-sm text-gray-600">
            Start Date: {new Date(fullOrder.start_date).toLocaleDateString()}
          </div>
        )}
        {fullOrder.due_date && (
          <div className="flex items-center text-sm text-gray-600">
            Due Date: {new Date(fullOrder.due_date).toLocaleDateString()}
          </div>
        )}
        {fullOrder.completion_date && (
          <div className="flex items-center text-sm text-gray-600">
            Completion Date: {new Date(fullOrder.completion_date).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
    {/* Production Summary */}
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-medium text-gray-900 mb-3">Production Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Quantity to Produce</p>
          <p className="text-lg font-semibold text-gray-900">{fullOrder.quantity}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Materials</p>
          <p className="text-lg font-semibold text-gray-900">{fullOrder.items?.length || 0} items</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Operations</p>
          <p className="text-lg font-semibold text-gray-900">{fullOrder.operations?.length || 0} steps</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Planned Cost</p>
          <p className="text-lg font-semibold text-gray-900">${fullOrder.planned_cost?.toFixed(2) || '0.00'}</p>
        </div>
      </div>
    </div>
    {/* Notes */}
    {fullOrder.notes && (
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
        <p className="text-gray-700">{fullOrder.notes}</p>
      </div>
    )}
  </div>
);

export default ViewProductionOrderDetailsTab; 