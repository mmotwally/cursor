import React from 'react';

interface AddItemFormFieldsProps {
  formData: any;
  dropdownData: any;
  filteredSubcategories: any[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  loading: boolean;
}

const AddItemFormFields: React.FC<AddItemFormFieldsProps> = ({
  formData,
  dropdownData,
  filteredSubcategories,
  handleInputChange,
  loading
}) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
        <input
          type="text"
          name="sku"
          value={formData.sku}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        />
      </div>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2"
        rows={2}
        disabled={loading}
      />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          name="category_id"
          value={formData.category_id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="">Select Category</option>
          {dropdownData.categories.map((cat: any) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Subcategory</label>
        <select
          name="subcategory_id"
          value={formData.subcategory_id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="">Select Subcategory</option>
          {filteredSubcategories.map((sub: any) => (
            <option key={sub.id} value={sub.id}>{sub.name}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
        <select
          name="unit_id"
          value={formData.unit_id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="">Select Unit</option>
          {dropdownData.units.map((unit: any) => (
            <option key={unit.id} value={unit.id}>{unit.name} ({unit.abbreviation})</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
        <select
          name="location_id"
          value={formData.location_id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="">Select Location</option>
          {dropdownData.locations.map((loc: any) => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Supplier</label>
        <select
          name="supplier_id"
          value={formData.supplier_id}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="">Select Supplier</option>
          {dropdownData.suppliers.map((sup: any) => (
            <option key={sup.id} value={sup.id}>{sup.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Item Type</label>
        <select
          name="item_type"
          value={formData.item_type}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          disabled={loading}
        >
          <option value="raw_material">Raw Material</option>
          <option value="finished_good">Finished Good</option>
          <option value="sub_assembly">Sub-Assembly</option>
          <option value="consumable">Consumable</option>
        </select>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
        <input
          type="number"
          name="quantity"
          value={formData.quantity}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          min={0}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Min Quantity</label>
        <input
          type="number"
          name="min_quantity"
          value={formData.min_quantity}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          min={0}
          disabled={loading}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Max Quantity</label>
        <input
          type="number"
          name="max_quantity"
          value={formData.max_quantity}
          onChange={handleInputChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
          min={0}
          disabled={loading}
        />
      </div>
    </div>
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price</label>
      <input
        type="number"
        name="unit_price"
        value={formData.unit_price}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded-lg px-3 py-2"
        min={0}
        step={0.01}
        disabled={loading}
      />
    </div>
  </>
);

export default AddItemFormFields; 