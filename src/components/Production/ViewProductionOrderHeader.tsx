import React from 'react';
import { X, Factory } from 'lucide-react';

interface ViewProductionOrderHeaderProps {
  productionOrder: any;
  onClose: () => void;
}

const ViewProductionOrderHeader: React.FC<ViewProductionOrderHeaderProps> = ({ productionOrder, onClose }) => (
  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
    <div className="flex items-center">
      <Factory className="h-6 w-6 text-blue-600 mr-3" />
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Production Order Details</h2>
        <p className="text-sm text-gray-600">{productionOrder.order_number}</p>
      </div>
    </div>
    <button
      onClick={onClose}
      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <X className="h-5 w-5 text-gray-500" />
    </button>
  </div>
);

export default ViewProductionOrderHeader; 