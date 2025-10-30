"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./components/Sidebar";
import { useRef, useState } from "react";
import DashboardHeader from "./components/DashboardHeader";
import DashboardContent from "./components/DashboardContent";
import { SearchProvider } from "@/hooks/useSearch";
import { NotificationProvider } from "@/hooks/useNotifications";
import { ThemeProvider } from "@/providers/theme-provider";


export type NavigationItem = {
  id: string;
  label: string;
  type?: "images" | "videos" | "docs" | "audio";
  section: "fileTypes" | "folders" | "quickAccess";
};

export default function Dashboard() {
  const sidebarLayout = useRef<any>(null);
  const [activeNavigation, setActiveNavigation] = useState<NavigationItem>({
    id: "all-files",
    label: "All Files",
    section: "folders"
  });

  const handleNavigationChange = (item: NavigationItem) => {
    setActiveNavigation(item);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProtectedRoute>
        <SearchProvider>
          <NotificationProvider>
            <div className="h-screen w-full"> {/* 💡 Enforce full height */}
              <ResizablePanelGroup
                direction="horizontal"
                className="h-full w-full"
                ref={sidebarLayout}
              >
                <ResizablePanel defaultSize={21} minSize={10} maxSize={20}>
                  <div className="h-full p-3">
                    <Sidebar
                      activeNavigation={activeNavigation}
                      onNavigationChange={handleNavigationChange}
                    />
                  </div>
                </ResizablePanel>

                <ResizableHandle />

                <ResizablePanel defaultSize={85}>
                  <div className="h-full p-1">
                    <DashboardHeader />
                    <DashboardContent activeNavigation={activeNavigation} />
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
          </NotificationProvider>
        </SearchProvider>
      </ProtectedRoute>
    </ThemeProvider>
  );
}

