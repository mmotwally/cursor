import React from 'react';
import { 
  ShoppingCart, 
  Plus, 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  Truck,
  Calendar,
  DollarSign,
  Send,
  Edit,
  Trash2,
  Settings,
  CheckSquare
} from 'lucide-react';
import POTable from './POTable';

// Stats Cards Component
export const POStatsCards: React.FC<{ stats: any }> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <ShoppingCart className="w-8 h-8 text-blue-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total POs</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total_pos}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <Clock className="w-8 h-8 text-yellow-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Pending</p>
          <p className="text-2xl font-bold text-gray-900">{stats.pending_approval_count}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <Truck className="w-8 h-8 text-purple-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Received</p>
          <p className="text-2xl font-bold text-gray-900">{stats.received_count}</p>
        </div>
      </div>
    </div>
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center">
        <DollarSign className="w-8 h-8 text-green-600" />
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Value</p>
          <p className="text-2xl font-bold text-gray-900">${(stats.total_value || 0).toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

// Filters Component
export const POFilters: React.FC<{
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}> = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search purchase orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div className="sm:w-48">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="pending_approval">Pending Approval</option>
          <option value="approved">Approved</option>
          <option value="sent">Sent</option>
          <option value="partially_received">Partially Received</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  </div>
);

// Helper functions for table
const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent': return 'bg-red-100 text-red-800';
    case 'high': return 'bg-orange-100 text-orange-800';
    case 'medium': return 'bg-yellow-100 text-yellow-800';
    case 'low': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'approved': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
    case 'sent': return <Send className="h-4 w-4 text-blue-500" />;
    case 'received': return <Truck className="h-4 w-4 text-purple-500" />;
    case 'partially_received': return <Truck className="h-4 w-4 text-orange-500" />;
    case 'pending_approval': return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'draft': return <Package className="h-4 w-4 text-gray-500" />;
    default: return <Clock className="h-4 w-4 text-gray-500" />;
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

// Permission helpers - Updated to allow editing and deleting in all stages
const canApprove = (po: any, user: any) => {
  return po.status === 'pending_approval' && (user?.role === 'admin' || user?.role === 'manager');
};

const canReceive = (po: any, user: any) => {
  return (po.status === 'sent' || po.status === 'partially_received') && 
         (user?.role === 'admin' || user?.role === 'manager');
};

const canEdit = (po: any, user: any) => {
  // Allow editing for admin/manager at any stage
  return (user?.role === 'admin' || user?.role === 'manager');
};

const canDelete = (po: any, user: any) => {
  // Allow deleting for admin/manager at any stage
  return (user?.role === 'admin' || user?.role === 'manager');
};