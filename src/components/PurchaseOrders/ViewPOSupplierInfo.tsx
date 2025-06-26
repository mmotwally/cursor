import React from 'react';
import { Building2 } from 'lucide-react';

interface ViewPOSupplierInfoProps {
  fullPO: any;
}

const ViewPOSupplierInfo: React.FC<ViewPOSupplierInfoProps> = ({ fullPO }) => (
  <div className="bg-blue-50 p-4 rounded-lg">
    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
      <Building2 className="h-4 w-4 text-blue-600 mr-2" />
      Supplier Information
    </h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
      <div>
        <p className="font-medium text-gray-700">{fullPO.supplier_name}</p>
        <p className="text-gray-600">Contact: {fullPO.supplier_contact || 'N/A'}</p>
        <p className="text-gray-600">Email: {fullPO.supplier_email || 'N/A'}</p>
      </div>
      <div>
        <p className="text-gray-600">Phone: {fullPO.supplier_phone || 'N/A'}</p>
        <p className="text-gray-600">Address: {fullPO.supplier_address || 'N/A'}</p>
      </div>
    </div>
  </div>
);

export default ViewPOSupplierInfo; 