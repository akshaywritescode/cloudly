import React from 'react';
import Image from 'next/image';
import { Search, FileText, Image as ImageIcon, Video, Music, Archive } from 'lucide-react';
import { useSearch } from '@/hooks/useSearch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { downloadFile } from '@/lib/download';
import ImagePreview from './ImagePreview';
import sadIllustration from '@/app/assets/sad-illustration.svg';

const SearchResults: React.FC = () => {
  const { searchQuery, searchResults, isSearching, clearSearch } = useSearch();

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'images':
        return <ImageIcon className="w-5 h-5 text-blue-500" />;
      case 'videos':
        return <Video className="w-5 h-5 text-red-500" />;
      case 'audio':
        return <Music className="w-5 h-5 text-green-500" />;
      case 'docs':
        return <FileText className="w-5 h-5 text-orange-500" />;
      default:
        return <Archive className="w-5 h-5 text-gray-500" />;
    }
  };

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      await downloadFile(fileId, fileName);
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download file. Please try again.');
    }
  };

  if (!searchQuery.trim()) {
    return null;
  }

  if (isSearching) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Search className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Search Results for "{searchQuery}"
          </h1>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Searching...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Search className="w-6 h-6 text-gray-600" />
          <h1 className="text-2xl font-semibold text-gray-900">
            Search Results for "{searchQuery}"
          </h1>
          <span className="text-sm text-gray-500">
            ({searchResults.length} results)
          </span>
        </div>
        <Button 
          variant="outline" 
          onClick={clearSearch}
          className="flex items-center gap-2"
        >
          Clear Search
        </Button>
      </div>

      {searchResults.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Image
            src={sadIllustration}
            width={192}
            height={192}
            className="w-48 h-48 object-contain mb-6"
            alt="No results found"
          />
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              No files found
            </h3>
            <p className="text-gray-500 max-w-md">
              No files match your search for "{searchQuery}". Try different keywords or check your spelling.
            </p>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {searchResults.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {file.fileType === 'images' ? (
                        <ImagePreview 
                          fileId={file.fileId} 
                          fileName={file.fileName} 
                          fileType={file.fileType}
                          className="w-8 h-8"
                        />
                      ) : (
                        <div className="w-8 h-8 flex items-center justify-center">
                          {getFileIcon(file.fileType)}
                        </div>
                      )}
                      <div>
                        <div className="font-medium">{file.fileName}</div>
                        {file.isTrash && (
                          <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                            In Trash
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="capitalize">{file.fileType}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    {file.fileSize}
                  </TableCell>
                  <TableCell>
                    {file.uploadDate}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(file.fileId, file.fileName)}
                      className="cursor-pointer"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
