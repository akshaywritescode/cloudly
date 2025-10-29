import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Shield, Save, Camera, Upload, Lock, Eye, EyeOff, Mail, Monitor, Smartphone, Tablet, Trash2, AlertTriangle } from "lucide-react";
import { updateUserProfile, updateUserPassword, initiateEmailVerification, getActiveDevices, terminateSession, terminateAllOtherSessions, Device } from "@/lib/auth";
import { uploadProfilePicture, deleteProfilePicture, getProfilePicturePreview, getUserProfilePicture, ProfilePictureUploadResult } from "@/lib/profile";
import { useRouter } from "next/navigation";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
}

export default function SettingsDialog({
  isOpen,
  onClose,
  userName,
  userEmail
}: SettingsDialogProps) {
  const [name, setName] = React.useState(userName || '');
  const [email, setEmail] = React.useState(userEmail || '');
  const [profilePicture, setProfilePicture] = React.useState<string | null>(null);
  const [profilePictureFileId, setProfilePictureFileId] = React.useState<string | null>(null);
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState('profile');
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Password change states
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  // Profile update states
  const [profilePassword, setProfilePassword] = React.useState('');
  const [showProfilePassword, setShowProfilePassword] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const [isEmailVerificationPending, setIsEmailVerificationPending] = React.useState(false);

  // Device management states
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [isLoadingDevices, setIsLoadingDevices] = React.useState(false);
  const [isTerminatingSession, setIsTerminatingSession] = React.useState<string | null>(null);

  React.useEffect(() => {
    setName(userName || '');
    setEmail(userEmail || '');
  }, [userName, userEmail]);

  // Load existing profile picture when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      loadExistingProfilePicture();
    }
  }, [isOpen]);

  const loadExistingProfilePicture = async () => {
    try {
      const profilePictureUrl = await getUserProfilePicture();
      if (profilePictureUrl) {
        setProfilePicture(profilePictureUrl);
        // Extract file ID from URL if needed for future operations
        // For now, we'll store the URL directly
      }
    } catch (error) {
      console.error('Failed to load existing profile picture:', error);
    }
  };

  // Load devices when privacy tab is active
  React.useEffect(() => {
    if (activeTab === 'privacy') {
      loadDevices();
    }
  }, [activeTab]);

  const loadDevices = async () => {
    setIsLoadingDevices(true);
    try {
      const deviceList = await getActiveDevices();
      setDevices(deviceList);
    } catch (error) {
      console.error('Failed to load devices:', error);
      setError('Failed to load active devices');
    } finally {
      setIsLoadingDevices(false);
    }
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }

      setIsUploadingProfilePicture(true);
      setError('');
      setMessage('');

      try {
        // Upload the profile picture
        const result: ProfilePictureUploadResult = await uploadProfilePicture(file);
        
        if (result.success && result.fileId && result.previewUrl) {
          setProfilePicture(result.previewUrl);
          setProfilePictureFileId(result.fileId);
          setMessage('Profile picture uploaded successfully!');
        } else {
          setError(result.message);
        }
      } catch (error) {
        console.error('Profile picture upload failed:', error);
        setError('Failed to upload profile picture. Please try again.');
      } finally {
        setIsUploadingProfilePicture(false);
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    if (profilePictureFileId) {
      try {
        const result = await deleteProfilePicture(profilePictureFileId);
        if (result.success) {
          setMessage('Profile picture removed successfully!');
        } else {
          setError(result.message);
          return;
        }
      } catch (error) {
        console.error('Profile picture removal failed:', error);
        setError('Failed to remove profile picture. Please try again.');
        return;
      }
    }
    
    setProfilePicture(null);
    setProfilePictureFileId(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setIsChangingPassword(true);
    setError('');
    setMessage('');

    try {
      const result = await updateUserPassword(currentPassword, newPassword);
      
      if (result.success) {
        setMessage(result.message);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to change password:', error);
      setError('Failed to change password. Please try again.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEmailVerification = async () => {
    if (!profilePassword) {
      setError('Please enter your current password to verify email');
      return;
    }

    if (email === userEmail) {
      setError('Please enter a different email address');
      return;
    }

    setIsEmailVerificationPending(true);
    setError('');
    setMessage('');

    try {
      const result = await initiateEmailVerification(email, profilePassword);
      
      if (result.success) {
        // Store the new email in localStorage for the sent-verify-mail page
        localStorage.setItem('verify-email', email);
        
        // Close the dialog first
        onClose();
        
        // Redirect to sent-verify-mail page
        router.push('/sent-verify-mail');
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to initiate email verification:', error);
      setError('Failed to initiate email verification. Please try again.');
    } finally {
      setIsEmailVerificationPending(false);
    }
  };

  const handleTerminateSession = async (sessionId: string) => {
    setIsTerminatingSession(sessionId);
    try {
      const result = await terminateSession(sessionId);
      if (result.success) {
        setMessage(result.message);
        // Reload devices list
        await loadDevices();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to terminate session:', error);
      setError('Failed to terminate session');
    } finally {
      setIsTerminatingSession(null);
    }
  };

  const handleTerminateAllOtherSessions = async () => {
    setIsTerminatingSession('all');
    try {
      const result = await terminateAllOtherSessions();
      if (result.success) {
        setMessage(result.message);
        // Reload devices list
        await loadDevices();
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to terminate other sessions:', error);
      setError('Failed to terminate other sessions');
    } finally {
      setIsTerminatingSession(null);
    }
  };

  const handleSave = async () => {
    // Check if there are changes that require password
    const hasNameChange = name !== userName;
    const hasEmailChange = email !== userEmail;
    
    if ((hasNameChange || hasEmailChange) && !profilePassword) {
      setError('Please enter your current password to save changes');
      return;
    }

    setIsSaving(true);
    setError('');
    setMessage('');

    try {
      const updates: { name?: string } = {};
      
      if (name !== userName) {
        updates.name = name;
      }

      // Note: Profile picture is already uploaded and saved when selected
      // We don't need to include it in the profile update as it's handled separately

      if (Object.keys(updates).length === 0 && !profilePictureFileId) {
        setMessage('No changes to save');
        setIsSaving(false);
        return;
      }

      let result;
      if (Object.keys(updates).length > 0) {
        result = await updateUserProfile(updates, profilePassword);
      } else {
        // If only profile picture was changed, just show success message
        result = { success: true, message: 'Profile picture updated successfully!' };
      }
      
      if (result.success) {
        setMessage(result.message);
        setProfilePassword('');
        // Close dialog after successful update
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const clearMessages = () => {
    setMessage('');
    setError('');
  };

  const getDeviceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-5 h-5" />;
      case 'tablet':
        return <Tablet className="w-5 h-5" />;
      case 'desktop':
        return <Monitor className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className='w-[32rem] max-h-[90vh]'>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-black">
            <Settings className="w-5 h-5" />
            Settings
          </DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[60vh]">
          <Tabs value={activeTab} onValueChange={(value) => { setActiveTab(value); clearMessages(); }} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="privacy" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Privacy & Security
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 py-4 mt-4">
              <div className="space-y-6">
                {/* Profile Picture Section */}
                <div className="space-y-3">
                  <Label>Profile Picture</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profilePicture ? (
                          <img 
                            src={profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors"
                      >
                        <Camera className="w-3 h-3" />
                      </button>
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isUploadingProfilePicture}
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {isUploadingProfilePicture ? "Uploading..." : "Upload Photo"}
                        </Button>
                        {profilePicture && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveProfilePicture}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">
                        JPG, PNG or GIF. Max size 5MB.
                      </p>
                    </div>
                  </div>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                  />
                </div>

                {/* Name and Email Fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex gap-2">
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="flex-1"
                      />
                      {email !== userEmail && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleEmailVerification}
                          disabled={isEmailVerificationPending}
                          className="flex items-center gap-2"
                        >
                          <Mail className="w-4 h-4" />
                          {isEmailVerificationPending ? "Verifying..." : "Verify Email"}
                        </Button>
                      )}
                    </div>
                    {email !== userEmail && (
                      <p className="text-xs text-blue-600">
                        Email changed. Click "Verify Email" to send verification to your new email address.
                      </p>
                    )}
                  </div>

                  {/* Password verification for profile changes */}
                  <div className="space-y-2">
                    <Label htmlFor="profilePassword">Current Password (required for name/email changes)</Label>
                    <div className="relative">
                      <Input
                        id="profilePassword"
                        type={showProfilePassword ? "text" : "password"}
                        value={profilePassword}
                        onChange={(e) => setProfilePassword(e.target.value)}
                        placeholder="Enter your current password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowProfilePassword(!showProfilePassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showProfilePassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                {message && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <p className="text-sm text-green-800">{message}</p>
                  </div>
                )}
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-4 py-4 mt-4">
              <div className="space-y-6">
                {/* Password Change Section */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type={showCurrentPassword ? "text" : "password"}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          className="pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="pt-2">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={isChangingPassword || !currentPassword || !newPassword || !confirmPassword}
                        className="w-full flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        {isChangingPassword ? "Changing Password..." : "Change Password"}
                      </Button>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <p>Password requirements:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>At least 8 characters long</li>
                        <li>Must match confirmation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Active Devices Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Monitor className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-900">Active Devices</h3>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadDevices}
                      disabled={isLoadingDevices}
                    >
                      {isLoadingDevices ? "Loading..." : "Refresh"}
                    </Button>
                  </div>

                  {isLoadingDevices ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : devices.length === 0 ? (
                    <div className="text-center py-8">
                      <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No active devices found</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {devices.map((device) => (
                        <div
                          key={device.id}
                          className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-gray-600">
                              {getDeviceIcon(device.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{device.name}</p>
                                {device.isCurrent && (
                                  <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                                    Current
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-500">{device.location}</p>
                              <p className="text-xs text-gray-400">Last active: {device.lastActive}</p>
                            </div>
                          </div>
                          {!device.isCurrent && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleTerminateSession(device.id)}
                              disabled={isTerminatingSession === device.id}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                      
                      {devices.filter(d => !d.isCurrent).length > 0 && (
                        <div className="pt-2">
                          <Button
                            variant="outline"
                            onClick={handleTerminateAllOtherSessions}
                            disabled={isTerminatingSession === 'all'}
                            className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            {isTerminatingSession === 'all' ? "Terminating..." : "Terminate All Other Sessions"}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose} disabled={isSaving} className='cursor-pointer'>
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || ((name !== userName || email !== userEmail) && !profilePassword)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
