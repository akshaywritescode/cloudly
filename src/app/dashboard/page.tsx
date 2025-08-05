"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Sidebar from "./components/Sidebar";
import { useRef, useState } from "react";

export default function Dashboard() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const sidebarLayout = useRef<any>(null);

  const handleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      if (sidebarLayout.current) {
        sidebarLayout.current.setLayout([next ? 5 : 15, next ? 95 : 85]);
      }
      return next;
    });
  };

  return (
    <ProtectedRoute>
      <div className="h-screen w-full"> {/* 💡 Enforce full height */}
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full"
          ref={sidebarLayout}
        >
          <ResizablePanel defaultSize={15} minSize={5} maxSize={20}>
            <div className="h-full p-3">
              <Sidebar isCollapsed={isCollapsed} setIsCollapsed={handleCollapse} />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={85}>
            <div className="h-full p-6">
              <h1 className="text-2xl font-semibold">Main Dashboard Content</h1>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ProtectedRoute>
  );
}
