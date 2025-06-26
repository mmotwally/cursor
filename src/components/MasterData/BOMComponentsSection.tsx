import React from 'react';
import { Plus, Trash2, Package, Layers } from 'lucide-react';

interface BOMComponentsSectionProps {
  components: any[];
  inventoryItems: any[];
  units: any[];
  filteredBomsList: any[];
  addComponent: () => void;
  removeComponent: (index: number) => void;
  handleComponentTypeChange: (index: number, type: 'item' | 'bom') => void;
  handleComponentChange: (index: number, field: string, value: any) => void;
  calculateComponentCost: (component: any) => number;
}

const BOMComponentsSection: React.FC<BOMComponentsSectionProps> = ({
  components,
  inventoryItems,
  units,
  filteredBomsList,
  addComponent,
  removeComponent,
  handleComponentTypeChange,
  handleComponentChange,
  calculateComponentCost
}) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-medium text-gray-900">Components</h3>
      <button
        type="button"
        onClick={addComponent}
        className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Component
      </button>
    </div>
    <div className="space-y-4">
      {components.map((component, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              {component.component_type === 'item' ? (
                <Package className="h-5 w-5 text-blue-500 mr-2" />
              ) : (
                <Layers className="h-5 w-5 text-purple-500 mr-2" />
              )}
              <span className="font-medium text-gray-900">
                {component.component_type === 'item' ? 'Inventory Item' : 'Sub-Assembly (BOM)'}
              </span>
            </div>
            {components.length > 1 && (
              <button
                type="button"
                onClick={() => removeComponent(index)}
                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          {/* Component Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Component Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleComponentTypeChange(index, 'item')}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                  component.component_type === 'item'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Package className="h-5 w-5 mr-2" />
                Inventory Item
              </button>
              <button
                type="button"
                onClick={() => handleComponentTypeChange(index, 'bom')}
                className={`flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-colors ${
                  component.component_type === 'bom'
                    ? 'border-purple-500 bg-purple-50 text-purple-700'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Layers className="h-5 w-5 mr-2" />
                Sub-Assembly (BOM)
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {component.component_type === 'item' ? 'Item *' : 'Sub-Assembly (BOM) *'}
              </label>
              {component.component_type === 'item' ? (
                <select
                  value={component.item_id}
                  onChange={(e) => handleComponentChange(index, 'item_id', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Item</option>
                  {inventoryItems.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </option>
                  ))}
                </select>
              ) : (
                <select
                  value={component.component_bom_id}
                  onChange={(e) => handleComponentChange(index, 'component_bom_id', e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select BOM</option>
                  {filteredBomsList.map(subBom => (
                    <option key={subBom.id} value={subBom.id}>
                      {subBom.name} (v{subBom.version})
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity *
              </label>
              <input
                type="number"
                value={component.quantity}
                onChange={(e) => handleComponentChange(index, 'quantity', e.target.value)}
                min="0.0001"
                step="0.0001"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Unit
              </label>
              <select
                value={component.unit_id}
                onChange={(e) => handleComponentChange(index, 'unit_id', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Unit</option>
                {units.map(unit => (
                  <option key={unit.id} value={unit.id}>
                    {unit.name} ({unit.abbreviation})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waste Factor (%)
              </label>
              <input
                type="number"
                value={component.waste_factor * 100}
                onChange={(e) => handleComponentChange(index, 'waste_factor', parseFloat(e.target.value) / 100)}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              <p className="text-xs text-gray-500 mt-1">
                Percentage of material wasted during production
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Cost
              </label>
              <div className="px-3 py-2 bg-gray-100 rounded-lg text-sm">
                ${calculateComponentCost(component).toFixed(2)}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <input
              type="text"
              value={component.notes}
              onChange={(e) => handleComponentChange(index, 'notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional notes for this component"
            />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default BOMComponentsSection; 