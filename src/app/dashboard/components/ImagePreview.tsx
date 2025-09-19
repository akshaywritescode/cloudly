import React, { useState } from 'react';
import { FileImage, FileVideo, FileText, Music, Archive } from 'lucide-react';
import { getStorage } from '@/lib/appwrite';

interface ImagePreviewProps {
  fileId: string;
  fileName: string;
  fileType: "images" | "videos" | "docs" | "audio";
  className?: string;
}

export default function ImagePreview({ fileId, fileName, fileType, className = "w-8 h-8" }: ImagePreviewProps) {
  const [imageError, setImageError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  React.useEffect(() => {
    if (fileType === 'images') {
      const getImageUrl = async () => {
        try {
          const storage = getStorage();
          const bucketId = process.env.NEXT_PUBLIC_APPWRITE_CLOUDLY_BUCKET_MAIN;
          
          if (bucketId) {
            // Use the fileId directly as it's the Appwrite file ID
            const url = storage.getFilePreview(bucketId, fileId);
            setImageUrl(url.toString());
          }
        } catch (error) {
          console.error('Error getting image URL:', error);
          setImageError(true);
        }
      };

      getImageUrl();
    }
  }, [fileId, fileType]);

  const getFileIcon = () => {
    switch (fileType) {
      case 'images':
        return <FileImage className="w-4 h-4" />;
      case 'videos':
        return <FileVideo className="w-4 h-4" />;
      case 'docs':
        return <FileText className="w-4 h-4" />;
      case 'audio':
        return <Music className="w-4 h-4" />;
      default:
        return <Archive className="w-4 h-4" />;
    }
  };

  if (fileType === 'images' && imageUrl && !imageError) {
    return (
      <div className={`${className} rounded border border-gray-200 overflow-hidden bg-gray-50 flex-shrink-0`}>
        <img
          src={imageUrl}
          alt={fileName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Fallback to icon for non-images or when image fails to load
  return (
    <div className={`${className} rounded border border-gray-200 bg-gray-50 flex items-center justify-center flex-shrink-0`}>
      <div className="text-gray-500">
        {getFileIcon()}
      </div>
    </div>
  );
}
