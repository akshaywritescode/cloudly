'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, File, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getStorage, getBucketId } from '@/lib/appwrite';
import { createFileRecord, FileRecord } from '@/lib/files';
import { ID } from 'appwrite';
import { getCurrentUser } from '@/lib/auth';

interface UploadDialogProps {
  onUploadComplete?: () => void;
}

export default function UploadDialog({ onUploadComplete }: UploadDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [folderName, setFolderName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);
  const [currentFileName, setCurrentFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileType = (file: File): "images" | "videos" | "docs" | "audio" | "archives" => {
    const type = file.type.toLowerCase();
    if (type.startsWith('image/')) return 'images';
    if (type.startsWith('video/')) return 'videos';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('zip') || type.includes('rar') || type.includes('7z') || type.includes('tar') || type.includes('gz')) return 'archives';
    return 'docs';
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Smooth progress simulation that only moves forward
  const simulateSmoothProgress = (fileSize: number, onProgress: (progress: number) => void) => {
    return new Promise<void>((resolve) => {
      // Estimate upload time based on file size (assuming average 1MB/s upload speed)
      const estimatedUploadTimeMs = Math.max(1000, (fileSize / (1024 * 1024)) * 1000); // Minimum 1 second
      const updateInterval = 50; // Update every 50ms
      const totalUpdates = Math.floor(estimatedUploadTimeMs / updateInterval);
      
      let currentUpdate = 0;
      let lastProgress = 0; // Track last progress to ensure forward movement
      
      const interval = setInterval(() => {
        currentUpdate++;
        
        // Use easing function for more realistic progress (ease-out)
        const rawProgress = (currentUpdate / totalUpdates) * 100;
        const easedProgress = 100 - Math.pow(100 - rawProgress, 3) / 10000; // Ease-out cubic
        const progress = Math.min(easedProgress, 95);
        
        // Ensure progress only moves forward
        const finalProgress = Math.max(lastProgress, progress);
        lastProgress = finalProgress;
        
        onProgress(finalProgress);
        
        if (currentUpdate >= totalUpdates) {
          clearInterval(interval);
          resolve();
        }
      }, updateInterval);
    });
  };

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);
    setCurrentFileIndex(0);
    setCurrentFileName('');
    setUploadStatus('Preparing upload...');

    try {
      const storage = getStorage();
      const bucketId = getBucketId();
      const user = await getCurrentUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        setCurrentFileIndex(i + 1);
        setCurrentFileName(file.name);
        
        // Calculate progress range for current file
        const fileProgressStart = (i / selectedFiles.length) * 100;
        const fileProgressEnd = ((i + 1) / selectedFiles.length) * 100;
        const fileProgressRange = fileProgressEnd - fileProgressStart;
        
        setUploadStatus(`Uploading ${file.name}...`);
        
        // Start smooth progress simulation
        const progressPromise = simulateSmoothProgress(file.size, (progress) => {
          const mappedProgress = fileProgressStart + (progress / 100) * fileProgressRange * 0.9;
          setUploadProgress(mappedProgress);
        });

        // Upload file to Appwrite storage
        const fileId = ID.unique();
        
        // Start both upload and progress simulation concurrently
        const uploadPromise = storage.createFile(bucketId, fileId, file);
        
        // Wait for both to complete
        const [uploadResponse] = await Promise.all([uploadPromise, progressPromise]);
        
        // Complete upload progress (90-95%)
        setUploadProgress(fileProgressStart + fileProgressRange * 0.95);
        setUploadStatus(`Saving ${file.name} to database...`);

        // Create database record
        const fileData: FileRecord = {
          fileId: uploadResponse.$id,
          belongsTo: folderName.trim() || 'All Files',
          userId: user.$id,
          fileName: file.name,
          fileType: getFileType(file),
          fileSize: formatFileSize(file.size),
          uploadDate: new Date().toLocaleString(),
          isStarred: false,
          isTrash: false
        };

        // Save to database
        await createFileRecord(fileData);

        // Complete this file's progress (95-100%)
        setUploadProgress(fileProgressEnd);
        setUploadStatus(`${file.name} uploaded successfully!`);
        
        // Small delay to show completion
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      setUploadStatus('All files uploaded successfully!');
      
      // Reset form after a short delay
      setTimeout(() => {
        setSelectedFiles([]);
        setFolderName('');
        setIsOpen(false);
        setCurrentFileIndex(0);
        setCurrentFileName('');
        setUploadStatus('');
        
        if (onUploadComplete) {
          onUploadComplete();
        }
      }, 1500);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadStatus(`Upload failed: ${(error as Error).message}`);
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      setCurrentFileIndex(0);
      setCurrentFileName('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="cursor-pointer text-xs rounded-full">
          <Upload className="w-4 h-4 mr-1" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Folder Selection */}
          <div className="space-y-2">
            <Label htmlFor="folder">Folder (Optional)</Label>
            <div className="flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-gray-500" />
              <Input
                id="folder"
                placeholder="Enter folder name or leave empty for 'All Files'..."
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
            <p className="text-xs text-gray-500">
              Files will be saved to "All Files" folder if no folder name is provided.
            </p>
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <Label>Select Files</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to select files or drag and drop
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected Files */}
          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Files ({selectedFiles.length})</Label>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {isUploading && (
            <div className="space-y-2">
              <Label>Upload Progress</Label>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    {currentFileIndex > 0 && `File ${currentFileIndex} of ${selectedFiles.length}`}
                  </span>
                  <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
                </div>
                {currentFileName && (
                  <p className="text-xs text-gray-500 truncate">
                    {uploadStatus}
                  </p>
                )}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-200 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 text-center">
                  Note: Progress is estimated based on file size and network conditions
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button
              onClick={uploadFiles}
              disabled={selectedFiles.length === 0 || isUploading}
            >
              {isUploading ? 'Uploading...' : `Upload ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
