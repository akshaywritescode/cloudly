import { Button } from "@/components/ui/button";
import { FolderEdit } from "lucide-react";
import { ContentTable } from "./Content";
import { NavigationItem } from "../page";
import UploadDialog from "./UploadDialog";
import { useFileCounts } from "@/hooks/useFileCounts";
import { useFolders } from "@/hooks/useFolders";

interface DashboardContentProps {
  activeNavigation: NavigationItem;
}

export default function DashboardContent({ activeNavigation }: DashboardContentProps){
    const { refetch: refetchCounts } = useFileCounts();
    const { refetch: refetchFolders } = useFolders();

    const handleUploadComplete = async () => {
        console.log('Upload completed, refreshing data...');
        
        try {
            // Add a small delay to ensure database is updated
            console.log('Waiting 500ms before refreshing counts...');
            await new Promise(resolve => setTimeout(resolve, 500));
            
            await refetchCounts();
            console.log('Counts refreshed after upload');
            await refetchFolders();
            console.log('Folders refreshed after upload');
            
            // Dispatch a custom event to notify other components
            window.dispatchEvent(new CustomEvent('filesUpdated'));
            
            console.log('Files updated event dispatched');
        } catch (error) {
            console.error('Error refreshing after upload:', error);
        }
    };

    return <main className="p-6">
        {/* Content Detail */}
        <div className="flex">
            <h1 className="text-3xl">{activeNavigation.label}</h1>
            <div className="ml-4 flex items-center gap-3">
                <UploadDialog onUploadComplete={handleUploadComplete} />
                <Button variant={"outline"} size="sm" className="cursor-pointer text-xs rounded-full">
                    <FolderEdit />Create Folder
                </Button>
            </div>
        </div>
        {/* Content Table */}
        <ContentTable 
            activeNavigation={activeNavigation} 
        />
    </main>
}
