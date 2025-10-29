import { getDatabase } from './appwrite';
import { getCurrentUser } from './auth';
import { Query } from 'appwrite';

// Get database and collection IDs from environment
export function getUsersDbConfig() {
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_USERS_DB_ID as string;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USER_METADATA_COLLECTION_ID as string;
  
  if (!databaseId || !collectionId) {
    throw new Error('Database configuration environment variables must be defined');
  }
  
  return { databaseId, collectionId };
}

export interface NotificationData {
  notification_count: number;
  notification: string | null;
  last_updated?: string;
}

export const getUserNotifications = async (): Promise<NotificationData | null> => {
  try {
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return null;
    }

    const databases = getDatabase();
    
    const userMetadata = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("userId", user.$id)]
    );

    if (userMetadata.documents.length > 0) {
      const doc = userMetadata.documents[0];
      return {
        notification_count: doc.notification_count || 0,
        notification: doc.notification || null,
        last_updated: doc.$updatedAt
      };
    }

    // Return default values if no document exists
    return {
      notification_count: 0,
      notification: null
    };
  } catch (error) {
    console.error('Failed to get user notifications:', error);
    return null;
  }
};

export const updateNotificationCount = async (count: number): Promise<boolean> => {
  try {
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }

    const databases = getDatabase();
    
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
          notification_count: count
        }
      );
    } else {
      // Create new document if it doesn't exist
      await databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        {
          userId: user.$id,
          notification_count: count,
          notification: null,
          onboardingCompleted: false
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Failed to update notification count:', error);
    return false;
  }
};

export const addNotification = async (message: string): Promise<boolean> => {
  try {
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }

    const databases = getDatabase();
    
    const userMetadata = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("userId", user.$id)]
    );

    if (userMetadata.documents.length > 0) {
      const currentDoc = userMetadata.documents[0];
      const currentCount = currentDoc.notification_count || 0;
      
      // Update existing document
      await databases.updateDocument(
        databaseId,
        collectionId,
        currentDoc.$id,
        {
          notification_count: currentCount + 1,
          notification: message
        }
      );
    } else {
      // Create new document if it doesn't exist
      await databases.createDocument(
        databaseId,
        collectionId,
        'unique()',
        {
          userId: user.$id,
          notification_count: 1,
          notification: message,
          onboardingCompleted: false
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Failed to add notification:', error);
    return false;
  }
};

export const clearNotifications = async (): Promise<boolean> => {
  try {
    const { databaseId, collectionId } = getUsersDbConfig();
    const user = await getCurrentUser();
    
    if (!user) {
      return false;
    }

    const databases = getDatabase();
    
    const userMetadata = await databases.listDocuments(
      databaseId,
      collectionId,
      [Query.equal("userId", user.$id)]
    );

    if (userMetadata.documents.length > 0) {
      await databases.updateDocument(
        databaseId,
        collectionId,
        userMetadata.documents[0].$id,
        {
          notification_count: 0,
          notification: null
        }
      );
    }

    return true;
  } catch (error) {
    console.error('Failed to clear notifications:', error);
    return false;
  }
};
