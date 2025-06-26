import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, RefreshCw, Package, PenTool as Tool, DollarSign, Columns } from 'lucide-react';
import { bomService } from '../../services/bomService';
import BOMModal from './BOMModal';
import ViewBOMModal from './ViewBOMModal';
import ColumnCustomizerModal, { Column } from '../Common/ColumnCustomizer';
import { useColumnPreferences } from '../../hooks/useColumnPreferences';
import BOMsTable from './BOMsTable';

interface BOM {
  id: number;
  name: string;
  description: string;
  version: string;
  status: string;
  finished_product_name: string;
  finished_product_sku: string;
  unit_cost: number;
  labor_cost: number;
  overhead_cost: number;
  total_cost: number;
  component_count: number;
  operation_count: number;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

const DEFAULT_COLUMNS: Column[] = [
  { id: 'bom', label: 'BOM', visible: true, width: 200, order: 1 },
  { id: 'finished_product', label: 'Finished Product', visible: true, width: 200, order: 2 },
  { id: 'status', label: 'Status', visible: true, width: 100, order: 3 },
  { id: 'components', label: 'Components', visible: true, width: 120, order: 4 },
  { id: 'operations', label: 'Operations', visible: true, width: 120, order: 5 },
  { id: 'total_cost', label: 'Total Cost', visible: true, width: 120, order: 6 },
  { id: 'created_by', label: 'Created By', visible: true, width: 150, order: 7 },
  { id: 'actions', label: 'Actions', visible: true, width: 120, order: 8 }
];

const BOMsTab: React.FC = () => {
  const [boms, setBOMs] = useState<BOM[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editingBOM, setEditingBOM] = useState<BOM | null>(null);
  const [viewingBOM, setViewingBOM] = useState<BOM | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 50,
    total: 0,
    pages: 0
  });

  const { 
    columns, 
    visibleColumns, 
    showColumnCustomizer, 
    setShowColumnCustomizer, 
    handleSaveColumnPreferences 
  } = useColumnPreferences('bom_columns', DEFAULT_COLUMNS);

  useEffect(() => {
    fetchBOMs();
  }, [searchTerm, statusFilter, pagination.page]);

  const fetchBOMs = async () => {
    try {
      setLoading(true);
      const params: any = {
        page: pagination.page,
        limit: pagination.limit
      };

      if (searchTerm) params.search = searchTerm;
      if (statusFilter !== 'all') params.status = statusFilter;

      const response = await bomService.getBOMs(params);
      setBOMs(response.boms);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching BOMs:', error);
      alert('Failed to fetch BOMs');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete BOM "${name}"?`)) {
      try {
        await bomService.deleteBOM(id);
        fetchBOMs();
      } catch (error) {
        console.error('Error deleting BOM:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete BOM');
      }
    }
  };

  const handleEdit = (bom: BOM) => {
    setEditingBOM(bom);
    setShowModal(true);
  };

  const handleView = (bom: BOM) => {
    setViewingBOM(bom);
    setShowViewModal(true);
  };

  const handleAdd = () => {
    setEditingBOM(null);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingBOM(null);
  };

  const handleViewModalClose = () => {
    setShowViewModal(false);
    setViewingBOM(null);
  };

  const handleModalSuccess = () => {
    fetchBOMs();
    handleModalClose();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Active</span>;
      case 'inactive':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Inactive</span>;
      case 'draft':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Draft</span>;
      case 'archived':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Archived</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bill of Materials (BOM)</h2>
          <p className="text-sm text-gray-600">Manage manufacturing recipes and assembly instructions</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowColumnCustomizer(true)}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Columns className="h-4 w-4 mr-2" />
            Columns
          </button>
          <button
            onClick={fetchBOMs}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
          <button
            onClick={handleAdd}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add BOM
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search BOMs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="inactive">Inactive</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* BOMs Table */}
      <BOMsTable
        boms={boms}
        visibleColumns={visibleColumns}
        handleView={handleView}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        pagination={pagination}
        setPagination={setPagination}
        loading={loading}
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        getStatusBadge={getStatusBadge}
        handleAdd={handleAdd}
      />

      {/* Modals */}
      <BOMModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSuccess={handleModalSuccess}
        bom={editingBOM}
      />

      <ViewBOMModal
        isOpen={showViewModal}
        onClose={handleViewModalClose}
        bom={viewingBOM}
      />

      <ColumnCustomizerModal
        isOpen={showColumnCustomizer}
        onClose={() => setShowColumnCustomizer(false)}
        onSave={handleSaveColumnPreferences}
        columns={columns}
        title="Customize BOM Columns"
      />
    </div>
  );
};

export default BOMsTab;