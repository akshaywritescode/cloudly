'use client';

import { 
  Cloud, 
  Images, 
  Video, 
  FileText, 
  Music, 
  Archive, 
  FolderOpen, 
  Star, 
  Clock, 
  Trash2
} from "lucide-react";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
}

interface SidebarSection {
  title: string;
  items: SidebarItemProps[];
}

function SidebarItem({ icon, label, count, isActive, onClick }: SidebarItemProps) {
  return (
    <div 
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
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

function SidebarSection({ title, items }: SidebarSection) {
  return (
    <div className="px-4 mb-4">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
        {title}
      </h3>
      <div className="space-y-1">
        {items.map((item, index) => (
          <SidebarItem key={index} {...item} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  // File Types Data
  const fileTypesData: SidebarItemProps[] = [
    { icon: <Images className="w-5 h-5" />, label: "Images", count: 24, isActive: true },
    { icon: <Video className="w-5 h-5" />, label: "Videos", count: 8 },
    { icon: <FileText className="w-5 h-5" />, label: "Documents", count: 156 },
    { icon: <Music className="w-5 h-5" />, label: "Audio", count: 5 },
    { icon: <Archive className="w-5 h-5" />, label: "Archives", count: 5 },
  ];

  // Folders Data
  const foldersData: SidebarItemProps[] = [
    { icon: <FolderOpen className="w-5 h-5" />, label: "My Files", count: 205 },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Shared with me", count: 12 },
    { icon: <FolderOpen className="w-5 h-5" />, label: "Recent", count: 8 },
  ];

  // Quick Access Data
  const quickAccessData: SidebarItemProps[] = [
    { icon: <Star className="w-5 h-5" />, label: "Starred", count: 15 },
    { icon: <Clock className="w-5 h-5" />, label: "Recent", count: 32 },
    { icon: <Trash2 className="w-5 h-5" />, label: "Trash", count: 7 },
  ];

  // All sections data
  const sections: SidebarSection[] = [
    { title: "File Types", items: fileTypesData },
    { title: "Folders", items: foldersData },
    { title: "Quick Access", items: quickAccessData },
  ];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Logo Section */}
      <div className="flex w-full items-center justify-center p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Cloud className="w-6 h-6 text-blue-600" />
          <span className="font-semibold text-lg text-gray-800">Cloudly</span>
        </div>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto mt-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        {sections.map((section, index) => (
          <SidebarSection key={index} {...section} />
        ))}
      </div>
    </div>
  );
}
