import { useState, useEffect, useCallback } from 'react';
import { getAllFilesByUser } from '@/lib/files';
import { getCurrentUser } from '@/lib/auth';

interface FileCounts {
  images: number;
  videos: number;
  docs: number;
  audio: number;
  archives: number;
  allFiles: number;
  starred: number;
  recent: number;
  trash: number;
}

export function useFileCounts() {
  const [counts, setCounts] = useState<FileCounts>({
    images: 0,
    videos: 0,
    docs: 0,
    audio: 0,
    archives: 0,
    allFiles: 0,
    starred: 0,
    recent: 0,
    trash: 0
  });
  const [loading, setLoading] = useState(true);

  const fetchCounts = useCallback(async () => {
    try {
      console.log('useFileCounts: Fetching counts...');
      const user = await getCurrentUser();
      console.log('useFileCounts: Current user:', user);
      
      if (!user) {
        console.log('useFileCounts: No user found');
        setLoading(false);
        return;
      }

      // Fetch ALL user files (including trash)
      const allFiles = await getAllFilesByUser(user.$id);
      console.log('useFileCounts: All files fetched (including trash):', allFiles.length);
      
      // Calculate counts by type (excluding trash files)
      const nonTrashFiles = allFiles.filter(file => !file.isTrash);
      const typeCounts = nonTrashFiles.reduce((acc, file) => {
        console.log('useFileCounts: Processing file:', file.fileName, 'Type:', file.fileType);
        acc[file.fileType] = (acc[file.fileType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log('useFileCounts: Type counts calculated:', typeCounts);

      // Calculate other counts
      const starredCount = allFiles.filter(file => file.isStarred && !file.isTrash).length;
      const trashCount = allFiles.filter(file => file.isTrash).length;
      const recentCount = allFiles.filter(file => {
        const uploadDate = new Date(file.uploadDate);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        return uploadDate > weekAgo && !file.isTrash;
      }).length;

      const finalCounts = {
        images: typeCounts.images || 0,
        videos: typeCounts.videos || 0,
        docs: typeCounts.docs || 0,
        audio: typeCounts.audio || 0,
        archives: typeCounts.archives || 0,
        allFiles: nonTrashFiles.length, // Only count non-trash files for "All Files"
        starred: starredCount,
        recent: recentCount,
        trash: trashCount
      };

      console.log('useFileCounts: Final counts:', finalCounts);
      setCounts(finalCounts);
    } catch (error) {
      console.error('useFileCounts: Error fetching file counts:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    console.log('useFileCounts: useEffect triggered');
    fetchCounts();
  }, [fetchCounts]);

  return { counts, loading, refetch: fetchCounts };
}
