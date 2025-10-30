import { getStorage, getBucketId } from './appwrite';

export async function downloadFile(fileId: string, fileName: string) {
  try {
    const storage = getStorage();
    const bucketId = getBucketId();
    
    // Get the file download URL
    const fileUrl = storage.getFileDownload(bucketId, fileId);
    
    // Fetch the actual file content from the URL
    const response = await fetch(fileUrl.toString());
    
    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status} ${response.statusText}`);
    }
    
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
    
    // Clean up blob URL
    URL.revokeObjectURL(blobUrl);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw new Error('Failed to download file: ' + (error as Error).message);
  }
}
