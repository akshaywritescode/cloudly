import { LoaderIcon } from "lucide-react";

export default function Loader() {
    return (
        <div className="flex items-center justify-center h-[calc(100vh-5rem)]">
            <LoaderIcon className="animate-spin rounded-full h-10 w-10 text-blue-600" />
        </div>
    );
}
