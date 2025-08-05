import { ArrowLeftToLine, Cloud, ArrowRightToLine } from "lucide-react";

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {


    return <div className="w-full select-none">
        {/* logo & collapseible*/}
        <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
                <Cloud className="w-5 h-5 text-black" />
                <span className="font-medium">Cloudly</span>
            </div>


            {
                isCollapsed ? <ArrowRightToLine onClick={() => setIsCollapsed((prevState) => !prevState)} className="w-4 h-4 cursor-pointer" /> : <ArrowLeftToLine onClick={() => setIsCollapsed((prevState) => !prevState)} className="w-4 h-4 cursor-pointer" />
            }
        </div>
    </div>
}