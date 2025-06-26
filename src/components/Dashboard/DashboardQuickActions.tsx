import React from 'react';
import { Package, ClipboardList, ShoppingCart, FileText } from 'lucide-react';

interface DashboardQuickActionsProps {
  onAddItem: () => void;
  onNewRequisition: () => void;
  onCreatePO: () => void;
  onGenerateReport: () => void;
}

const DashboardQuickActions: React.FC<DashboardQuickActionsProps> = ({ onAddItem, onNewRequisition, onCreatePO, onGenerateReport }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <button 
        onClick={onAddItem}
        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
      >
        <Package className="h-6 w-6 text-gray-400 group-hover:text-blue-500 mr-2" />
        <span className="text-gray-600 group-hover:text-blue-600">Add New Item</span>
      </button>
      <button 
        onClick={onNewRequisition}
        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors group"
      >
        <ClipboardList className="h-6 w-6 text-gray-400 group-hover:text-green-500 mr-2" />
        <span className="text-gray-600 group-hover:text-green-600">New Requisition</span>
      </button>
      <button 
        onClick={onCreatePO}
        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-colors group"
      >
        <ShoppingCart className="h-6 w-6 text-gray-400 group-hover:text-purple-500 mr-2" />
        <span className="text-gray-600 group-hover:text-purple-600">Create PO</span>
      </button>
      <button 
        onClick={onGenerateReport}
        className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors group"
      >
        <FileText className="h-6 w-6 text-gray-400 group-hover:text-orange-500 mr-2" />
        <span className="text-gray-600 group-hover:text-orange-600">Generate Report</span>
      </button>
    </div>
  </div>
);

export default DashboardQuickActions; 