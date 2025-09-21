import React from 'react';

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  id: string;
  type?: "images" | "videos" | "docs" | "audio";
  section: "fileTypes" | "folders" | "quickAccess";
}

export default function SidebarItem({ icon, label, count, isActive, onClick }: SidebarItemProps) {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors select-none ${
        isActive 
          ? 'bg-blue-50 text-blue-700 border border-blue-200' 
          : 'hover:bg-gray-50 text-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
          {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      {count !== undefined && (
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
