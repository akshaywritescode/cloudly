'use client';

import { 
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
import { SidebarItemProps } from './SidebarItem';
import SidebarSection from './SidebarSection';
import { useFileCounts } from '@/hooks/useFileCounts';
import { useFolders } from '@/hooks/useFolders';
import { useEffect, useRef } from 'react';
import CloudlyLogo from "@/components/CloudlyLogo";
import Separator from "@/components/Separator";

interface SidebarProps {
  activeNavigation: NavigationItem;
  onNavigationChange: (item: NavigationItem) => void;
}

export default function Sidebar({ activeNavigation, onNavigationChange }: SidebarProps) {
  const { counts, loading: countsLoading, refetch: refetchCounts } = useFileCounts();
  const { folders, refetch: refetchFolders } = useFolders();

  // Use useRef to store stable references
  const refetchCountsRef = useRef(refetchCounts);
  const refetchFoldersRef = useRef(refetchFolders);
  refetchCountsRef.current = refetchCounts;
  refetchFoldersRef.current = refetchFolders;

  // Listen for files updated event
  useEffect(() => {
    const handleFilesUpdated = () => {
      console.log('Sidebar: Files updated event received, refetching...');
      refetchCountsRef.current();
      refetchFoldersRef.current();
    };

    window.addEventListener('filesUpdated', handleFilesUpdated);
    
    return () => {
      window.removeEventListener('filesUpdated', handleFilesUpdated);
    };
  }, []); // Empty dependency array - event listeners are stable

  // File Types Data
  const fileTypesData: SidebarItemProps[] = [
    { 
      icon: <Images className="w-5 h-5" />, 
      label: "Images", 
      count: countsLoading ? 0 : counts.images, 
      id: "images",
      type: "images",
      section: "fileTypes",
      isActive: activeNavigation.id === "images",
      onClick: () => onNavigationChange({ id: "images", label: "Images", type: "images", section: "fileTypes" })
    },
    { 
      icon: <Video className="w-5 h-5" />, 
      label: "Videos", 
      count: countsLoading ? 0 : counts.videos, 
      id: "videos",
      type: "videos",
      section: "fileTypes",
      isActive: activeNavigation.id === "videos",
      onClick: () => onNavigationChange({ id: "videos", label: "Videos", type: "videos", section: "fileTypes" })
    },
    { 
      icon: <FileText className="w-5 h-5" />, 
      label: "Documents", 
      count: countsLoading ? 0 : counts.docs, 
      id: "docs",
      type: "docs",
      section: "fileTypes",
      isActive: activeNavigation.id === "docs",
      onClick: () => onNavigationChange({ id: "docs", label: "Documents", type: "docs", section: "fileTypes" })
    },
    { 
      icon: <Music className="w-5 h-5" />, 
      label: "Audio", 
      count: countsLoading ? 0 : counts.audio, 
      id: "audio",
      type: "audio",
      section: "fileTypes",
      isActive: activeNavigation.id === "audio",
      onClick: () => onNavigationChange({ id: "audio", label: "Audio", type: "audio", section: "fileTypes" })
    },
    { 
      icon: <Archive className="w-5 h-5" />, 
      label: "Archives", 
      count: countsLoading ? 0 : counts.archives, 
      id: "archives",
      section: "fileTypes",
      isActive: activeNavigation.id === "archives",
      onClick: () => onNavigationChange({ id: "archives", label: "Archives", section: "fileTypes" })
    },
  ];

  // Dynamic Folders Data
  const foldersData: SidebarItemProps[] = folders.map(folder => {
    // Use original ID for "All Files" folder, add prefix for others
    const folderId = folder.id === 'all-files' ? folder.id : `folder-${folder.name.toLowerCase().replace(/\s+/g, '-')}`;
    
    return {
      icon: <FolderOpen className="w-5 h-5" />,
      label: folder.name,
      count: folder.count,
      id: folderId,
      section: "folders",
      isActive: activeNavigation.id === folderId,
      onClick: () => onNavigationChange({ 
        id: folderId, 
        label: folder.name, 
        section: "folders" 
      })
    };
  });

  // Quick Access Data
  const quickAccessData: SidebarItemProps[] = [
    { 
      icon: <Star className="w-5 h-5" />, 
      label: "Starred", 
      count: countsLoading ? 0 : counts.starred, 
      id: "starred",
      section: "quickAccess",
      isActive: activeNavigation.id === "starred",
      onClick: () => onNavigationChange({ id: "starred", label: "Starred", section: "quickAccess" })
    },
    { 
      icon: <Clock className="w-5 h-5" />, 
      label: "Recent", 
      count: countsLoading ? 0 : counts.recent, 
      id: "recent",
      section: "quickAccess",
      isActive: activeNavigation.id === "recent",
      onClick: () => onNavigationChange({ id: "recent", label: "Recent", section: "quickAccess" })
    },
    { 
      icon: <Trash2 className="w-5 h-5" />, 
      label: "Trash", 
      count: countsLoading ? 0 : counts.trash, 
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
    <div className="w-full h-full flex flex-col select-none">
      {/* Logo Section */}
      <div className="flex w-full items-center justify-center p-4">
        <div className="flex items-center gap-2">
          <CloudlyLogo />
        </div>
        
      </div>
      <Separator className="w-full mt-1.5" />

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto mt-5 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 select-none">
        {sections.map((section, index) => (
          <SidebarSection key={index} {...section} />
        ))}
      </div>
    </div>
  );
}
