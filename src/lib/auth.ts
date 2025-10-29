import { getAccount } from "./appwrite";

export const getCurrentUser = async () => {
  try {
    const account = getAccount();
    return await account.get();
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateUserName = async (newName: string) => {
  try {
    const account = getAccount();
    await account.updateName(newName);
    return { success: true, message: "Name updated successfully" };
  } catch (error: any) {
    console.error("Error updating name:", error);
    return { success: false, message: error.message || "Failed to update name" };
  }
};

export const updateUserEmail = async (newEmail: string, password: string) => {
  try {
    const account = getAccount();
    await account.updateEmail(newEmail, password);
    return { success: true, message: "Email update initiated. Please check your new email for verification." };
  } catch (error: any) {
    console.error("Error updating email:", error);
    return { success: false, message: error.message || "Failed to update email" };
  }
};

export const updateUserPassword = async (oldPassword: string, newPassword: string) => {
  try {
    const account = getAccount();
    await account.updatePassword(newPassword, oldPassword);
    return { success: true, message: "Password updated successfully" };
  } catch (error: any) {
    console.error("Error updating password:", error);
    return { success: false, message: error.message || "Failed to update password" };
  }
};

export const updateUserProfile = async (updates: {
  name?: string;
  email?: string;
  password?: string;
}, currentPassword: string) => {
  try {
    const results = [];
    
    if (updates.name) {
      const nameResult = await updateUserName(updates.name);
      results.push({ field: 'name', ...nameResult });
    }
    
    if (updates.email) {
      const emailResult = await updateUserEmail(updates.email, currentPassword);
      results.push({ field: 'email', ...emailResult });
    }
    
    if (updates.password) {
      const passwordResult = await updateUserPassword(currentPassword, updates.password);
      results.push({ field: 'password', ...passwordResult });
    }
    
    const hasErrors = results.some(result => !result.success);
    
    return {
      success: !hasErrors,
      message: hasErrors 
        ? "Some updates failed. Please check the details."
        : "Profile updated successfully",
      results
    };
  } catch (error: any) {
    console.error("Error updating profile:", error);
    return { success: false, message: error.message || "Failed to update profile" };
  }
};

export const initiateEmailVerification = async (newEmail: string, password: string) => {
  try {
    const account = getAccount();
    
    // First, update the email (this will send verification to new email)
    await account.updateEmail(newEmail, password);
    
    // Then create verification for the new email
    await account.createVerification(`${window.location.origin}/verify-account`);
    
    return { 
      success: true, 
      message: "Email verification sent to your new email address. Please check your inbox and verify the new email before it becomes active." 
    };
  } catch (error: any) {
    console.error("Error initiating email verification:", error);
    return { success: false, message: error.message || "Failed to initiate email verification" };
  }
};

// Device management functions
export interface Device {
  id: string;
  name: string;
  type: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  userAgent: string;
}

export const getActiveDevices = async (): Promise<Device[]> => {
  try {
    const account = getAccount();
    const sessions = await account.listSessions();
    const currentSession = await account.getSession('current');
    
    const devices: Device[] = sessions.sessions.map((session: any) => {
      const userAgent = session.userAgent || '';
      const deviceInfo = parseUserAgent(userAgent);
      
      return {
        id: session.$id,
        name: deviceInfo.name,
        type: deviceInfo.type,
        location: deviceInfo.location,
        lastActive: new Date(session.$updatedAt).toLocaleString(),
        isCurrent: session.$id === currentSession.$id,
        userAgent: userAgent
      };
    });
    
    return devices;
  } catch (error: any) {
    console.error("Error fetching active devices:", error);
    return [];
  }
};

export const terminateSession = async (sessionId: string) => {
  try {
    const account = getAccount();
    await account.deleteSession(sessionId);
    return { success: true, message: "Session terminated successfully" };
  } catch (error: any) {
    console.error("Error terminating session:", error);
    return { success: false, message: error.message || "Failed to terminate session" };
  }
};

export const terminateAllOtherSessions = async () => {
  try {
    const account = getAccount();
    const sessions = await account.listSessions();
    const currentSession = await account.getSession('current');
    
    const otherSessions = sessions.sessions.filter((session: any) => 
      session.$id !== currentSession.$id
    );
    
    for (const session of otherSessions) {
      await account.deleteSession(session.$id);
    }
    
    return { 
      success: true, 
      message: `Terminated ${otherSessions.length} other sessions successfully` 
    };
  } catch (error: any) {
    console.error("Error terminating other sessions:", error);
    return { success: false, message: error.message || "Failed to terminate other sessions" };
  }
};

// Helper function to parse user agent and extract device info
const parseUserAgent = (userAgent: string) => {
  const ua = userAgent.toLowerCase();
  
  // Determine device type
  let type = 'Unknown';
  let name = 'Unknown Device';
  
  if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
    type = 'Mobile';
    if (ua.includes('iphone')) {
      name = 'iPhone';
    } else if (ua.includes('android')) {
      name = 'Android Device';
    } else {
      name = 'Mobile Device';
    }
  } else if (ua.includes('tablet') || ua.includes('ipad')) {
    type = 'Tablet';
    name = ua.includes('ipad') ? 'iPad' : 'Tablet';
  } else if (ua.includes('windows')) {
    type = 'Desktop';
    name = 'Windows PC';
  } else if (ua.includes('macintosh') || ua.includes('mac os')) {
    type = 'Desktop';
    name = 'Mac';
  } else if (ua.includes('linux')) {
    type = 'Desktop';
    name = 'Linux PC';
  } else {
    type = 'Desktop';
    name = 'Computer';
  }
  
  // Determine browser
  let browser = '';
  if (ua.includes('chrome')) browser = 'Chrome';
  else if (ua.includes('firefox')) browser = 'Firefox';
  else if (ua.includes('safari')) browser = 'Safari';
  else if (ua.includes('edge')) browser = 'Edge';
  else if (ua.includes('opera')) browser = 'Opera';
  
  // Determine location (simplified - in real app you'd use IP geolocation)
  const location = 'Unknown Location';
  
  return {
    name: `${name}${browser ? ` (${browser})` : ''}`,
    type,
    location
  };
};
