import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, User, Calendar, Package, DollarSign, FileText, Building2 } from 'lucide-react';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import ViewPOHeader from './ViewPOHeader';
import ViewPOSupplierInfo from './ViewPOSupplierInfo';
import ViewPOItemsTable from './ViewPOItemsTable';
import ViewPOTotals from './ViewPOTotals';

interface ViewPOModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseOrder: any;
}

const ViewPOModal: React.FC<ViewPOModalProps> = ({ isOpen, onClose, purchaseOrder }) => {
  const [fullPO, setFullPO] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && purchaseOrder) {
      loadFullPO();
    }
  }, [isOpen, purchaseOrder]);

  const loadFullPO = async () => {
    try {
      setLoading(true);
      const data = await purchaseOrderService.getPurchaseOrder(purchaseOrder.id);
      setFullPO(data);
    } catch (error) {
      console.error('Error loading purchase order details:', error);
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
      case 'approved': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'received': return 'bg-purple-100 text-purple-800';
      case 'partially_received': return 'bg-orange-100 text-orange-800';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending_approval': return 'Pending Approval';
      case 'partially_received': return 'Partially Received';
      default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  if (!isOpen || !purchaseOrder) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-6xl flex flex-col">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : fullPO ? (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Fixed Header and Header Information */}
              <ViewPOHeader
                fullPO={fullPO}
                onClose={onClose}
                getPriorityColor={getPriorityColor}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
              />
              {/* Supplier Information */}
              <ViewPOSupplierInfo fullPO={fullPO} />
              {/* Items List */}
              <ViewPOItemsTable items={fullPO.items || []} />
              {/* Totals Section */}
              <ViewPOTotals
                subtotal={fullPO.subtotal || 0}
                tax_amount={fullPO.tax_amount || 0}
                shipping_cost={fullPO.shipping_cost || 0}
                total_amount={fullPO.total_amount || 0}
              />
              {/* Additional Information */}
              {(fullPO.notes || fullPO.payment_terms || fullPO.shipping_address) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {fullPO.payment_terms && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Payment Terms</h4>
                      <p className="text-gray-700">{fullPO.payment_terms}</p>
                    </div>
                  )}
                  
                  {fullPO.shipping_address && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Shipping Address</h4>
                      <p className="text-gray-700">{fullPO.shipping_address}</p>
                    </div>
                  )}
                  
                  {fullPO.notes && (
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                      <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                      <p className="text-gray-700">{fullPO.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Failed to load purchase order details</p>
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

export default ViewPOModal;