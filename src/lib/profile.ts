import { getStorage, getDatabase } from './appwrite';
import { getCurrentUser } from './auth';

// Get profile bucket ID from environment
export function getProfileBucketId() {
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_CLOUDLY_BUCKET_PROFILE as string;
  if (!bucketId) {
    throw new Error('NEXT_PUBLIC_APPWRITE_CLOUDLY_BUCKET_PROFILE environment variable must be defined');
  }
  return bucketId;
}

// Get database and collection IDs from environment
export function getUsersDbConfig() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_USERS_DB_ID as string;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USER_METADATA_COLLECTION_ID as string;
  
  if (!databaseId || !collectionId) {
    throw new Error('Database configuration environment variables must be defined');
  }
  
  return { databaseId, collectionId };
}

export interface ProfilePictureUploadResult {
  success: boolean;
  message: string;
  fileId?: string;
  previewUrl?: string;
}

export const uploadProfilePicture = async (file: File): Promise<ProfilePictureUploadResult> => {
  try {
    const storage = getStorage();
    const bucketId = getProfileBucketId();
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    // Create a unique filename with user ID and timestamp
    const fileExtension = file.name.split('.').pop();
    const fileName = `profile_${user.$id}_${Date.now()}.${fileExtension}`;

    // Upload the file
    const response = await storage.createFile(
      bucketId,
      'unique()', // Let Appwrite generate unique ID
      file,
      [
        // Add permissions - user can read and write their own profile picture
        `read("user:${user.$id}")`,
        `write("user:${user.$id}")`,
        // Make it publicly readable for display
        'read("any")'
      ]
    );

    // Get the preview URL for immediate display
    const previewUrl = getStorage().getFilePreview(bucketId, response.$id);

    // Update user's profile_picture_url in database
    try {
      const databases = getDatabase();
      
      console.log('Attempting to update database for user:', user.$id);
      console.log('Database ID:', databaseId);
      console.log('Collection ID:', collectionId);
      
      // Find user's metadata document using Query
      const { Query } = await import('appwrite');
      
      const userMetadata = await databases.listDocuments(
        databaseId,
        collectionId,
        [Query.equal("userId", user.$id)]
      );

      console.log('Found documents:', userMetadata.documents.length);

      if (userMetadata.documents.length > 0) {
        // Update existing document
        console.log('Updating existing document:', userMetadata.documents[0].$id);
        await databases.updateDocument(
          databaseId,
          collectionId,
          userMetadata.documents[0].$id,
          {
            profile_picture_url: previewUrl.toString()
          }
        );
        console.log('Database update successful');
      } else {
        // Create new document if it doesn't exist
        console.log('Creating new document for user');
        await databases.createDocument(
          databaseId,
          collectionId,
          'unique()',
          {
            userId: user.$id,
            profile_picture_url: previewUrl.toString(),
            onboardingCompleted: false
          }
        );
        console.log('New document created successfully');
      }
    } catch (dbError) {
      console.error('Database update failed with error:', dbError);
      console.error('Error details:', JSON.stringify(dbError, null, 2));
      
      // Return error but don't fail the entire operation
      return {
        success: false,
        message: `Profile picture uploaded but database update failed: ${dbError instanceof Error ? dbError.message : 'Unknown error'}`
      };
    }

    return {
      success: true,
      message: 'Profile picture uploaded successfully',
      fileId: response.$id,
      previewUrl: previewUrl.toString()
    };
  } catch (error: any) {
    console.error('Profile picture upload failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to upload profile picture'
    };
  }
};

export const deleteProfilePicture = async (fileId: string): Promise<ProfilePictureUploadResult> => {
  try {
    const storage = getStorage();
    const bucketId = getProfileBucketId();
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return { success: false, message: 'User not authenticated' };
    }

    // Delete the file from storage
    await storage.deleteFile(bucketId, fileId);

    // Update user's profile_picture_url in database to null or empty
    try {
      const databases = getDatabase();
      const { Query } = await import('appwrite');
      
      // Find user's metadata document
      const userMetadata = await databases.listDocuments(
        databaseId,
        collectionId,
        [Query.equal("userId", user.$id)]
      );

      if (userMetadata.documents.length > 0) {
        // Update existing document
        await databases.updateDocument(
          databaseId,
          collectionId,
          userMetadata.documents[0].$id,
          {
            profile_picture_url: null
          }
        );
        console.log('Profile picture URL cleared from database');
      }
    } catch (dbError) {
      console.error('Failed to update database:', dbError);
      // Don't fail the entire operation if database update fails
    }

    return {
      success: true,
      message: 'Profile picture deleted successfully'
    };
  } catch (error: any) {
    console.error('Profile picture deletion failed:', error);
    return {
      success: false,
      message: error.message || 'Failed to delete profile picture'
    };
  }
};

export const getProfilePictureUrl = (fileId: string): string => {
  const storage = getStorage();
  const bucketId = getProfileBucketId();
  return storage.getFileView(bucketId, fileId).toString();
};

export const getProfilePicturePreview = (fileId: string): string => {
  const storage = getStorage();
  const bucketId = getProfileBucketId();
  return storage.getFilePreview(bucketId, fileId).toString();
};

// Function to get user's profile picture URL from database
export const getUserProfilePicture = async (): Promise<string | null> => {
  try {
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }

    const databases = getDatabase();
    const { Query } = await import('appwrite');
    
    const userMetadata = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("userId", user.$id)]
    );

    if (userMetadata.documents.length > 0) {
      return userMetadata.documents[0].profile_picture_url || null;
    }

    return null;
  } catch (error) {
    console.error('Failed to get user profile picture:', error);
    return null;
  }
};
