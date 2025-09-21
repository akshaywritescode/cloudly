import { useState, useEffect, useCallback } from 'react';
import { getAllFilesByUser } from '@/lib/files';
import { getCurrentUser } from '@/lib/auth';

export interface FolderItem {
  id: string;
  name: string;
  count: number;
}

export function useFolders() {
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFolders = useCallback(async () => {
    setLoading(true);
    try {
      console.log('useFolders: Fetching folders...');
      const user = await getCurrentUser();
      if (!user) {
        console.log('useFolders: No user found');
        setFolders([]);
        return;
      }

      const allFiles = await getAllFilesByUser(user.$id); // Fetch all files including trash
      console.log('useFolders: All files fetched:', allFiles.length);
      const nonTrashFiles = allFiles.filter(file => !file.isTrash); // Filter out trash for folder counts
      console.log('useFolders: Non-trash files:', nonTrashFiles.length);

      const folderMap = new Map<string, number>();
      nonTrashFiles.forEach(file => {
        const folderName = file.belongsTo || 'All Files'; // Ensure 'All Files' default
        folderMap.set(folderName, (folderMap.get(folderName) || 0) + 1);
      });

      const fetchedFolders: FolderItem[] = Array.from(folderMap.entries()).map(([name, count]) => ({
        id: name.toLowerCase().replace(/\s/g, '-'), // Create a simple ID
        name,
        count,
      }));

      // Ensure "All Files" is always present and at the top
      let allFilesFolder: FolderItem | undefined = fetchedFolders.find(f => f.id === 'all-files');
      if (!allFilesFolder) {
        allFilesFolder = { id: 'all-files', name: 'All Files', count: nonTrashFiles.length };
        fetchedFolders.unshift(allFilesFolder); // Add to the beginning
      } else {
        allFilesFolder.count = nonTrashFiles.length; // Update count for existing "All Files"
        // Move "All Files" to the beginning if it's not already
        const index = fetchedFolders.findIndex(f => f.id === 'all-files');
        if (index > 0) {
          const [removed] = fetchedFolders.splice(index, 1);
          fetchedFolders.unshift(removed);
        }
      }

      // Sort other folders alphabetically
      const sortedFolders = [
        allFilesFolder,
        ...fetchedFolders.filter(f => f.id !== 'all-files').sort((a, b) => a.name.localeCompare(b.name))
      ];

      console.log('useFolders: Final folders:', sortedFolders);
      setFolders(sortedFolders);
    } catch (error) {
      console.error('useFolders: Error fetching folders:', error);
      setFolders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('useFolders: useEffect triggered');
    fetchFolders();
  }, [fetchFolders]);

  return { folders, loading, refetch: fetchFolders };
}
