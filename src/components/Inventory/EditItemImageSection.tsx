import React from 'react';
import { Image, Upload } from 'lucide-react';

interface EditItemImageSectionProps {
  imageFile: File | null;
  imagePreviewUrl: string;
  uploadError: string;
  uploadingImage: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const EditItemImageSection: React.FC<EditItemImageSectionProps> = ({
  imageFile,
  imagePreviewUrl,
  uploadError,
  uploadingImage,
  onImageChange
}) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
    <div className="flex items-center space-x-4">
      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden border border-gray-200">
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="object-cover w-full h-full" />
        ) : (
          <Image className="h-10 w-10 text-gray-300" />
        )}
      </div>
      <div>
        <label className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg cursor-pointer hover:bg-blue-100 transition-colors">
          <Upload className="h-5 w-5 mr-2" />
          {uploadingImage ? 'Uploading...' : 'Upload Image'}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onImageChange}
            disabled={uploadingImage}
          />
        </label>
        {uploadError && <div className="text-xs text-red-600 mt-1">{uploadError}</div>}
      </div>
    </div>
  </div>
);

export default EditItemImageSection; 