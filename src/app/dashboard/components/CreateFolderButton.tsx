import React from 'react';
import { FolderEdit } from "lucide-react";

interface CreateFolderButtonProps {
  onClick: () => void;
}

export default function CreateFolderButton({ onClick }: CreateFolderButtonProps) {
  return (
    <div 
      className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-blue-50 text-blue-600 hover:text-blue-700 border border-dashed border-blue-200 hover:border-blue-300"
      onClick={onClick}
    >
      <div className="w-5 h-5">
        <FolderEdit className="w-5 h-5" />
      </div>
      <span className="font-medium text-sm">Create Folder</span>
    </div>
  );
}
