import { Cloud } from "lucide-react";

export default function Logo({color}: {color: string}) {
    return <div className="flex items-center gap-2">
        <Cloud className={`w-8 h-8 ${color} md:w-9 md:h-9 lg:w-10 lg:h-10`} />
        <h1 className={`text-2xl font-bold ${color} md:text-3xl lg:text-3xl`}>Cloudly</h1>
    </div>
}