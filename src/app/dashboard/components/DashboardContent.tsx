import { Button } from "@/components/ui/button";
import { FolderEdit } from "lucide-react";
import { ContentTable } from "./Content";
import { NavigationItem } from "../page";
import UploadDialog from "./UploadDialog";

interface DashboardContentProps {
  activeNavigation: NavigationItem;
}

export default function DashboardContent({ activeNavigation }: DashboardContentProps){
    return <main className="p-6">
        {/* Content Detail */}
        <div className="flex">
            <h1 className="text-3xl">{activeNavigation.label}</h1>
            <div className="ml-4 flex items-center gap-3">
                <UploadDialog />
                <Button variant={"outline"} size="sm" className="cursor-pointer text-xs rounded-full"><FolderEdit />Create Folder</Button>
            </div>
        </div>
        {/* Content Table */}
        <ContentTable activeNavigation={activeNavigation} />
    </main>
}
