import React, { useState, useEffect } from 'react';
import { X, Factory, User, Calendar, Package, DollarSign, FileText, CheckCircle, XCircle, Play, Clock } from 'lucide-react';
import { productionOrderService } from '../../services/productionService';
import ViewProductionOrderHeader from './ViewProductionOrderHeader';
import ViewProductionOrderTabs from './ViewProductionOrderTabs';
import ViewProductionOrderDetailsTab from './ViewProductionOrderDetailsTab';
import ViewProductionOrderMaterialsTab from './ViewProductionOrderMaterialsTab';
import ViewProductionOrderOperationsTab from './ViewProductionOrderOperationsTab';
import ViewProductionOrderHistoryTab from './ViewProductionOrderHistoryTab';

interface ViewProductionOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productionOrder: any;
}

const ViewProductionOrderModal: React.FC<ViewProductionOrderModalProps> = ({ isOpen, onClose, productionOrder }) => {
  const [fullOrder, setFullOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (isOpen && productionOrder) {
      loadFullOrder();
    }
  }, [isOpen, productionOrder]);

  const loadFullOrder = async () => {
    try {
      setLoading(true);
      const data = await productionOrderService.getProductionOrder(productionOrder.id);
      setFullOrder(data);
    } catch (error) {
      console.error('Error loading production order details:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-purple-100 text-purple-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'in_progress': return 'In Progress';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  const getOperationStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'skipped': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOperationStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in_progress': return <Play className="h-4 w-4 text-blue-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'skipped': return <XCircle className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  if (!isOpen || !productionOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-6xl flex flex-col">
        {/* Fixed Header */}
        <ViewProductionOrderHeader productionOrder={productionOrder} onClose={onClose} />
        {/* Tabs */}
        <ViewProductionOrderTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : fullOrder ? (
            <div className="p-4 sm:p-6">
              {activeTab === 'details' && (
                <ViewProductionOrderDetailsTab
                  fullOrder={fullOrder}
                  getPriorityColor={getPriorityColor}
                  getStatusColor={getStatusColor}
                  getStatusText={getStatusText}
                />
              )}
              {activeTab === 'materials' && (
                <ViewProductionOrderMaterialsTab fullOrder={fullOrder} />
              )}
              {activeTab === 'operations' && (
                <ViewProductionOrderOperationsTab
                  fullOrder={fullOrder}
                  getOperationStatusIcon={getOperationStatusIcon}
                  getOperationStatusColor={getOperationStatusColor}
                />
              )}
              {activeTab === 'history' && (
                <ViewProductionOrderHistoryTab fullOrder={fullOrder} />
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Failed to load production order details</p>
            </div>
          )}
        </div>
        {/* Fixed Footer */}
        <div className="flex justify-end p-4 sm:p-6 border-t border-gray-200 flex-shrink-0 bg-white">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProductionOrderModal;