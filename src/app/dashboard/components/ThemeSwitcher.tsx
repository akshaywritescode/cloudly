//Run The following command to install required shadcn component
//npx shadcn@latest add tabs

"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Laptop, MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes"

type TThemeSwicther = {
    defaultValue: "system" | "light" | "dark",
    className?: "string"
}

export default function ThemeSwitcher({ defaultValue }: TThemeSwicther) {
    const { setTheme } = useTheme();

    return (
        <Tabs defaultValue={defaultValue}>
            <TabsList>
                <TabsTrigger value="system" onClick={() => setTheme("system")}>
                    <Laptop className="w-4" />
                </TabsTrigger>
                <TabsTrigger value="dark" onClick={() => setTheme("dark")}>
                    <MoonIcon className="w-4" />
                </TabsTrigger>
                <TabsTrigger value="light" onClick={() => setTheme("light")}>
                    <SunIcon className="w-4" />
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}