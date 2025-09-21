import { getDatabase } from './appwrite';
import { ID, Query } from 'appwrite';

export interface FileRecord {
  fileId: string;
  belongsTo: string;
  userId: string;
  fileName: string;
  fileType: "images" | "videos" | "docs" | "audio" | "archives";
  fileSize: string;
  uploadDate: string;
  isStarred: boolean;
  isTrash: boolean;
}

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || 'cloudly-db';
const COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID || 'files';

export async function createFileRecord(fileData: FileRecord) {
  try {
    const database = getDatabase();
    const response = await database.createDocument(
      DATABASE_ID,
      COLLECTION_ID,
      ID.unique(),
      fileData
    );
    return response;
  } catch (error) {
    console.error('Error creating file record:', error);
    throw error;
  }
}

export async function getFilesByUser(userId: string) {
  try {
    const database = getDatabase();
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('isTrash', false)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching files:', error);
    throw error;
  }
}

export async function getTrashFiles(userId: string) {
  try {
    const database = getDatabase();
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('isTrash', true)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching trash files:', error);
    throw error;
  }
}

export async function getAllFilesByUser(userId: string) {
  try {
    const database = getDatabase();
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId)]
    );
    return response.documents;
  } catch (error) {
    console.error('Error fetching all files:', error);
    throw error;
  }
}

export async function getFilesByFolder(userId: string, folderName: string) {
  try {
    const database = getDatabase();
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('belongsTo', folderName), Query.equal('isTrash', false)]
    );
    return response.documents;
  } catch (error) {
    console.error(`Error fetching files for folder ${folderName}:`, error);
    throw error;
  }
}

export async function getFilesByType(userId: string, fileType: string) {
  try {
    const database = getDatabase();
    const response = await database.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [Query.equal('userId', userId), Query.equal('fileType', fileType), Query.equal('isTrash', false)]
    );
    return response.documents;
  } catch (error) {
    console.error(`Error fetching files for type ${fileType}:`, error);
    throw error;
  }
}

export async function updateFileRecord(fileId: string, data: Partial<Omit<FileRecord, 'fileId' | 'userId'>>) {
  try {
    const database = getDatabase();
    const response = await database.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      fileId,
      data
    );
    return response;
  } catch (error) {
    console.error('Error updating file record:', error);
    throw error;
  }
}

export async function deleteFileRecord(fileId: string) {
  try {
    const database = getDatabase();
    await database.deleteDocument(
      DATABASE_ID,
      COLLECTION_ID,
      fileId
    );
  } catch (error) {
    console.error('Error deleting file record:', error);
    throw error;
  }
}
