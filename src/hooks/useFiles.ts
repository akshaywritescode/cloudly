import { useState, useEffect, useCallback } from 'react';
import { getFilesByUser, getFilesByType, getFilesByFolder, getTrashFiles, getAllFilesByUser } from '@/lib/files';
import { getCurrentUser } from '@/lib/auth';
import { NavigationItem } from '@/app/dashboard/page';

export interface FileData {
  id: string;
  fileId: string; // Appwrite file ID for storage
  fileName: string;
  fileType: "images" | "videos" | "docs" | "audio" | "archives";
  fileSize: string;
  uploadDate: string;
  belongsTo: string;
  isStarred: boolean;
  isTrash: boolean;
}

export function useFiles(activeNavigation: NavigationItem) {
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = useCallback(async (navigation: NavigationItem) => {
    try {
      console.log('useFiles: Fetching files for navigation:', navigation);
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) {
        console.log('useFiles: No user found');
        setFiles([]);
        return;
      }

      let fetchedFiles;

      switch (navigation.section) {
        case 'fileTypes':
          if (navigation.type) {
            console.log('useFiles: Fetching files by type:', navigation.type);
            // Fetch files by type (images, videos, docs, audio)
            fetchedFiles = await getFilesByType(user.$id, navigation.type);
          } else {
            console.log('useFiles: Fetching all files');
            // Fetch all files
            fetchedFiles = await getFilesByUser(user.$id);
          }
          break;
        
        case 'folders':
          // Extract folder name from navigation ID
          const folderName = navigation.label;
          console.log('useFiles: Fetching files for folder:', folderName);
          if (folderName === 'All Files') {
            // Fetch all files (excluding trash)
            fetchedFiles = await getFilesByUser(user.$id);
          } else {
            // Fetch files by specific folder
            fetchedFiles = await getFilesByFolder(user.$id, folderName);
          }
          break;
        
        case 'quickAccess':
          console.log('useFiles: Fetching quick access files for:', navigation.id);
          if (navigation.id === 'trash') {
            // Fetch trash files specifically
            fetchedFiles = await getTrashFiles(user.$id);
          } else {
            // For starred and recent, fetch all files and filter
            fetchedFiles = await getAllFilesByUser(user.$id);
          }
          break;
        
        default:
          console.log('useFiles: Default case - fetching all files');
          fetchedFiles = await getFilesByUser(user.$id);
      }

      console.log('useFiles: Fetched files count:', fetchedFiles.length);

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

      // Apply additional filtering for quick access (except trash)
      let filteredFiles = transformedFiles;
      if (navigation.section === 'quickAccess' && navigation.id !== 'trash') {
        switch (navigation.id) {
          case 'starred':
            filteredFiles = transformedFiles.filter(file => file.isStarred && !file.isTrash);
            break;
          case 'recent':
            filteredFiles = transformedFiles.filter(file => {
              const uploadDate = new Date(file.uploadDate);
              const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
              return uploadDate > weekAgo && !file.isTrash;
            });
            break;
        }
      }

      console.log('useFiles: Final filtered files count:', filteredFiles.length);
      setFiles(filteredFiles);
    } catch (error) {
      console.error('useFiles: Error fetching files:', error);
      setFiles([]);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array - function is stable

  useEffect(() => {
    console.log('useFiles: useEffect triggered for navigation:', activeNavigation);
    fetchFiles(activeNavigation);
  }, [activeNavigation, fetchFiles]);

  // Create a stable refetch function
  const refetch = useCallback(() => {
    fetchFiles(activeNavigation);
  }, [fetchFiles, activeNavigation]);

  return { files, loading, refetch };
}
