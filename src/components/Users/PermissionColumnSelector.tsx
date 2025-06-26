import React from 'react';

interface PermissionColumnSelectorProps {
  columnVisibility: any[];
  toggleColumnVisibility: (columnId: string) => void;
  showColumnSelector: boolean;
  setShowColumnSelector: (show: boolean) => void;
}

const PermissionColumnSelector: React.FC<PermissionColumnSelectorProps> = ({
  columnVisibility,
  toggleColumnVisibility,
  showColumnSelector,
  setShowColumnSelector
}) => (
  <div className="mb-4">
    <button
      onClick={() => setShowColumnSelector(!showColumnSelector)}
      className="px-3 py-1 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors mb-2"
    >
      {showColumnSelector ? 'Hide Columns' : 'Show/Hide Columns'}
    </button>
    {showColumnSelector && (
      <div className="flex flex-wrap gap-3 bg-gray-50 p-3 rounded-lg border border-gray-200">
        {columnVisibility.map(col => (
          <label key={col.id} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={col.visible}
              onChange={() => toggleColumnVisibility(col.id)}
              className="form-checkbox h-4 w-4 text-blue-600"
            />
            <span className="text-sm">{col.label}</span>
          </label>
        ))}
      </div>
    )}
  </div>
);

export default PermissionColumnSelector; 