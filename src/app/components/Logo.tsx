import { Cloud } from "lucide-react";

export default function Logo() {
    return <div className="flex items-center gap-2">
        <Cloud className="w-10 h-10 text-blue-600" />
        <h1 className="text-3xl font-bold text-blue-600">Cloudly</h1>
    </div>
}