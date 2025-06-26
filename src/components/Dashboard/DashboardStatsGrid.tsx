import React from 'react';
import { Package, DollarSign, AlertTriangle, Activity } from 'lucide-react';

interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  recentActivity: number;
  pendingRequisitions: number;
  pendingPOs: number;
}

interface DashboardStatsGridProps {
  stats: DashboardStats;
  isWidgetVisible: (widgetId: string) => boolean;
}

const DashboardStatsGrid: React.FC<DashboardStatsGridProps> = ({ stats, isWidgetVisible }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {isWidgetVisible('total_items') && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            <p className="text-sm text-green-600 mt-1">+12% from last month</p>
          </div>
          <div className="bg-blue-500 p-3 rounded-lg">
            <Package className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    )}
    {isWidgetVisible('in_stock') && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Value</p>
            <p className="text-2xl font-bold text-gray-900">${stats.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-green-600 mt-1">+8% from last month</p>
          </div>
          <div className="bg-green-500 p-3 rounded-lg">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    )}
    {isWidgetVisible('low_stock') && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
            <p className="text-2xl font-bold text-gray-900">{stats.lowStockItems}</p>
            <p className="text-sm text-red-600 mt-1">+5% from last month</p>
          </div>
          <div className="bg-red-500 p-3 rounded-lg">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    )}
    {isWidgetVisible('out_of_stock') && (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Recent Activity</p>
            <p className="text-2xl font-bold text-gray-900">{stats.recentActivity}</p>
            <p className="text-sm text-green-600 mt-1">+15% from last month</p>
          </div>
          <div className="bg-purple-500 p-3 rounded-lg">
            <Activity className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    )}
  </div>
);

export default DashboardStatsGrid; 