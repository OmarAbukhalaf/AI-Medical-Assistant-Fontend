
import { useState } from "react";
import { Upload, X } from "lucide-react";

interface ImageUploadProps {
  onImageSelected: (files: File[]) => void;
}

const ImageUpload = ({ onImageSelected }: ImageUploadProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = (newFiles: File[]) => {
    const imageFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/'));
    if (imageFiles.length === 0) return;
    
    const combinedFiles = [...files, ...imageFiles];
    setFiles(combinedFiles);
    onImageSelected(combinedFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onImageSelected(updatedFiles);
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg flex flex-col items-center justify-center min-h-[160px] transition-colors ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="text-center p-6">
          <div className="h-10 w-10 mx-auto mb-3 text-gray-400">
            <Upload />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Drag and drop images here, or</p>
            <label htmlFor="file-upload" className="cursor-pointer">
              <span className="mx-auto px-4 py-2 rounded-md border border-gray-300 bg-white text-sm inline-block text-center">
  Browse Files
</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500 pt-2">
              PNG, JPG, GIF up to 5MB each
            </p>
          </div>
        </div>
      </div>

      {files.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h3 className="text-sm font-medium mb-2">
            {files.length} {files.length === 1 ? "image" : "images"} selected
          </h3>
          
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex justify-between items-center py-1 px-2 bg-white rounded border border-gray-200">
                <span className="text-sm truncate max-w-[80%]" title={file.name}>
                  {file.name}
                </span>
                <button
                  onClick={() => removeFile(index)}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full hover:bg-gray-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
