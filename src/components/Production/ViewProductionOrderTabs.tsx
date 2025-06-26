import React from 'react';
import { FileText, Package, Play, Clock } from 'lucide-react';

interface ViewProductionOrderTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ViewProductionOrderTabs: React.FC<ViewProductionOrderTabsProps> = ({ activeTab, setActiveTab }) => (
  <div className="border-b border-gray-200">
    <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Tabs">
      <button
        onClick={() => setActiveTab('details')}
        className={`$
          {activeTab === 'details'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
      >
        <FileText className="h-5 w-5 mr-2" />
        Details
      </button>
      <button
        onClick={() => setActiveTab('materials')}
        className={`$
          {activeTab === 'materials'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
      >
        <Package className="h-5 w-5 mr-2" />
        Materials
      </button>
      <button
        onClick={() => setActiveTab('operations')}
        className={`$
          {activeTab === 'operations'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
      >
        <Play className="h-5 w-5 mr-2" />
        Operations
      </button>
      <button
        onClick={() => setActiveTab('history')}
        className={`$
          {activeTab === 'history'
            ? 'border-blue-500 text-blue-600'
            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
          whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center transition-colors`}
      >
        <Clock className="h-5 w-5 mr-2" />
        History
      </button>
    </nav>
  </div>
);

export default ViewProductionOrderTabs; 