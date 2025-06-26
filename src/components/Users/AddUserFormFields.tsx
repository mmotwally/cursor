import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

interface AddUserFormFieldsProps {
  formData: any;
  availableRoles: string[];
  loading: boolean;
  error: string;
  passwordErrors: string[];
  showPasswordInfo: boolean;
  setShowPasswordInfo: (show: boolean) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AddUserFormFields: React.FC<AddUserFormFieldsProps> = ({
  formData,
  availableRoles,
  loading,
  error,
  passwordErrors,
  showPasswordInfo,
  setShowPasswordInfo,
  handleInputChange
}) => (
  <>
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    )}
    {passwordErrors.length > 0 && (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
          <div>
            <p className="font-medium">Password requirements not met:</p>
            <ul className="list-disc list-inside mt-1">
              {passwordErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    )}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Username *</label>
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleInputChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter username"
        disabled={loading}
      />
      <p className="text-xs text-gray-500 mt-1">
        3-30 characters, letters, numbers, underscores, and hyphens only
      </p>
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter email"
        disabled={loading}
      />
    </div>
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium text-gray-700">Password *</label>
        <button
          type="button"
          onClick={() => setShowPasswordInfo(!showPasswordInfo)}
          className="text-xs text-blue-600 hover:text-blue-800 flex items-center"
        >
          <Info className="h-4 w-4 mr-1" />
          Password Info
        </button>
      </div>
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleInputChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter password"
        disabled={loading}
      />
      {showPasswordInfo && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg mt-2">
          <ul className="list-disc list-inside text-xs">
            <li>At least 8 characters</li>
            <li>At least one uppercase letter</li>
            <li>At least one lowercase letter</li>
            <li>At least one number</li>
            <li>At least one special character</li>
          </ul>
        </div>
      )}
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
      <input
        type="password"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Confirm password"
        disabled={loading}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
      <select
        name="role"
        value={formData.role}
        onChange={handleInputChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={loading}
      >
        {availableRoles.map(role => (
          <option key={role} value={role}>{role}</option>
        ))}
      </select>
    </div>
  </>
);

export default AddUserFormFields; 