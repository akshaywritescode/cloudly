import { getStorage, getBucketId } from './appwrite';

export async function downloadFile(fileId: string, fileName: string) {
  try {
    const storage = getStorage();
    const bucketId = getBucketId();
    
    // Get the file as a blob to force download
    const response = await storage.getFileDownload(bucketId, fileId);
    
    // Create blob URL
    const blob = new Blob([response]);
    const blobUrl = URL.createObjectURL(blob);
    
    // Create download link
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download file: ' + (error as Error).message);
  }
}

// Alternative method using fetch for better compatibility
export async function downloadFileWithFetch(fileId: string, fileName: string) {
  try {
    const storage = getStorage();
    const bucketId = getBucketId();
    
    // Get the file URL
    const fileUrl = storage.getFileView(bucketId, fileId);
    
    // Fetch the file
    const response = await fetch(fileUrl.toString());
    const blob = await response.blob();
    
    // Create download link
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = fileName;
    link.style.display = 'none';
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download file: ' + (error as Error).message);
  }
}
