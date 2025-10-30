"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  count?: number;
  isActive?: boolean;
  onClick?: () => void;
  id: string;
  type?: "images" | "videos" | "docs" | "audio";
  section: "fileTypes" | "folders" | "quickAccess";
}

export default function SidebarItem({ icon, label, count, isActive, onClick }: SidebarItemProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering theme-based class until mounted
  const themeClass = !mounted ? "" : theme === "light" ? "text-black" : "text-white/80";

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors select-none ${isActive
        ? 'bg-blue-50 text-blue-700 border border-blue-200'
        : `hover:bg-gray-50 hover:text-black ${themeClass}`
        }`}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        <div className={`w-5 h-5 ${isActive ? 'text-blue-700' : `${themeClass}`}`}>
          {icon}
        </div>
        <span className="font-medium text-sm">{label}</span>
      </div>
      {count !== undefined && (
        <span className="min-w-5 min-h-5 w-5.5 h-5.5 flex items-center justify-center text-xs text-white bg-blue-700 px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </div>
  );
}
