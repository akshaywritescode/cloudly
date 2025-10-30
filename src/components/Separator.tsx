"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type TSeparator = {
  className?: string;
};

export default function Separator({ className }: TSeparator) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid rendering theme-based class until mounted
  const themeClass = !mounted ? "" : theme === "light" ? "bg-black/10" : "bg-white/10";

  return <div className={`${className} ${themeClass} h-[1px]`} />;
}