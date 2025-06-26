import React, { useState, useEffect } from 'react';
import { X, FileText, Package, PenTool as Tool, DollarSign, User, Calendar, Clipboard, Layers, ChevronRight, ChevronDown } from 'lucide-react';
import { bomService } from '../../services/bomService';
import ViewBOMComponentsTable from './ViewBOMComponentsTable';
import ViewBOMOperationsTable from './ViewBOMOperationsTable';
import ViewBOMCostSummary from './ViewBOMCostSummary';

interface ViewBOMModalProps {
  isOpen: boolean;
  onClose: () => void;
  bom: any;
}

const ViewBOMModal: React.FC<ViewBOMModalProps> = ({ isOpen, onClose, bom }) => {
  const [bomDetails, setBOMDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [expandedSubBoms, setExpandedSubBoms] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (isOpen && bom) {
      loadBOMDetails();
    }
  }, [isOpen, bom]);

  const loadBOMDetails = async () => {
    try {
      setLoading(true);
      const details = await bomService.getBOM(bom.id);
      setBOMDetails(details);
    } catch (error) {
      console.error('Error loading BOM details:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubBom = (componentId: string) => {
    setExpandedSubBoms(prev => ({
      ...prev,
      [componentId]: !prev[componentId]
    }));
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

  const getSkillLevelBadge = (level: string) => {
    switch (level) {
      case 'basic':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Basic</span>;
      case 'intermediate':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Intermediate</span>;
      case 'advanced':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Advanced</span>;
      case 'expert':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Expert</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{level}</span>;
    }
  };

  if (!isOpen || !bom) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full h-full sm:h-auto sm:max-h-[90vh] max-w-6xl flex flex-col">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <FileText className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Bill of Materials</h2>
              {bomDetails && (
                <p className="text-sm text-gray-600">{bomDetails.name} (v{bomDetails.version})</p>
              )}
            </div>
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
          ) : bomDetails ? (
            <div className="p-4 sm:p-6 space-y-6">
              {/* Header Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{bomDetails.name}</h3>
                    <p className="text-gray-600">{bomDetails.description}</p>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getStatusBadge(bomDetails.status)}
                    <span className="text-sm text-gray-600">Version: {bomDetails.version}</span>
                  </div>

                  {bomDetails.finished_product_name && (
                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="h-4 w-4 mr-2" />
                      Finished Product: {bomDetails.finished_product_name}
                      {bomDetails.finished_product_sku && ` (${bomDetails.finished_product_sku})`}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="h-4 w-4 mr-2" />
                    Created by: {bomDetails.created_by_name}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Created: {new Date(bomDetails.created_at).toLocaleDateString()}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Last Updated: {new Date(bomDetails.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Cost Summary */}
              <ViewBOMCostSummary
                unit_cost={bomDetails.unit_cost}
                labor_cost={bomDetails.labor_cost}
                overhead_cost={bomDetails.overhead_cost}
                total_cost={bomDetails.total_cost}
              />

              {/* Components List */}
              <div>
                <div className="flex items-center mb-4">
                  <Package className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Components</h4>
                </div>
                {bomDetails.components && bomDetails.components.length > 0 ? (
                  <ViewBOMComponentsTable
                    components={bomDetails.components}
                    expandedSubBoms={expandedSubBoms}
                    toggleSubBom={toggleSubBom}
                  />
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Package className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No components found</p>
                  </div>
                )}
              </div>

              {/* Operations List */}
              <div>
                <div className="flex items-center mb-4">
                  <Tool className="h-5 w-5 text-purple-500 mr-2" />
                  <h4 className="text-lg font-medium text-gray-900">Manufacturing Operations</h4>
                </div>
                {bomDetails.operations && bomDetails.operations.length > 0 ? (
                  <ViewBOMOperationsTable
                    operations={bomDetails.operations}
                    getSkillLevelBadge={getSkillLevelBadge}
                  />
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-lg">
                    <Tool className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">No operations found</p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <p className="text-gray-500">Failed to load BOM details</p>
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

export default ViewBOMModal;