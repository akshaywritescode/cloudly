import { Cloud } from "lucide-react";

export default function Logo() {
    return <div className="flex items-center gap-2">
        <Cloud className="w-10 h-10 text-black" />
        <h1 className="text-3xl font-bold text-black">Cloudly</h1>
    </div>
}