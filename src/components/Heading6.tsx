"use client";

import { useTheme } from "next-themes";
import React, { ReactNode, useEffect, useState } from "react";

type THeading = {
    className?: string;
    children: ReactNode
};

export default function Heading6({ className, children }: THeading) {
    const { theme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Avoid rendering theme-based class until mounted
    const themeClass = !mounted ? "" : theme === "light" ? "text-black/10" : "text-white/80";

    return <h6 className={`${className} ${themeClass}`}>{children}</h6>
}