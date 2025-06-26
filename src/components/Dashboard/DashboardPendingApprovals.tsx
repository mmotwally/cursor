import React from 'react';
import { Eye } from 'lucide-react';

interface DashboardPendingApprovalsProps {
  stats: {
    pendingRequisitions: number;
    pendingPOs: number;
  };
  recentRequisitions: any[];
  recentPOs: any[];
  navigateToRequisitions: () => void;
  navigateToPurchaseOrders: () => void;
  onViewRequisition: (id: string) => void;
  onViewPurchaseOrder: (id: string) => void;
}

const DashboardPendingApprovals: React.FC<DashboardPendingApprovalsProps> = ({
  stats,
  recentRequisitions,
  recentPOs,
  navigateToRequisitions,
  navigateToPurchaseOrders,
  onViewRequisition,
  onViewPurchaseOrder
}) => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Pending Requisitions</h3>
        <div className="flex items-center">
          <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {stats.pendingRequisitions} pending
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {recentRequisitions.length > 0 ? (
          recentRequisitions.map((req: any) => (
            <div key={req.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{req.title || 'Untitled'}</p>
                <p className="text-sm text-gray-500">By: {req.requester_name}</p>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  req.status === 'approved' ? 'bg-green-100 text-green-800' :
                  req.status === 'rejected' ? 'bg-red-100 text-red-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {req.status}
                </span>
                <button 
                  onClick={() => onViewRequisition(req.id)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No pending requisitions</p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={navigateToRequisitions}
          className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All Requisitions
        </button>
      </div>
    </div>
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Purchase Orders</h3>
        <div className="flex items-center">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {stats.pendingPOs} pending approval
          </span>
        </div>
      </div>
      <div className="space-y-3">
        {recentPOs.length > 0 ? (
          recentPOs.map((po: any) => (
            <div key={po.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{po.po_number}</p>
                <p className="text-sm text-gray-500">Supplier: {po.supplier_name}</p>
              </div>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  po.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                  po.status === 'pending_approval' ? 'bg-yellow-100 text-yellow-800' :
                  po.status === 'approved' ? 'bg-green-100 text-green-800' :
                  po.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                  po.status === 'received' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {po.status === 'pending_approval' ? 'Pending Approval' : 
                   po.status.charAt(0).toUpperCase() + po.status.slice(1)}
                </span>
                <button 
                  onClick={() => onViewPurchaseOrder(po.id)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No recent purchase orders</p>
        )}
      </div>
      <div className="mt-4">
        <button
          onClick={navigateToPurchaseOrders}
          className="w-full text-center text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          View All Purchase Orders
        </button>
      </div>
    </div>
  </div>
);

export default DashboardPendingApprovals; 