import { useState, useEffect } from 'react';
import { getFilesByUser, getFilesByType, getFilesByFolder } from '@/lib/files';
import { getCurrentUser } from '@/lib/auth';
import { NavigationItem } from '@/app/dashboard/page';

export interface FileData {
  id: string;
  fileId: string; // Appwrite file ID for storage
  fileName: string;
  fileType: "images" | "videos" | "docs" | "audio";
  fileSize: string;
  uploadDate: string;
  belongsTo: string;
  isStarred: boolean;
  isTrash: boolean;
}

export function useFiles(activeNavigation: NavigationItem) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        if (!user) return;

        let fetchedFiles;

        switch (activeNavigation.section) {
          case 'fileTypes':
            if (activeNavigation.type) {
              // Fetch files by type (images, videos, docs, audio)
              fetchedFiles = await getFilesByType(user.$id, activeNavigation.type);
            } else {
              // Fetch all files
              fetchedFiles = await getFilesByUser(user.$id);
            }
            break;
          
          case 'folders':
            if (activeNavigation.id === 'all-files') {
              // Fetch all files
              fetchedFiles = await getFilesByUser(user.$id);
            } else {
              // Fetch files by folder (when we implement folder navigation)
              fetchedFiles = await getFilesByFolder(user.$id, activeNavigation.label);
            }
            break;
          
          case 'quickAccess':
            // For now, fetch all files and filter in the component
            // Later we can create specific database queries for starred, recent, trash
            fetchedFiles = await getFilesByUser(user.$id);
            break;
          
          default:
            fetchedFiles = await getFilesByUser(user.$id);
        }

        // Transform database records to FileData format
        const transformedFiles = fetchedFiles.map(file => ({
          id: file.$id, // Database document ID
          fileId: file.fileId, // Appwrite file ID for storage
          fileName: file.fileName,
          fileType: file.fileType,
          fileSize: file.fileSize,
          uploadDate: file.uploadDate,
          belongsTo: file.belongsTo,
          isStarred: file.isStarred,
          isTrash: file.isTrash
        }));

        // Apply additional filtering for quick access
        let filteredFiles = transformedFiles;
        if (activeNavigation.section === 'quickAccess') {
          switch (activeNavigation.id) {
            case 'starred':
              filteredFiles = transformedFiles.filter(file => file.isStarred);
              break;
            case 'recent':
              filteredFiles = transformedFiles.filter(file => {
                const uploadDate = new Date(file.uploadDate);
                const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                return uploadDate > weekAgo;
              });
              break;
            case 'trash':
              filteredFiles = transformedFiles.filter(file => file.isTrash);
              break;
          }
        }

        setFiles(filteredFiles);
      } catch (error) {
        console.error('Error fetching files:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [activeNavigation]);

  return { files, loading };
}
