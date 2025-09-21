import { updateFileRecord, deleteFileRecord } from './files';

export async function moveFileToTrash(documentId: string) {
  try {
    // Update the file record to mark it as trash
    await updateFileRecord(documentId, {
      isTrash: true
    });
    
    return true;
  } catch (error) {
    console.error('Move to trash failed:', error);
    throw new Error('Failed to move file to trash: ' + (error as Error).message);
  }
}

export async function restoreFileFromTrash(documentId: string) {
  try {
    // Update the file record to restore it from trash
    await updateFileRecord(documentId, {
      isTrash: false
    });
    
    return true;
  } catch (error) {
    console.error('Restore from trash failed:', error);
    throw new Error('Failed to restore file from trash: ' + (error as Error).message);
  }
}

export async function permanentlyDeleteFile(documentId: string) {
  try {
    // Permanently delete the file record from database
    await deleteFileRecord(documentId);
    
    return true;
  } catch (error) {
    console.error('Permanent delete failed:', error);
    throw new Error('Failed to permanently delete file: ' + (error as Error).message);
  }
}
