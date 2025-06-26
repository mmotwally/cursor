import React from 'react';
import { ShoppingCart, X, FileText, Package } from 'lucide-react';

interface ViewPOHeaderProps {
  fullPO: any;
  onClose: () => void;
  getPriorityColor: (priority: string) => string;
  getStatusColor: (status: string) => string;
  getStatusText: (status: string) => string;
}

const ViewPOHeader: React.FC<ViewPOHeaderProps> = ({
  fullPO,
  onClose,
  getPriorityColor,
  getStatusColor,
  getStatusText
}) => (
  <>
    {/* Fixed Header */}
    <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
      <div className="flex items-center">
        <ShoppingCart className="h-6 w-6 text-blue-600 mr-3" />
        <h2 className="text-xl font-semibold text-gray-900">Purchase Order Details</h2>
      </div>
      <button
        onClick={onClose}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <X className="h-5 w-5 text-gray-500" />
      </button>
    </div>
    {/* Header Information */}
    <div className="p-4 sm:p-6 space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{fullPO.title}</h3>
            <p className="text-gray-600">{fullPO.description}</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(fullPO.priority)}`}>
              {fullPO.priority} priority
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(fullPO.status)}`}>
              {getStatusText(fullPO.status)}
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            PO Number: {fullPO.po_number}
          </div>
          {fullPO.requisition_title && (
            <div className="flex items-center text-sm text-gray-600">
              <Package className="h-4 w-4 mr-2" />
              From Requisition: {fullPO.requisition_title}
            </div>
          )}
        </div>
      </div>
    </div>
  </>
);

export default ViewPOHeader; 