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

export default function Dashboard() {
  const sidebarLayout = useRef<any>(null);


  return (
    <ProtectedRoute>
      <div className="h-screen w-full"> {/* 💡 Enforce full height */}
        <ResizablePanelGroup
          direction="horizontal"
          className="h-full w-full"
          ref={sidebarLayout}
        >
          <ResizablePanel defaultSize={15} minSize={10} maxSize={20}>
            <div className="h-full p-3">
              <Sidebar  />
            </div>
          </ResizablePanel>

          <ResizableHandle />

          <ResizablePanel defaultSize={85}>
            <div className="h-full p-1">
              <DashboardHeader />
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ProtectedRoute>
  );
}
