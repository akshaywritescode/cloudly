"use client";

import { Cloud } from "lucide-react";
import { useTheme } from "next-themes";
import React, { ReactNode, useEffect, useState } from "react";

type TLogo = {
    className?: string;
};

export default function ({ className }: TLogo) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid rendering theme-based class until mounted
    const themeClass = !mounted ? "" : theme === "light" ? "text-black" : "text-white";

    return <div className="flex gap-4">
        <Cloud className={`w-8 h-8 ${themeClass} `} />
        <span className={`font-medium text-2xl ${themeClass}`}>Cloudly</span>
    </div>
}