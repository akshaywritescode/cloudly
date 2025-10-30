'use client';

import { useState, useEffect } from 'react';
import { Search, User, Settings, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getCurrentUser } from '@/lib/auth';
import { getAccount } from '@/lib/appwrite';
import { getUserProfilePicture } from '@/lib/profile';
import { useRouter } from 'next/navigation';
import { useSearch } from '@/hooks/useSearch';
import LogoutConfirmDialog from './LogoutConfirmDialog';
import SettingsDialog from './SettingsDialog';
import NotificationDropdown from './NotificationDropdown';
import ThemeSwitcher from './ThemeSwitcher';
import { Card } from '@/components/ui/card';


interface User {
  name: string;
  email: string;
  profilePicture?: string | null;
}

export default function DashboardHeader() {
  const [user, setUser] = useState<User | null>(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const { searchQuery, setSearchQuery, performSearch, clearSearch, isSearchActive } = useSearch();

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        // Load profile picture from database
        const profilePicture = await getUserProfilePicture();

        setUser({
          name: currentUser.name,
          email: currentUser.email,
          profilePicture: profilePicture
        });
      }
    };
    fetchUser();
  }, []);

  const handleLogoutClick = () => {
    setShowLogoutDialog(true);
  };

  const handleSettingsClick = () => {
    setShowSettingsDialog(true);
  };

  const handleSettingsClose = () => {
    setShowSettingsDialog(false);
    // Refresh user data including profile picture
    const fetchUser = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser) {
        const profilePicture = await getUserProfilePicture();
        setUser({
          name: currentUser.name,
          email: currentUser.email,
          profilePicture: profilePicture
        });
      }
    };
    fetchUser();
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);
    try {
      const account = getAccount();
      await account.deleteSession('current');
      router.push('/');
    } catch (err: any) {
      alert('Failed to logout: ' + err.message);
    } finally {
      setIsLoggingOut(false);
      setShowLogoutDialog(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      await performSearch(searchQuery.trim());
    }
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);

    // Perform search as user types (with debounce)
    if (value.trim()) {
      const timeoutId = setTimeout(() => {
        performSearch(value.trim());
      }, 300);

      return () => clearTimeout(timeoutId);
    } else {
      clearSearch();
    }
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  return (
    <>
      <Card className="w-[99%] m-auto border-b px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search Bar */}
          <div className="">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search files, folders..."
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="pl-10 pr-10 py-2 w-full"
              />
              {isSearchActive && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </form>
          </div>

          <ThemeSwitcher defaultValue="dark" />

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <NotificationDropdown />

            {/* User Profile Dropdown */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.name || 'Loading...'}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || ''}
                </p>
              </div>

              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                {user?.profilePicture ? (
                  <img
                    src={user.profilePicture}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-gray-600" />
                )}
              </div>

              {/* Settings */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSettingsClick}
                className="cursor-pointer"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogoutClick}
                className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 cursor-pointer" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <LogoutConfirmDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
        onConfirm={handleLogoutConfirm}
        isLoading={isLoggingOut}
        userName={user?.name}
      />

      <SettingsDialog
        isOpen={showSettingsDialog}
        onClose={handleSettingsClose}
        userName={user?.name}
        userEmail={user?.email}
      />
    </>
  );
}
