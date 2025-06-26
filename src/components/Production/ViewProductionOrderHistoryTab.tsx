import React from 'react';
import { FileText, Calendar, Play, CheckCircle, XCircle } from 'lucide-react';

interface ViewProductionOrderHistoryTabProps {
  fullOrder: any;
}

const ViewProductionOrderHistoryTab: React.FC<ViewProductionOrderHistoryTabProps> = ({ fullOrder }) => (
  <div className="space-y-6">
    <h3 className="text-lg font-medium text-gray-900">Production History</h3>
    {/* Completion Records */}
    <div>
      <h4 className="text-md font-medium text-gray-800 mb-3">Completion Records</h4>
      {fullOrder.completions && fullOrder.completions.length > 0 ? (
        <div className="bg-gray-50 p-4 rounded-lg space-y-4">
          {fullOrder.completions.map((completion: any, index: number) => (
            <div key={index} className="bg-white p-3 rounded border border-gray-200">
              <div className="flex justify-between">
                <div>
                  <span className="font-medium">Completed: {completion.quantity} units</span>
                  <span className={`ml-3 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    completion.quality_check_passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {completion.quality_check_passed ? 'Quality Passed' : 'Quality Failed'}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(completion.completion_date).toLocaleString()}
                </div>
              </div>
              <div className="mt-1 text-sm">
                <span className="text-gray-600">Completed by: </span>
                <span className="text-gray-900">{completion.completed_by_name}</span>
              </div>
              {completion.batch_number && (
                <div className="mt-1 text-sm text-gray-600">
                  Batch: {completion.batch_number}
                </div>
              )}
              {completion.notes && (
                <div className="mt-1 text-sm text-gray-600">
                  Notes: {completion.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-500">No completion records found</p>
        </div>
      )}
    </div>
    {/* Timeline */}
    <div>
      <h4 className="text-md font-medium text-gray-800 mb-3">Production Timeline</h4>
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="relative border-l-2 border-gray-200 ml-3 pl-8 space-y-6">
          {/* Created */}
          <div className="relative">
            <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
              <FileText className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Order Created</p>
              <p className="text-sm text-gray-600">
                {new Date(fullOrder.created_at).toLocaleString()} by {fullOrder.created_by_name}
              </p>
            </div>
          </div>
          {/* Started */}
          {fullOrder.status !== 'draft' && (
            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                <Calendar className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Production Planned</p>
                <p className="text-sm text-gray-600">
                  {fullOrder.start_date ? new Date(fullOrder.start_date).toLocaleDateString() : 'No start date set'}
                </p>
              </div>
            </div>
          )}
          {/* In Progress */}
          {['in_progress', 'completed'].includes(fullOrder.status) && (
            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                <Play className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Production Started</p>
                <p className="text-sm text-gray-600">
                  Materials issued and production in progress
                </p>
              </div>
            </div>
          )}
          {/* Completed */}
          {fullOrder.status === 'completed' && (
            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Production Completed</p>
                <p className="text-sm text-gray-600">
                  {fullOrder.completion_date ? new Date(fullOrder.completion_date).toLocaleDateString() : 'Completion date not recorded'}
                </p>
              </div>
            </div>
          )}
          {/* Cancelled */}
          {fullOrder.status === 'cancelled' && (
            <div className="relative">
              <div className="absolute -left-10 mt-1.5 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                <XCircle className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Production Cancelled</p>
                <p className="text-sm text-gray-600">
                  Order was cancelled
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default ViewProductionOrderHistoryTab; 