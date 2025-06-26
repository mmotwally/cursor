import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign,
  BarChart3,
  Users,
  Activity,
  Plus,
  FileText,
  UserPlus,
  ShoppingCart,
  Truck,
  ClipboardList,
  Eye,
  Settings
} from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { requisitionService } from '../../services/requisitionService';
import { purchaseOrderService } from '../../services/purchaseOrderService';
import { useSocket } from '../../contexts/SocketContext';
import { useNavigate, useLocation } from 'react-router-dom';
import ReportGeneratorModal from './ReportGeneratorModal';
import UserDashboardSettings from './UserDashboardSettings';
import DashboardQuickActions from './DashboardQuickActions';
import DashboardStatsGrid from './DashboardStatsGrid';
import DashboardPendingApprovals from './DashboardPendingApprovals';
import DashboardRecentAndOverview from './DashboardRecentAndOverview';

interface DashboardStats {
  totalItems: number;
  totalValue: number;
  lowStockItems: number;
  recentActivity: number;
  pendingRequisitions: number;
  pendingPOs: number;
}

interface DashboardWidget {
  id: string;
  title: string;
  visible: boolean;
  order: number;
}

const DEFAULT_WIDGETS: DashboardWidget[] = [
  { id: 'total_items', title: 'Total Items', visible: true, order: 1 },
  { id: 'in_stock', title: 'In Stock', visible: true, order: 2 },
  { id: 'low_stock', title: 'Low Stock', visible: true, order: 3 },
  { id: 'out_of_stock', title: 'Out of Stock', visible: true, order: 4 },
  { id: 'pending_requisitions', title: 'Pending Requisitions', visible: true, order: 5 },
  { id: 'recent_items', title: 'Recent Items', visible: true, order: 6 },
  { id: 'inventory_overview', title: 'Inventory Overview', visible: true, order: 7 },
  { id: 'quick_actions', title: 'Quick Actions', visible: true, order: 8 }
];

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalItems: 0,
    totalValue: 0,
    lowStockItems: 0,
    recentActivity: 0,
    pendingRequisitions: 0,
    pendingPOs: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentItems, setRecentItems] = useState<any[]>([]);
  const [recentRequisitions, setRecentRequisitions] = useState<any[]>([]);
  const [recentPOs, setRecentPOs] = useState<any[]>([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [widgets, setWidgets] = useState<DashboardWidget[]>(DEFAULT_WIDGETS);
  const { socket } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadDashboardData();
    loadWidgetSettings();
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('item_created', loadDashboardData);
      socket.on('item_updated', loadDashboardData);
      socket.on('item_deleted', loadDashboardData);
      socket.on('requisition_created', loadDashboardData);
      socket.on('requisition_updated', loadDashboardData);
      socket.on('po_created', loadDashboardData);
      socket.on('po_updated', loadDashboardData);

      return () => {
        socket.off('item_created');
        socket.off('item_updated');
        socket.off('item_deleted');
        socket.off('requisition_created');
        socket.off('requisition_updated');
        socket.off('po_created');
        socket.off('po_updated');
      };
    }
  }, [socket]);

  const loadWidgetSettings = () => {
    try {
      const savedWidgets = localStorage.getItem('dashboardWidgetSettings');
      if (savedWidgets) {
        setWidgets(JSON.parse(savedWidgets));
      }
    } catch (error) {
      console.error('Error loading dashboard settings:', error);
    }
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load inventory data
      const inventoryResponse = await inventoryService.getItems({ limit: 1000 });
      const items = Array.isArray(inventoryResponse.items) ? inventoryResponse.items : [];

      const totalItems = inventoryResponse.pagination?.total || 0;
      const totalValue = items.reduce((sum: number, item: any) => sum + (item.total_value || 0), 0);
      const lowStockItems = items.filter((item: any) => item.is_low_stock).length;
      const recentActivity = items.filter((item: any) => {
        const updatedAt = new Date(item.updated_at);
        const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        return updatedAt > dayAgo;
      }).length;

      // Get recent items
      setRecentItems(items.slice(0, 5));
      
      // Load requisition data
      const requisitionStats = await requisitionService.getStats();
      const requisitionsResponse = await requisitionService.getRequisitions({ limit: 5 });
      setRecentRequisitions(requisitionsResponse.requisitions || []);
      
      // Load purchase order data
      const poStats = await purchaseOrderService.getStats();
      const poResponse = await purchaseOrderService.getPurchaseOrders({ limit: 5 });
      setRecentPOs(poResponse.purchaseOrders || []);

      setStats({
        totalItems,
        totalValue,
        lowStockItems,
        recentActivity,
        pendingRequisitions: requisitionStats.pending_count || 0,
        pendingPOs: poStats.pending_approval_count || 0
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      // Set safe defaults on error
      setStats({
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
        recentActivity: 0,
        pendingRequisitions: 0,
        pendingPOs: 0
      });
      setRecentItems([]);
      setRecentRequisitions([]);
      setRecentPOs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = () => {
    setShowReportModal(true);
  };

  // Navigate to inventory page with state to open add item modal
  const handleAddItem = () => {
    navigate('/inventory', { state: { openAddModal: true } });
  };

  // Navigate to requisitions page with state to open create requisition modal
  const handleNewRequisition = () => {
    navigate('/requisitions', { state: { openCreateModal: true } });
  };

  // Navigate to purchase orders page with state to open create PO modal
  const handleCreatePO = () => {
    navigate('/purchase-orders', { state: { openCreateModal: true } });
  };

  const navigateToInventory = () => navigate('/inventory');
  const navigateToRequisitions = () => navigate('/requisitions');
  const navigateToPurchaseOrders = () => navigate('/purchase-orders');
  const navigateToReports = () => navigate('/reports');

  const isWidgetVisible = (widgetId: string): boolean => {
    const widget = widgets.find(w => w.id === widgetId);
    return widget ? widget.visible : true;
  };

  const getWidgetOrder = (widgetId: string): number => {
    const widget = widgets.find(w => w.id === widgetId);
    return widget ? widget.order : 999;
  };

  // Sort widgets by order
  const sortedWidgets = [...widgets].sort((a, b) => a.order - b.order);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex items-center space-x-3">
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            title="Dashboard Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Quick Actions - Moved to the top */}
      <DashboardQuickActions
        onAddItem={handleAddItem}
        onNewRequisition={handleNewRequisition}
        onCreatePO={handleCreatePO}
        onGenerateReport={handleGenerateReport}
      />

      {/* Stats Grid */}
      <DashboardStatsGrid stats={stats} isWidgetVisible={isWidgetVisible} />

      {/* Pending Approvals */}
      {isWidgetVisible('pending_requisitions') && (
        <DashboardPendingApprovals
          stats={stats}
          recentRequisitions={recentRequisitions}
          recentPOs={recentPOs}
          navigateToRequisitions={navigateToRequisitions}
          navigateToPurchaseOrders={navigateToPurchaseOrders}
          onViewRequisition={id => navigate(`/requisitions`, { state: { viewRequisition: id } })}
          onViewPurchaseOrder={id => navigate(`/purchase-orders`, { state: { viewPurchaseOrder: id } })}
        />
      )}

      {/* Recent Items and Chart */}
      {(isWidgetVisible('recent_items') || isWidgetVisible('inventory_overview')) && (
        <DashboardRecentAndOverview
          recentItems={recentItems}
          isWidgetVisible={isWidgetVisible}
          navigateToInventory={navigateToInventory}
          navigateToReports={navigateToReports}
        />
      )}

      {/* Report Generator Modal */}
      <ReportGeneratorModal 
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
      />

      {/* Dashboard Settings Modal */}
      <UserDashboardSettings
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        onSave={loadWidgetSettings}
      />
    </div>
  );
};

export default Dashboard;