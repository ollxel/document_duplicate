import React, { useRef, useState, useCallback } from 'react';
import { UploadCloudIcon } from './icons/UploadCloudIcon';
import { FileIcon } from './icons/FileIcon';

interface FileUploadProps {
  onFilesChange: (files: FileList | null) => void;
  onAnalyze: () => void;
  onReset: () => void;
  isLoading: boolean;
  selectedFileCount: number;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFilesChange, onAnalyze, onReset, isLoading, selectedFileCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0 && fileInputRef.current) {
      fileInputRef.current.files = files;
      onFilesChange(files);
    }
  }, [onFilesChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilesChange(e.target.files);
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const acceptedFileTypes = ".txt,.pdf,.docx";

  return (
    <div className="w-full">
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors duration-200
          ${isDragOver ? 'border-indigo-500 bg-indigo-50 dark:bg-slate-700' : 'border-slate-300 dark:border-slate-600'}`}
      >
        <UploadCloudIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mb-4" />
        <p className="text-lg font-semibold text-slate-700 dark:text-slate-300">Drag & drop files here</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">or</p>
        <button 
          type="button"
          onClick={handleBrowseClick}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md font-semibold text-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Browse Files
        </button>
        <input
          type="file"
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          accept={acceptedFileTypes}
          className="hidden"
        />
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">Supports: {acceptedFileTypes.replace(/,/g, ', ')}</p>
      </div>
      
      {selectedFileCount > 0 && (
        <div className="mt-6 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg">
          <div className="flex items-center text-slate-700 dark:text-slate-200">
            <FileIcon className="w-5 h-5 mr-3 text-slate-500" />
            <p className="font-medium">{selectedFileCount} file{selectedFileCount > 1 ? 's' : ''} selected for analysis.</p>
          </div>
        </div>
      )}

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onAnalyze}
          disabled={isLoading || selectedFileCount === 0}
          className="flex-1 w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-slate-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Analyze Documents'}
        </button>
        <button
          onClick={onReset}
          disabled={isLoading}
          className="flex-1 sm:flex-none w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-slate-300 dark:border-slate-600 text-base font-medium rounded-md shadow-sm text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          Reset
        </button>
      </div>
    </div>
  );
};