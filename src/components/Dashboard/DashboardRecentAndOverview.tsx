import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface DashboardRecentAndOverviewProps {
  recentItems: any[];
  isWidgetVisible: (widgetId: string) => boolean;
  navigateToInventory: () => void;
  navigateToReports: () => void;
}

const DashboardRecentAndOverview: React.FC<DashboardRecentAndOverviewProps> = ({
  recentItems,
  isWidgetVisible,
  navigateToInventory,
  navigateToReports
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    {isWidgetVisible('recent_items') && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Items</h3>
          <TrendingUp className="h-5 w-5 text-gray-400" />
        </div>
        <div className="space-y-3">
          {Array.isArray(recentItems) && recentItems.map((item: any, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{item.name || 'Unknown Item'}</p>
                <p className="text-sm text-gray-500">SKU: {item.sku || 'N/A'}</p>
              </div>
              <div className="text-right">
                <p className="font-medium text-gray-900">{item.quantity || 0}</p>
                <p className="text-sm text-gray-500">{item.unit_name || 'units'}</p>
              </div>
            </div>
          ))}
          {(!Array.isArray(recentItems) || recentItems.length === 0) && (
            <p className="text-gray-500 text-center py-4">No recent items</p>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={navigateToInventory}
            className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All Inventory
          </button>
        </div>
      </div>
    )}
    {isWidgetVisible('inventory_overview') && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Inventory Overview</h3>
          <BarChart3 className="h-5 w-5 text-gray-400" />
        </div>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p className="mt-1 text-sm text-gray-500">
              Chart visualization coming soon
            </p>
            <button
              onClick={navigateToReports}
              className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View Reports & Analytics
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
);

export default DashboardRecentAndOverview; 