import { useState, useEffect } from 'react';
import { getFilesByUser } from '@/lib/files';
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

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user = await getCurrentUser();
        console.log('Current user:', user);
        
        if (!user) {
          console.log('No user found');
          setLoading(false);
          return;
        }

        // Fetch all user files
        const allFiles = await getFilesByUser(user.$id);
        console.log('All files fetched:', allFiles);
        
        // Calculate counts by type
        const typeCounts = allFiles.reduce((acc, file) => {
          console.log('Processing file:', file.fileName, 'Type:', file.fileType);
          acc[file.fileType] = (acc[file.fileType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        console.log('Type counts calculated:', typeCounts);

        // Calculate other counts
        const starredCount = allFiles.filter(file => file.isStarred).length;
        const trashCount = allFiles.filter(file => file.isTrash).length;
        const recentCount = allFiles.filter(file => {
          const uploadDate = new Date(file.uploadDate);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return uploadDate > weekAgo;
        }).length;

        const finalCounts = {
          images: typeCounts.images || 0,
          videos: typeCounts.videos || 0,
          docs: typeCounts.docs || 0,
          audio: typeCounts.audio || 0,
          archives: typeCounts.archives || 0,
          allFiles: allFiles.length,
          starred: starredCount,
          recent: recentCount,
          trash: trashCount
        };

        console.log('Final counts:', finalCounts);
        setCounts(finalCounts);
      } catch (error) {
        console.error('Error fetching file counts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  return { counts, loading };
}
