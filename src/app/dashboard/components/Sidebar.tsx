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
import { NavigationItem } from "../page";
import SidebarItem, { SidebarItemProps } from './SidebarItem';
import SidebarSection from './SidebarSection';
import { useFileCounts } from '@/hooks/useFileCounts';

interface SidebarProps {
  activeNavigation: NavigationItem;
  onNavigationChange: (item: NavigationItem) => void;
}

export default function Sidebar({ activeNavigation, onNavigationChange }: SidebarProps) {
  const { counts, loading } = useFileCounts();

  // File Types Data
  const fileTypesData: SidebarItemProps[] = [
    { 
      icon: <Images className="w-5 h-5" />, 
      label: "Images", 
      count: loading ? 0 : counts.images, 
      id: "images",
      type: "images",
      section: "fileTypes",
      isActive: activeNavigation.id === "images",
      onClick: () => onNavigationChange({ id: "images", label: "Images", type: "images", section: "fileTypes" })
    },
    { 
      icon: <Video className="w-5 h-5" />, 
      label: "Videos", 
      count: loading ? 0 : counts.videos, 
      id: "videos",
      type: "videos",
      section: "fileTypes",
      isActive: activeNavigation.id === "videos",
      onClick: () => onNavigationChange({ id: "videos", label: "Videos", type: "videos", section: "fileTypes" })
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: "Documents", 
      count: loading ? 0 : counts.docs, 
      id: "docs",
      type: "docs",
      section: "fileTypes",
      isActive: activeNavigation.id === "docs",
      onClick: () => onNavigationChange({ id: "docs", label: "Documents", type: "docs", section: "fileTypes" })
    },
    { 
      icon: <Music className="w-5 h-5" />, 
      label: "Audio", 
      count: loading ? 0 : counts.audio, 
      id: "audio",
      type: "audio",
      section: "fileTypes",
      isActive: activeNavigation.id === "audio",
      onClick: () => onNavigationChange({ id: "audio", label: "Audio", type: "audio", section: "fileTypes" })
    },
    { 
      icon: <Archive className="w-5 h-5" />, 
      label: "Archives", 
      count: loading ? 0 : counts.archives, 
      id: "archives",
      section: "fileTypes",
      isActive: activeNavigation.id === "archives",
      onClick: () => onNavigationChange({ id: "archives", label: "Archives", section: "fileTypes" })
    },
  ];

  // Folders Data
  const foldersData: SidebarItemProps[] = [
    { 
      icon: <FolderOpen className="w-5 h-5" />, 
      label: "All Files", 
      count: loading ? 0 : counts.allFiles, 
      id: "all-files",
      section: "folders",
      isActive: activeNavigation.id === "all-files",
      onClick: () => onNavigationChange({ id: "all-files", label: "All Files", section: "folders" })
    },
  ];

  // Quick Access Data
  const quickAccessData: SidebarItemProps[] = [
    { 
      icon: <Star className="w-5 h-5" />, 
      label: "Starred", 
      count: loading ? 0 : counts.starred, 
      id: "starred",
      section: "quickAccess",
      isActive: activeNavigation.id === "starred",
      onClick: () => onNavigationChange({ id: "starred", label: "Starred", section: "quickAccess" })
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      label: "Recent", 
      count: loading ? 0 : counts.recent, 
      id: "recent",
      section: "quickAccess",
      isActive: activeNavigation.id === "recent",
      onClick: () => onNavigationChange({ id: "recent", label: "Recent", section: "quickAccess" })
    },
    { 
      icon: <Trash2 className="w-5 h-5" />, 
      label: "Trash", 
      count: loading ? 0 : counts.trash, 
      id: "trash",
      section: "quickAccess",
      isActive: activeNavigation.id === "trash",
      onClick: () => onNavigationChange({ id: "trash", label: "Trash", section: "quickAccess" })
    },
  ];

  // All sections data
  const sections = [
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
