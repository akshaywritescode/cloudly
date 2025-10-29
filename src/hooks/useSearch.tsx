import React, { createContext, useContext, useState, useCallback } from 'react';
import { getStorage, getBucketId } from '@/lib/appwrite';
import { Query } from 'appwrite';

interface SearchResult {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  isTrash: boolean;
  fileId: string;
}

interface SearchContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  performSearch: (query: string) => Promise<void>;
  clearSearch: () => void;
  isSearchActive: boolean;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

interface SearchProviderProps {
  children: React.ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const storage = getStorage();
      const bucketId = getBucketId();
      
      // Search for files that contain the query in their name
      const response = await storage.listFiles(bucketId, [
        Query.search('name', query),
        Query.limit(50) // Limit results for performance
      ]);

      const results: SearchResult[] = response.files.map(file => ({
        id: file.$id,
        fileName: file.name,
        fileType: getFileType(file.name),
        fileSize: formatFileSize(file.sizeOriginal),
        uploadDate: new Date(file.$createdAt).toLocaleDateString(),
        isTrash: file.name.includes('_trash_'), // Simple trash detection
        fileId: file.$id
      }));

      setSearchResults(results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
  }, []);

  const contextValue: SearchContextType = {
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    performSearch,
    clearSearch,
    isSearchActive: searchQuery.trim().length > 0
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// Helper function to determine file type based on extension
const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  
  if (!extension) return 'unknown';
  
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  const videoTypes = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv'];
  const audioTypes = ['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'];
  const docTypes = ['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt'];
  
  if (imageTypes.includes(extension)) return 'images';
  if (videoTypes.includes(extension)) return 'videos';
  if (audioTypes.includes(extension)) return 'audio';
  if (docTypes.includes(extension)) return 'docs';
  
  return 'other';
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
